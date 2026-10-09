import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

import BackgroundMap    from './components/layout/BackgroundMap';
import DigitalClock     from './components/layout/DigitalClock';
import MainSearchBar    from './components/layout/MainSearchBar';
import BatteryIndicator from './components/layout/BatteryIndicator';
import WidgetPanel      from './components/layout/WidgetPanel';
import MusicPlayer      from './components/layout/MusicPlayer';

import NewsCarousel from './components/widgets/NewsCarousel';
import LinksWidget  from './components/widgets/LinksWidget';
import TasksWidget  from './components/widgets/TasksWidget';

import { default_picks } from './constants/widgets';

const widget_map: Record<string, React.ReactNode> = {
  news:      <NewsCarousel />,
  shortcuts: <LinksWidget />,
  todos:     <TasksWidget />,
};

interface AppSettings {
  searchEngine: string;
  bgImage?: string | null;
}

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('newtab_settings');
    return saved ? JSON.parse(saved) : { searchEngine: 'google', bgImage: null };
  });

  useEffect(() => {
    localStorage.setItem('newtab_settings', JSON.stringify(settings));
  }, [settings]);

  const switch_engine = () => {
    const engines = ['google', 'duckduckgo', 'bing'];
    const next = (engines.indexOf(settings.searchEngine) + 1) % engines.length;
    setSettings({ ...settings, searchEngine: engines[next] });
  };

  const set_bg = (base64: string | null) => {
    setSettings(prev => ({ ...prev, bgImage: base64 }));
  };

  const [rgb_on, set_rgb] = useState(false);
  const [drawer_open, set_drawer] = useState(false);
  const [active_slots, set_slots] = useState<string[]>(default_picks);

  const flip_widget = (id: string) => {
    set_slots(prev =>
      prev.includes(id)
        ? prev.filter(w => w !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      body {
        font-family: 'Inter', sans-serif;
        background-color: #09090b;
        color: #f4f4f5;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      .custom-scrollbar::-webkit-scrollbar       { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 4px; }
      .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #52525b; }

      .leaflet-container {
        background: #09090b !important;
        font-family: 'Inter', sans-serif !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="h-screen w-full relative flex flex-col justify-center items-center px-6 md:px-12 selection:bg-zinc-200 selection:text-zinc-900">

      <BackgroundMap rgbMode={rgb_on} bgImage={settings.bgImage} />

      <div className="fixed top-4 right-5 z-50 flex items-center gap-2">
        <button
          onClick={() => set_rgb(r => !r)}
          title={rgb_on ? 'Turn off RGB' : 'Turn on RGB'}
          className="flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-xl shadow-lg transition-all duration-300"
          style={{
            backgroundColor: rgb_on ? 'rgba(255,255,255,0.23)' : 'rgba(24,24,27,0.70)',
            borderColor:     'rgba(63,63,70,0.8)',
          }}
        >
          <Lightbulb className="w-4 h-4" style={{ color: rgb_on ? '#fff' : '#71717a' }} />
        </button>
        <BatteryIndicator />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative z-10 pointer-events-auto">
        <DigitalClock />
        <MainSearchBar
          searchEngine={settings.searchEngine as any}
          onCycleEngine={switch_engine}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6" style={{ animationDelay: '0.1s' }}>
          {active_slots.map(id => (
            <React.Fragment key={id}>{widget_map[id]}</React.Fragment>
          ))}
        </div>
      </div>

      <WidgetPanel
        open={drawer_open}
        selectedWidgets={active_slots}
        bgImage={settings.bgImage}
        onBgChange={set_bg}
        onToggle={() => set_drawer(p => !p)}
        onToggleWidget={flip_widget}
      />

      <MusicPlayer />
    </div>
  );
}
