'use client';

import { useRef, useState } from 'react';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GeoLocation } from '@/types';

interface LocationPickerProps {
  value: string;
  location: GeoLocation | null;
  onChange: (address: string, location: GeoLocation | null) => void;
}

export default function LocationPicker({ value, location, onChange }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const getCurrentPosition = () => {
    setError(null);

    if (!navigator.geolocation) {
      setError('Seu navegador nao permite capturar localizacao automaticamente.');
      onChange(value, null);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!mountedRef.current) return;

        const { latitude: lat, longitude: lng } = position.coords;

        try {
          const controller = new AbortController();
          abortRef.current = controller;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`,
            { signal: controller.signal },
          );

          if (!mountedRef.current) return;

          if (!response.ok) {
            throw new Error('Reverse geocoding failed');
          }

          const data = await response.json();
          const address = typeof data?.display_name === 'string'
            ? data.display_name
            : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onChange(address, { lat, lng, address });
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          if (!mountedRef.current) return;
          const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onChange(fallbackAddress, { lat, lng, address: fallbackAddress });
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      },
      () => {
        if (mountedRef.current) {
          setLoading(false);
          setError('Não foi possível obter sua localização. Informe o endereço manualmente.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-text-main">
        Ponto de referencia ou endereco
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-4 h-5 w-5 text-primary" />
          <input
            placeholder="Rua, bairro ou ponto conhecido..."
            className="w-full rounded-xl border-2 border-border bg-white p-4 pl-12 font-bold text-text-main outline-none transition-all focus:border-primary"
            value={value}
            onChange={(event) => onChange(event.target.value, location)}
          />
        </div>
        <button
          type="button"
          onClick={getCurrentPosition}
          disabled={loading}
          aria-label="Usar minha localizacao"
          className={cn(
            'flex items-center justify-center rounded-xl border-2 border-border bg-white px-4 transition-all',
            loading ? 'opacity-50' : 'hover:border-primary hover:text-primary',
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Navigation className="h-5 w-5" />
          )}
        </button>
      </div>
      {location && (
        <p className="flex items-center gap-1 text-[10px] font-bold text-green-600">
          <MapPin className="h-3 w-3" />
          GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}
      {error && (
        <p className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
