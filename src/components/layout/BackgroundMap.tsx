import React, { useState, useEffect, useRef } from 'react';

interface BackgroundMapProps {
  rgbMode: boolean;
  bgImage?: string | null;
}

const BackgroundMap = ({ rgbMode, bgImage }: BackgroundMapProps) => {
  const map_ref = useRef<HTMLDivElement>(null);
  const map_inst = useRef<any>(null);
  const [geo, set_geo] = useState<any>(null);
  const [error, set_error] = useState(false);

  useEffect(() => {
    fetch('https://api-point-ip-details.vercel.app')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.lat && data.lon) {
          set_geo(data);
        } else {
          set_error(true);
        }
      })
      .catch(() => set_error(true));
  }, []);

  useEffect(() => {
    if (bgImage) {
      if (map_inst.current) {
        map_inst.current.remove();
        map_inst.current = null;
      }
      return;
    }

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

      if (!map_inst.current && map_ref.current) {
        const L = (window as any).L;
        const { lat, lon } = geo;

        map_inst.current = L.map(map_ref.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }).setView([lat, lon], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          className: 'dark-map-tiles',
          maxZoom: 100,
        }).addTo(map_inst.current);

        const dot_pin = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="w-6 h-6 bg-zinc-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                   <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([lat, lon], { icon: dot_pin }).addTo(map_inst.current);
      }
    };

    boot_map();

    return () => {
      if (map_inst.current) {
        map_inst.current.remove();
        map_inst.current = null;
      }
    };
  }, [geo, error, bgImage]);

  return (
    <div className={`fixed inset-0 z-0 flex items-center justify-center${rgbMode ? ' rgb-mode' : ''}`}>
      {bgImage ? (
        <div
          className="absolute inset-0 opacity-95 mix-blend-luminosity bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <div ref={map_ref} className="absolute inset-0 opacity-50 mix-blend-luminosity" />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#09090b_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-transparent to-zinc-950/70 pointer-events-none" />
    </div>
  );
};

export default BackgroundMap;
