import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { distritosLima } from '../../assets/distritosLima';

const normalizar = (texto) => (texto || '').toLowerCase().trim();

const getColor = (valor, max) => {
  if (max === 0) return '#cbd5e1';
  const ratio = valor / max;
  if (ratio > 0.66) return '#ef4444'; // alto
  if (ratio > 0.33) return '#f97316'; // medio
  return '#22c55e'; // bajo
};

function MapaDelivery({ data }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  const puntos = data?.puntos || [];
  const conteoPorDistrito = new Map(
    puntos.map((p) => [normalizar(p.distrito), Number(p.total || 0)])
  );
  const maxValor = puntos.reduce((max, p) => Math.max(max, Number(p.total || 0)), 0);

  const marcadores = distritosLima
    .map((d) => ({
      ...d,
      total: conteoPorDistrito.get(normalizar(d.nombre)) || 0,
    }))
    .filter((d) => d.total > 0);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = L.map(mapDivRef.current, {
      center: [-12.0464, -77.0428],
      zoom: 11,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
  }, []);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.clearLayers();
    marcadores.forEach((item) => {
      const color = getColor(item.total, maxValor);
      const circle = L.circleMarker([item.lat, item.lng], {
        radius: 8 + Math.min(12, item.total),
        color,
        fillColor: color,
        fillOpacity: 0.7,
      });
      circle.bindTooltip(
        `<div><strong>${item.nombre}</strong><br/>Pedidos: ${item.total}</div>`
      );
      circle.addTo(layerRef.current);
    });
  }, [marcadores, maxValor]);

  return (
    <div className="mapa-wrapper">
      <div ref={mapDivRef} style={{ height: '360px', width: '100%' }} />
      {marcadores.length === 0 && (
        <div className="mapa-empty">Aún no hay datos de delivery en el rango seleccionado.</div>
      )}
    </div>
  );
}

export default MapaDelivery;
