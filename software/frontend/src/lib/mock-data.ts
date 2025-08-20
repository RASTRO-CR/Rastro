import type { Runner, Alert } from "./types"

// More realistic GPS coordinates for Costa Rica (Chirripó area)
export const mockRunners: Runner[] = [
  {
    id: "R001",
    name: "Carlos Rodríguez",
    position: { lat: 9.4747, lng: -83.9142 },
    speed: 32.5,
    progress: 78.2,
    distanceToFinish: 18.6,
    batteryLevel: 85,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R002",
    name: "María González",
    position: { lat: 9.4755, lng: -83.9155 },
    speed: 31.8,
    progress: 76.8,
    distanceToFinish: 19.8,
    batteryLevel: 92,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R003",
    name: "José Hernández",
    position: { lat: 9.4762, lng: -83.9168 },
    speed: 30.2,
    progress: 75.1,
    distanceToFinish: 21.3,
    batteryLevel: 78,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R004",
    name: "Ana Morales",
    position: { lat: 9.477, lng: -83.918 },
    speed: 29.7,
    progress: 73.5,
    distanceToFinish: 22.7,
    batteryLevel: 65,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R005",
    name: "Luis Vargas",
    position: { lat: 9.4778, lng: -83.9195 },
    speed: 28.9,
    progress: 72.3,
    distanceToFinish: 23.7,
    batteryLevel: 88,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R006",
    name: "Sofia Castro",
    position: { lat: 9.4785, lng: -83.921 },
    speed: 27.5,
    progress: 70.8,
    distanceToFinish: 25.0,
    batteryLevel: 45,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R007",
    name: "Diego Moreno",
    position: { lat: 9.4792, lng: -83.9225 },
    speed: 26.8,
    progress: 69.2,
    distanceToFinish: 26.3,
    batteryLevel: 72,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
  {
    id: "R008",
    name: "Carmen Jiménez",
    position: { lat: 9.48, lng: -83.924 },
    speed: 25.9,
    progress: 67.8,
    distanceToFinish: 27.5,
    batteryLevel: 91,
    lastUpdate: "2025-01-08T10:30:00Z",
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "A001",
    type: "accident",
    severity: "critical",
    runnerId: "R003",
    message: "High impact detected at coordinates 9.4762, -83.9168. Immediate assistance required.",
    timestamp: "10:28:45",
    gForce: 8.5,
    resolved: false,
  },
  {
    id: "A002",
    type: "off-route",
    severity: "medium",
    runnerId: "R006",
    message: "Runner has deviated 150m from the planned route near checkpoint 3.",
    timestamp: "10:25:12",
    resolved: false,
  },
  {
    id: "A003",
    type: "low-battery",
    severity: "high",
    runnerId: "R006",
    message: "GPS device battery level critical (45%). Signal may be lost soon.",
    timestamp: "10:22:30",
    resolved: false,
  },
  {
    id: "A004",
    type: "system",
    severity: "low",
    runnerId: "R002",
    message: "GPS signal temporarily weak due to tree coverage. Monitoring.",
    timestamp: "10:20:15",
    resolved: true,
  },
  {
    id: "A005",
    type: "off-route",
    severity: "low",
    runnerId: "R007",
    message: "Minor route deviation detected. Runner back on track.",
    timestamp: "10:18:33",
    resolved: true,
  },
]

// Simulate more realistic GPS coordinate updates
export const updateRunnerPositions = (runners: Runner[]): Runner[] => {
  return runners.map((runner) => {
    // Simulate movement along the route with some randomness
    const latChange = (Math.random() - 0.5) * 0.0005 // ~50m variation
    const lngChange = (Math.random() - 0.5) * 0.0005

    // Ensure runners generally move forward (increase lng slightly)
    const forwardMovement = Math.random() * 0.0002

    return {
      ...runner,
      position: {
        lat: runner.position.lat + latChange,
        lng: runner.position.lng + lngChange + forwardMovement,
      },
      speed: Math.max(0, runner.speed + (Math.random() - 0.5) * 3),
      progress: Math.min(100, runner.progress + Math.random() * 0.3),
      distanceToFinish: Math.max(0, runner.distanceToFinish - Math.random() * 0.05),
      lastUpdate: new Date().toISOString(),
    }
  })
}
