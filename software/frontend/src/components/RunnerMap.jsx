// src/components/RunnerMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Box, Typography, LinearProgress } from '@mui/material';

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RunnerMap = () => {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Centro inicial del mapa (Bogotá como ejemplo)
  const mapCenter = [9.933725, -84.052325];  // Coordenadas del centro de Costa Rica
  const zoomLevel = 8;
  
  // Personalizar iconos por corredor
  const runnerIcons = {
    1: L.divIcon({ html: ':man_running:', className: 'runner-icon', iconSize: [30, 30] }),
    2: L.divIcon({ html: ':woman_running:', className: 'runner-icon', iconSize: [30, 30] }),
    default: L.divIcon({ html: ':round_pushpin:', className: 'runner-icon', iconSize: [25, 25] })
  };

  // Obtener datos de corredores
  const fetchRunnerData = async () => {
    try {
      // Paso 1: Obtener lista de ciclistas
      const ciclistasRes = await axios.get('http://192.168.100.6:8000/ciclistas/');
      const ciclistaIds = ciclistasRes.data.ciclistas.map(c => c[0]); // [id, nombre, ...]
      
      // Paso 2: Obtener datos de cada ciclista en paralelo
      const runnersData = await Promise.all(
        ciclistaIds.map(async (id) => {
          const datosRes = await axios.get(`http://192.168.100.6:8000/datos/${id}`);
          const dato = datosRes.data.dato; // [id, ciclista_id, ts, lat, lng, spd, ...]
          
          return {
            id: id,
            name: `Ciclista ${id}`,
            position: [dato[4], dato[5]],
            speed: dato[6],
            battery: 95, // Valor ficticio (no existe en backend)
            last_update: dato[3]
          };
        })
      );
      
      setRunners(runnersData);
      setLoading(false);
    } catch (err) {
      setError('Error conectando con la API de ciclistas');
      setLoading(false);
    }
  };

  // Actualizar cada 5 segundos
  useEffect(() => {
    fetchRunnerData();
    const interval = setInterval(fetchRunnerData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <LinearProgress sx={{ width: '80%' }} />
    </Box>
  );

  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {runners.map((runner) => (
          <Marker 
            key={runner.id} 
            position={runner.position}
            icon={runnerIcons[runner.id] || runnerIcons.default}
          >
            <Tooltip permanent direction="top">
              {runner.name}
            </Tooltip>
            
            <Popup>
              <Typography variant="h6">{runner.name}</Typography>
              <Typography>Velocidad: {runner.speed} km/h</Typography>
              <Typography>Batería: {runner.battery}%</Typography>
              <Typography>
                Última actualización: {new Date(runner.last_update * 1000).toLocaleTimeString()}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RunnerMap;