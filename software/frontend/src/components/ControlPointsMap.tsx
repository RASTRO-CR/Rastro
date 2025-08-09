import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import controlPointsData from "../data/controlPoints.json";

// --- TIPOS DE DATOS ---
interface ControlPoint {
  id: number;
  lugar: string;
  modulo_cc: [number, number];
  modulo_corredor: [number, number];
  google_maps: [number, number];
}

const controlPoints: ControlPoint[] = controlPointsData as ControlPoint[];

// --- ICONOS PERSONALIZADOS ---
const createIcon = (backgroundColor: string) => new L.DivIcon({
  html: `<span style="background-color: ${backgroundColor}; width: 1rem; height: 1rem; display: block; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></span>`,
  className: "dummy",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const ccIcon = createIcon("#3b82f6"); // Azul
const corredorIcon = createIcon("#22c55e"); // Verde
const googleMapsIcon = createIcon("#ef4444"); // Rojo

// --- COMPONENTE DE LEYENDA ---
const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";
      
      const items = [
        { color: "#ef4444", label: "Google Maps (Oficial)" },
        { color: "#3b82f6", label: "Módulo CC" },
        { color: "#22c55e", label: "Módulo Corredor" },
      ];

      let innerHTML = "<h4>Leyenda</h4>";
      items.forEach(item => {
        innerHTML += `<div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <i style="background: ${item.color}; width: 18px; height: 18px; border-radius: 50%; margin-right: 8px; border: 1px solid #555;"></i>
                        <span>${item.label}</span>
                      </div>`;
      });
      
      div.innerHTML = innerHTML;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};


const ControlPointsMap = () => {
  // Extraemos las coordenadas para las polilíneas
  const ccPath: LatLngExpression[] = controlPoints.map(p => p.modulo_cc);
  const corredorPath: LatLngExpression[] = controlPoints.map(p => p.modulo_corredor);
  const googleMapsPath: LatLngExpression[] = controlPoints.map(p => p.google_maps);

  return (
    <MapContainer
      center={[9.937, -84.038]}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      <Legend />

      {/* --- DIBUJAMOS LAS RUTAS --- */}
      <Polyline pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.7 }} positions={ccPath} />
      <Polyline pathOptions={{ color: "#22c55e", weight: 4, opacity: 0.7 }} positions={corredorPath} />
      <Polyline pathOptions={{ color: "#ef4444", weight: 4, opacity: 0.7 }} positions={googleMapsPath} />

      {/* --- DIBUJAMOS LOS MARCADORES --- */}
      {controlPoints.map((point) => (
        <React.Fragment key={point.id}>
          {/* Marcador para Módulo CC */}
          <Marker position={point.modulo_cc} icon={ccIcon}>
            <Popup>
              <b>{point.lugar}</b><br />
              Tipo: Módulo CC <br />
              Coords: {point.modulo_cc.join(', ')}
            </Popup>
          </Marker>

          {/* Marcador para Módulo Corredor */}
          <Marker position={point.modulo_corredor} icon={corredorIcon}>
            <Popup>
              <b>{point.lugar}</b><br />
              Tipo: Módulo Corredor <br />
              Coords: {point.modulo_corredor.join(', ')}
            </Popup>
          </Marker>

           {/* Marcador para Google Maps */}
           <Marker position={point.google_maps} icon={googleMapsIcon}>
            <Popup>
              <b>{point.lugar}</b><br />
              Tipo: Google Maps (Oficial) <br />
              Coords: {point.google_maps.join(', ')}
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default ControlPointsMap;
