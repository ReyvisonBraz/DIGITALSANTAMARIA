'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { HealthUnit } from '@/types';

interface HealthMapProps {
  units: HealthUnit[];
  selectedUnitId: string | null;
  onSelectUnit: (unit: HealthUnit) => void;
}

const waitColor: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#0ea5e9',
  critical: '#ef4444',
};

const SANTA_MARIA_CENTER: [number, number] = [-1.3636, -47.4481];

const fallbackCoords: Record<string, [number, number]> = {
  'upa-central': [-1.3636, -47.4481],
  'clinica-familia-bom-jesus': [-1.3550, -47.4520],
  'posto-vila-nova': [-1.3700, -47.4400],
  'farmacia-popular-municipal': [-1.3620, -47.4460],
  'cras-santa-maria': [-1.3610, -47.4490],
};

function createDivIcon(color: string, isUpa: boolean): L.DivIcon {
  return L.divIcon({
    className: 'health-map-marker',
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="transform: rotate(45deg); font-size: 14px;">${isUpa ? '🏥' : '⚕'}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function HealthMap({ units, selectedUnitId, onSelectUnit }: HealthMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: SANTA_MARIA_CENTER,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    const markersMap = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markersMap.clear();
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const map = mapRef.current;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const validUnits = units.filter((unit) => {
      const lat = unit.lat ?? fallbackCoords[unit.id]?.[0];
      const lng = unit.lng ?? fallbackCoords[unit.id]?.[1];
      return lat != null && lng != null;
    });

    validUnits.forEach((unit) => {
      const lat = unit.lat ?? fallbackCoords[unit.id][0];
      const lng = unit.lng ?? fallbackCoords[unit.id][1];
      const color = waitColor[unit.waitLevel] || '#0ea5e9';
      const isUpa = unit.type === 'upa' || unit.type === 'hospital';
      const icon = createDivIcon(color, isUpa);

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
          <strong style="font-size: 14px; color: #1e293b;">${unit.name}</strong><br/>
          <span style="font-size: 12px; color: ${color}; font-weight: 600;">Espera: ${unit.waitTime}min</span><br/>
          <span style="font-size: 11px; color: #64748b;">${unit.address}</span>
        </div>
      `);

      marker.on('click', () => {
        onSelectUnit(unit);
      });

      markersRef.current.set(unit.id, marker);
    });

    if (validUnits.length > 0) {
      const bounds = L.latLngBounds(
        validUnits.map((u) => {
          const lat = u.lat ?? fallbackCoords[u.id][0];
          const lng = u.lng ?? fallbackCoords[u.id][1];
          return [lat, lng] as [number, number];
        })
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      }
    }
  }, [units, mapReady, onSelectUnit]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !selectedUnitId) return;
    const marker = markersRef.current.get(selectedUnitId);
    if (marker) {
      mapRef.current.flyTo(marker.getLatLng(), 16, { duration: 0.5 });
      marker.openPopup();
    }
  }, [selectedUnitId, mapReady]);

  return (
    <div className="absolute inset-0 z-0">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}