import React, { useState, useEffect, useRef } from 'react';

interface BackgroundMapProps {
  rgbMode: boolean;
}

const BackgroundMap = ({ rgbMode }: BackgroundMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map_ref = useRef<any>(null);
  const [geo, setGeo] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api-point-ip-details.vercel.app')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.lat && data.lon) {
          setGeo(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!geo || error) return;

    const boot_map = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);
        await new Promise(resolve => (script.onload = resolve));
      }

      if (!map_ref.current && mapRef.current) {
        const L = (window as any).L;
        const { lat, lon } = geo;

        map_ref.current = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }).setView([lat, lon], 13);

        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png', {
          maxZoom: 27,
        }).addTo(map_ref.current);

        const dot_pin = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="w-6 h-6 bg-zinc-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                   <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([lat, lon], { icon: dot_pin }).addTo(map_ref.current);
      }
    };

    boot_map();

    return () => {
      if (map_ref.current) {
        map_ref.current.remove();
        map_ref.current = null;
      }
    };
  }, [geo, error]);

  return (
    <div className={`fixed inset-0 z-0 bg-zinc-950 flex items-center justify-center${rgbMode ? ' rgb-mode' : ''}`}>
      <div ref={mapRef} className="absolute inset-0 opacity-40 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#09090b_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/80 pointer-events-none" />
    </div>
  );
};

export default BackgroundMap;
