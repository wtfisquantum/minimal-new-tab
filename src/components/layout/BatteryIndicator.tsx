import React, { useState, useEffect } from 'react';
import { BatteryFull, BatteryMedium, BatteryLow, BatteryCharging, Zap } from 'lucide-react';

const BatteryIndicator = () => {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const nav = navigator as any;
    if (!('getBattery' in nav)) return;

    nav.getBattery().then((bat: any) => {
      setLevel(Math.round(bat.level * 100));
      setCharging(bat.charging);

      const on_lvl = () => setLevel(Math.round(bat.level * 100));
      const on_charge = () => setCharging(bat.charging);

      bat.addEventListener('levelchange', on_lvl);
      bat.addEventListener('chargingchange', on_charge);

      return () => {
        bat.removeEventListener('levelchange', on_lvl);
        bat.removeEventListener('chargingchange', on_charge);
      };
    });
  }, []);

  if (level === null) return null;

  const batt_color = () => {
    if (charging) return '#4ade80';
    if (level > 60) return '#a1a1aa';
    if (level > 25) return '#facc15';
    return '#f87171';
  };

  const clr = batt_color();

  const BattIco = () => {
    if (charging) return <BatteryCharging className="w-4 h-4" style={{ color: clr }} />;
    if (level > 75) return <BatteryFull className="w-4 h-4" style={{ color: clr }} />;
    if (level > 40) return <BatteryMedium className="w-4 h-4" style={{ color: clr }} />;
    return <BatteryLow className="w-4 h-4" style={{ color: clr }} />;
  };

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl shadow-lg select-none"
      title={charging ? `Charging — ${level}%` : `Battery — ${level}%`}
    >
      <BattIco />
      <span className="text-xs font-semibold" style={{ color: clr }}>{level}%</span>
      {charging && <Zap className="w-3 h-3" style={{ color: '#4ade80', fill: '#4ade80' }} />}
    </div>
  );
};

export default BatteryIndicator;
