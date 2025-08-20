import type { Runner } from "./types";

function getDistance(p1: [number, number], p2: [number, number]): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (p2[0] - p1[0]) * (Math.PI / 180);
  const dLon = (p2[1] - p1[1]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1[0] * (Math.PI / 180)) *
      Math.cos(p2[0] * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getAccumulatedDistances(coordinates: [number, number][]): number[] {
    let totalDistance = 0;
    const accumulated = [0];
    for (let i = 1; i < coordinates.length; i++) {
        totalDistance += getDistance(coordinates[i - 1], coordinates[i]);
        accumulated.push(totalDistance);
    }
    return accumulated;
}

export function calculateRunnerProgress(
  runnerPosition: { lat: number, lng: number },
  routeCoordinates: [number, number][],
  accumulatedDistances: number[]
): { progress: number; distanceCovered: number } {
  if (routeCoordinates.length < 2) return { progress: 0, distanceCovered: 0 };

  let closestSegmentIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const dist = getDistance([runnerPosition.lat, runnerPosition.lng], routeCoordinates[i]);
    if (dist < minDistance) {
      minDistance = dist;
      closestSegmentIndex = i;
    }
  }

  const distanceToSegmentStart = accumulatedDistances[closestSegmentIndex];

  const additionalDistance = getDistance(
    [runnerPosition.lat, runnerPosition.lng], 
    routeCoordinates[closestSegmentIndex]
  );

  const distanceCovered = distanceToSegmentStart + additionalDistance;
  const totalRouteDistance = accumulatedDistances[accumulatedDistances.length - 1];
  const progress = (distanceCovered / totalRouteDistance) * 100;

  return { progress: Math.min(100, progress), distanceCovered };
}