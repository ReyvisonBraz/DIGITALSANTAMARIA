'use client';

import { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GeoLocation } from '@/types';

interface LocationPickerProps {
  value: string;
  location: GeoLocation | null;
  onChange: (address: string, location: GeoLocation | null) => void;
}

export default function LocationPicker({ value, location, onChange }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      onChange(value, null);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`,
            { headers: { 'User-Agent': 'DigitalSantaMaria/1.0' } }
          );
          const data = await res.json();
          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onChange(address, { lat, lng, address });
        } catch {
          onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, { lat, lng, address: '' });
        }
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <label className="font-black text-text-main text-[11px] uppercase tracking-widest">
        Ponto de Referência ou Endereço
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-4 w-5 h-5 text-primary" />
          <input
            placeholder="Rua, bairro ou ponto conhecido..."
            className="w-full p-4 pl-12 bg-white border-2 border-border rounded-xl focus:border-primary outline-none transition-all font-bold text-text-main"
            value={value}
            onChange={(e) => onChange(e.target.value, location)}
          />
        </div>
        <button
          type="button"
          onClick={getCurrentPosition}
          disabled={loading}
          className={cn(
            'px-4 rounded-xl border-2 border-border bg-white flex items-center justify-center transition-all',
            loading ? 'opacity-50' : 'hover:border-primary hover:text-primary'
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </div>
      {location && (
        <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
