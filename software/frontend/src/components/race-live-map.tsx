"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Runner } from "@/lib/types"

// Arreglo para el icono por defecto de Leaflet que a veces se rompe con Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// --- Componente interno para centrar el mapa ---
interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}
const ChangeView = ({ center, zoom }: ChangeViewProps) => {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
}

// --- Creación de iconos personalizados para los corredores ---
const createRunnerIcon = (isSelected: boolean, isLeader: boolean) => {
  const className = `runner-leaflet-icon ${isSelected ? 'selected' : ''} ${isLeader ? 'leader' : ''}`;
  const iconSize: [number, number] = isSelected ? [28, 28] : [20, 20];
  
  return L.divIcon({
    html: `<span class="runner-dot" />`,
    className,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
  });
};

// --- Estilos para los iconos (añadir al final de index.css) ---
/*
.runner-leaflet-icon .runner-dot {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--neon-cyan);
  border: 2px solid white;
  box-shadow: 0 0 10px var(--neon-cyan);
  transition: all 0.3s ease;
}
.runner-leaflet-icon.leader .runner-dot {
  background-color: var(--cyber-yellow);
  box-shadow: 0 0 12px var(--cyber-yellow);
}
.runner-leaflet-icon.selected .runner-dot {
  background-color: var(--neon-pink);
  box-shadow: 0 0 15px var(--neon-pink);
  transform: scale(1.2);
}
*/


interface RaceLiveMapProps {
  runners: Runner[]
  selectedRunner: string | null
  routeData?: { coordinates: [number, number][] }
  onRunnerSelect: (runnerId: string) => void
}

export function RaceLiveMap({ runners, selectedRunner, routeData, onRunnerSelect }: RaceLiveMapProps) {
  const leader = runners.length > 0 ? runners.reduce((prev, current) => (prev.progress > current.progress ? prev : current)) : null;
  const selectedRunnerData = runners.find(r => r.id === selectedRunner);

  // Posición central del mapa
  const mapCenter: [number, number] = selectedRunnerData 
    ? [selectedRunnerData.position.lat, selectedRunnerData.position.lng] 
    : (leader ? [leader.position.lat, leader.position.lng] : [9.4747, -83.9142]); // Coordenadas por defecto

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-white/20">
      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: "100%", width: "100%", backgroundColor: '#0a0a0f' }}
        scrollWheelZoom={true}
      >
        {/* Usamos el componente para centrar el mapa dinámicamente */}
        <ChangeView center={mapCenter} zoom={15} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Dibujar la ruta de la carrera si existe */}
        {routeData && routeData.coordinates && (
          <Polyline 
            positions={routeData.coordinates} 
            pathOptions={{ color: 'var(--neon-pink)', weight: 4, opacity: 0.7 }} 
          />
        )}

        {/* Dibujar los marcadores de los corredores */}
        {runners.map((runner) => (
          <Marker
            key={runner.id}
            position={[runner.position.lat, runner.position.lng]}
            icon={createRunnerIcon(runner.id === selectedRunner, runner.id === leader?.id)}
            eventHandlers={{
              click: () => {
                onRunnerSelect(runner.id)
              },
            }}
          >
            <Popup>
              <div className="text-white bg-gray-900/80 p-1 rounded-md border-none">
                <b className="text-cyan-400">{runner.name}</b><br />
                Velocidad: {runner.speed.toFixed(1)} km/h<br />
                Progreso: {runner.progress.toFixed(1)}%
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}