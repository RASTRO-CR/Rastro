"use client";
import { useState, useEffect } from "react";
import { ModernNavbar } from "@/components/modern-navbar";
import { RaceMonitorPage } from "@/components/race-monitor-page";
import { RaceConfigPage } from "@/components/race-config-page";
import type { Runner, Alert } from "@/lib/types";
import axios from "axios";
import {
  calculateRunnerProgress,
  getAccumulatedDistances,
} from "@/lib/gpxUtils"; // <-- IMPORTAR

// URL base de tu API. Asegúrate de que sea accesible desde donde ejecutas el frontend.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const POLLING_INTERVAL_MS = 5000;

interface ApiCyclist {
  id: string;
  nombre: string;
  equipo: string;
  edad: number;
  lat?: number;
  lng?: number;
  spd?: number;
  timestamp?: string;
  batteryLevel?: number;
}

// --- Función para transformar datos del API al formato del Frontend ---
const transformApiDataToRunner = (
  cyclists: ApiCyclist[],
  routeData: {
    coordinates: [number, number][];
    accumulatedDistances: number[];
    distance: number;
  } | null
): Runner[] => {
  return cyclists.map((cyclist) => {
    let progress = 0;
    let distanceToFinish = routeData ? routeData.distance : 0;

    if (routeData && cyclist.lat && cyclist.lng) {
      const { progress: calculatedProgress, distanceCovered } =
        calculateRunnerProgress(
          { lat: cyclist.lat, lng: cyclist.lng },
          routeData.coordinates,
          routeData.accumulatedDistances
        );
      progress = calculatedProgress;
      distanceToFinish = routeData.distance - distanceCovered;
    }

    return {
      id: cyclist.id,
      name: cyclist.nombre,
      position: {
        lat: cyclist.lat || 0,
        lng: cyclist.lng || 0,
      },
      speed: cyclist.spd || 0,
      lastUpdate: cyclist.timestamp || new Date().toISOString(),
      progress: progress,
      distanceToFinish: Math.max(0, distanceToFinish),
      heartRate: 150 + Math.floor(Math.random() * 20),
      batteryLevel: cyclist.batteryLevel || 85,
    };
  });
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"race" | "config">("race");
  const [selectedRunner, setSelectedRunner] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [raceStarted, setRaceStarted] = useState(true);

  const [runners, setRunners] = useState<Runner[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRunners = async () => {
      try {
        const response = await axios.get<{ ciclistas: ApiCyclist[] }>(
          `${API_BASE_URL}/ciclistas/con-posicion`
        );

        console.log("Fetched runner data:", response.data);

        const transformedRunners = transformApiDataToRunner(
          response.data.ciclistas,
          routeData
        );
        setRunners(transformedRunners);
        setError(null);
      } catch (err) {
        console.error("Error fetching runner data:", err);
        setError(
          "No se pudo conectar con el servidor para obtener los datos de los corredores."
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Primera llamada inmediata
    fetchRunners();

    // Configurar el intervalo para repetir la llamada
    const intervalId = setInterval(fetchRunners, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [routeData]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get<Alert[]>(`${API_BASE_URL}/alertas/`);
        setAlerts(response.data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    };

    fetchAlerts();
    const intervalId = setInterval(fetchAlerts, POLLING_INTERVAL_MS + 2000); // Un poco más lento que los corredores

    return () => clearInterval(intervalId);
  }, []);

  const handleStartRace = () => {
    if (routeData) {
      setRaceStarted(true);
    }
  };

  const handleEndRace = () => {
    setRaceStarted(false);
  };

  const handleRunnerSelect = (runnerId: string) => {
    setSelectedRunner(runnerId);
  };

  const handleRouteUploaded = (newRouteData: any) => {
    const accumulatedDistances = getAccumulatedDistances(
      newRouteData.coordinates
    );
    setRouteData({ ...newRouteData, accumulatedDistances });
  };

  const unreadAlerts = alerts.filter((alert) => !alert.resolved).length;

  if (isLoading) {
    // --- PANTALLA DE CARGA INICIAL ---
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Conectando al servidor...</h2>
          <p className="text-gray-400">
            Obteniendo datos de la carrera en tiempo real.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    // --- PANTALLA DE ERROR ---
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="text-center bg-red-900/50 border border-red-500 p-8 rounded-lg">
          <h2 className="text-xl font-semibold text-red-400">
            Error de Conexión
          </h2>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isAdmin={true}
        connectionStatus={{
          connected: !error,
          connectionState: error ? "error" : "connected",
        }}
        activeRunners={runners.length}
        unreadAlerts={unreadAlerts}
      />

      {currentPage === "race" ? (
        <RaceMonitorPage
          runners={runners}
          alerts={alerts}
          selectedRunner={selectedRunner}
          routeData={routeData}
          connectionState={{
            connected: !error,
            connectionState: error ? "error" : "connected",
            lastUpdate: new Date().toLocaleTimeString(),
          }}
          onRunnerSelect={handleRunnerSelect}
          isAdmin={true}
        />
      ) : (
        <RaceConfigPage
          runners={runners}
          alerts={alerts}
          raceStarted={raceStarted}
          routeData={routeData}
          connectionState={{
            connected: !error,
            connectionState: error ? "error" : "connected",
            lastUpdate: new Date().toLocaleTimeString(),
          }}
          onStartRace={handleStartRace}
          onEndRace={handleEndRace}
          onRouteUploaded={handleRouteUploaded}
        />
      )}
    </div>
  );
}
