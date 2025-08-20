import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square, Upload, FileText, MapPin } from "lucide-react";

interface AdminControlsProps {
  raceStarted: boolean;
  onStartRace: () => void;
  onEndRace: () => void;
  onRouteUploaded?: (routeData: any) => void;
}

export function AdminControls({
  raceStarted,
  onStartRace,
  onEndRace,
  onRouteUploaded,
}: AdminControlsProps) {
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".gpx")) {
      setGpxFile(file);
    }
  };

  const processGPXFile = async () => {
    if (!gpxFile) return;

    setIsProcessing(true);

    try {
      const text = await gpxFile.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      // Extract track points from GPX
      const trackPoints = xmlDoc.querySelectorAll("trkpt");
      const coordinates: [number, number][] = [];

      trackPoints.forEach((point) => {
        const lat = Number.parseFloat(point.getAttribute("lat") || "0");
        const lon = Number.parseFloat(point.getAttribute("lon") || "0");
        // --- CAMBIO CLAVE AQUÍ ---
        // Se cambia el orden a [lat, lon] para compatibilidad con Leaflet
        coordinates.push([lat, lon]);
      });

      const processedRoute = {
        name: gpxFile.name.replace(".gpx", ""),
        coordinates,
        distance: calculateDistance(coordinates),
        elevationGain: calculateElevationGain(xmlDoc),
      };

      setRouteData(processedRoute);
      onRouteUploaded?.(processedRoute);
    } catch (error) {
      console.error("Error processing GPX file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateDistance = (coordinates: [number, number][]) => {
    // Simple distance calculation (in reality, you'd use a proper geospatial library)
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1] = coordinates[i - 1];
      const [lon2, lat2] = coordinates[i];

      // Haversine formula for distance calculation
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }
    return totalDistance;
  };

  const calculateElevationGain = (xmlDoc: Document) => {
    const elevations = Array.from(xmlDoc.querySelectorAll("ele")).map((el) =>
      Number.parseFloat(el.textContent || "0")
    );

    let totalGain = 0;
    for (let i = 1; i < elevations.length; i++) {
      const gain = elevations[i] - elevations[i - 1];
      if (gain > 0) totalGain += gain;
    }

    return totalGain;
  };

  return (
    <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Race Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100%-60px)]">
        {/* GPX Upload */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-white mb-4">
            <FileText className="w-5 h-5" />
            <h3 className="font-semibold">Route Upload</h3>
          </div>

          <div className="space-y-3">
            <Input
              type="file"
              accept=".gpx"
              onChange={handleFileUpload}
              className="bg-white/10 border-white/20 text-white file:bg-purple-500 file:text-white file:border-0 file:rounded-md"
            />

            {gpxFile && (
              <div className="text-sm space-y-1">
                <div className="text-green-400">✓ {gpxFile.name}</div>
                <div className="text-gray-300">
                  Size: {(gpxFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            )}

            {routeData && (
              <div className="text-sm space-y-1 p-2 bg-white/10 rounded">
                <div className="text-blue-400 font-semibold">
                  {routeData.name}
                </div>
                <div className="text-gray-300">
                  Distance: {routeData.distance.toFixed(1)} km
                </div>
                <div className="text-gray-300">
                  Elevation: +{routeData.elevationGain.toFixed(0)}m
                </div>
                <div className="text-gray-300">
                  Points: {routeData.coordinates.length}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              disabled={!gpxFile || isProcessing}
              onClick={processGPXFile}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Process GPX
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Race Controls */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-white mb-4">
            <Play className="w-5 h-5" />
            <h3 className="font-semibold">Controls</h3>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onStartRace}
              disabled={raceStarted || !routeData}
              className="w-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Race
            </Button>

            <Button
              onClick={onEndRace}
              disabled={!raceStarted}
              variant="destructive"
              className="w-full"
            >
              <Square className="w-4 h-4 mr-2" />
              End Race
            </Button>

            {!routeData && (
              <div className="text-xs text-yellow-400 text-center">
                Upload and process a GPX route first
              </div>
            )}
          </div>
        </div>

        {/* GPS Status */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-white mb-4">
            <MapPin className="w-5 h-5" />
            <h3 className="font-semibold">GPS Status</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="text-gray-300">
              Race Status:{" "}
              <span className={raceStarted ? "text-green-400" : "text-red-400"}>
                {raceStarted ? "Active" : "Stopped"}
              </span>
            </div>
            <div className="text-gray-300">
              GPS Accuracy: <span className="text-green-400">±2.5m</span>
            </div>
            <div className="text-gray-300">
              Update Rate: <span className="text-blue-400">2s</span>
            </div>
            <div className="text-gray-300">
              Connected Devices: <span className="text-blue-400">12/15</span>
            </div>
            <div className="text-gray-300">
              Map Provider: <span className="text-purple-400">Mapbox</span>
            </div>
            {routeData && (
              <div className="text-gray-300">
                Route Loaded: <span className="text-green-400">✓</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
