import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// --- CONFIGURACIÓN ---
const RUNNER_ID_TO_TRACK = "ciclista1"; // <-- ¡Aquí definimos el corredor que nos interesa!
const API_URL = `http://192.168.100.60:8000/datos/${RUNNER_ID_TO_TRACK}`; // ¡ASEGÚRATE DE QUE ESTA IP SEA CORRECTA!
const POLLING_INTERVAL_MS = 5000; // Pedir datos nuevos cada 5 segundos

// --- TIPOS DE DATOS ---
// interface RunnerData {
//   id: string;
//   lat: number;
//   lng: number;
// }

interface RunnerData {
  id: number;
  ciclista_id: string;
  timestamp: string;
  lat: number;
  lng: number;
  spd: number;
  // ... puedes añadir los otros campos si los necesitas
}

interface RunnerState {
  position: [number, number];
  path: [number, number][];
}

// Arreglo para el icono por defecto de Leaflet que se rompe con React
// Type assertion to avoid 'any'
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LiveTrackingMap = () => {
  // Usamos un mapa (diccionario) para guardar el estado de cada corredor
  //   const [runners, setRunners] = useState<Map<string, RunnerState>>(new Map());
  const [runner, setRunner] = useState<RunnerState | null>(null);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get<{ ciclistas: RunnerData[] }>(API_URL);
  //         const newRunnersData = response.data.ciclistas;

  //         setRunners(prevRunners => {
  //           const newRunnersState = new Map(prevRunners);

  //           newRunnersData.forEach(runner => {
  //             const currentPosition: [number, number] = [runner.lat, runner.lng];
  //             const existingRunner = newRunnersState.get(runner.id);

  //             if (existingRunner) {
  //               // Si el corredor ya existe, añadimos la nueva posición a su ruta
  //               existingRunner.position = currentPosition;
  //               existingRunner.path.push(currentPosition);
  //             } else {
  //               // Si es un corredor nuevo, lo creamos
  //               newRunnersState.set(runner.id, {
  //                 position: currentPosition,
  //                 path: [currentPosition],
  //               });
  //             }
  //           });
  //           return newRunnersState;
  //         });

  //       } catch (error) {
  //         console.error("Error al obtener datos del backend:", error);
  //       }
  //     };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // La respuesta ahora es un objeto con una clave "dato"
        const response = await axios.get<{ dato: RunnerData }>(API_URL);
        const runnerData = response.data.dato;

        if (runnerData && runnerData.lat && runnerData.lng) {
          const currentPosition: [number, number] = [
            runnerData.lat,
            runnerData.lng,
          ];

          setRunner((prevRunner) => {
            if (prevRunner) {
              // Si ya teníamos datos, actualizamos la posición y la ruta
              return {
                position: currentPosition,
                path: [...prevRunner.path, currentPosition],
              };
            } else {
              // Si es la primera vez, creamos el estado inicial
              return {
                position: currentPosition,
                path: [currentPosition],
              };
            }
          });
        }
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    fetchData(); // Llamada inicial
    const intervalId = setInterval(fetchData, POLLING_INTERVAL_MS); // Polling cada X segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []);

  // Convertimos el mapa de corredores a un array para poder renderizarlo
  //   const runnerArray = Array.from(runners.entries());

  return (
    <MapContainer
      center={[9.93, -84.05]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* {runnerArray.map(([id, state]) => (
        <React.Fragment key={id}>
          <Marker position={state.position}>
            <Popup>{id}</Popup>
          </Marker>
          <Polyline pathOptions={{ color: '#39FF14' }} positions={state.path} />
        </React.Fragment>
      ))} */}
      {runner && (
        <React.Fragment>
          <Marker position={runner.position}>
            <Popup>{RUNNER_ID_TO_TRACK}</Popup>
          </Marker>
          <Polyline
            pathOptions={{ color: "#39FF14" }}
            positions={runner.path}
          />
        </React.Fragment>
      )}
    </MapContainer>
  );
};

export default LiveTrackingMap;
