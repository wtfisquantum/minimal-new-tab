import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Calendar as CalendarIcon,
  Check,
  Plus,
  Terminal,
  Maximize,
  Image as ImageIcon,
  X,
  MapPin,
  Trash2,
  ExternalLink,
  Settings,
  Edit2
} from 'lucide-react';

const SectionHeader = ({ children, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
      <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">{children}</h3>
    </div>
    {action && action}
  </div>
);

const DataLabel = ({ children }) => (
  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{children}</h4>
);

const PillBadge = ({ text }) => {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full bg-zinc-800/80 text-[10px] font-medium uppercase tracking-wider text-zinc-300 border border-zinc-700 backdrop-blur-md">
      {text}
    </span>
  );
};

const BackgroundMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(false);

  // Fetch IP Details
  useEffect(() => {
    fetch('https://api-point-ip-details.vercel.app')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.lat && data.lon) {
          setGeoData(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!geoData || error) return;

    const loadMap = async () => {
      // Inject Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Inject Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      // Setup Map if not already initialized
      if (!mapInstance.current && mapRef.current) {
        const L = window.L;
        const { lat, lon, city, region } = geoData;

        mapInstance.current = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false
        }).setView([lat, lon], 13);

        // CartoDB Dark Matter Base Map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(mapInstance.current);

        // Custom minimalist marker
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="w-6 h-6 bg-zinc-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                   <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([lat, lon], { icon: customIcon }).addTo(mapInstance.current);
      }
    };

    loadMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [geoData, error]);

  return (
    <div className="fixed inset-0 z-0 bg-zinc-950 flex items-center justify-center">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 opacity-40 mix-blend-luminosity" />

      {/* Vignette / Gradient Overlay to ensure UI readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#09090b_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/80 pointer-events-none" />
    </div>
  );
};

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const split_am_pm = timeString.split(' ');
  return (
    <div className="flex flex-col items-center mb-8 fade-in relative z-10">
      <h1 className="flex inline-flex justify-center items-baseline gap-3 text-7xl md:text-8xl font-semibold font-['Rubik'] text-white tracking-wide leading-none drop-shadow-lg">
        {split_am_pm[0]} <span className="text-7xl font-['Rubik'] font-bold text-zinc-400">{split_am_pm[1]}</span>
      </h1>
    </div>
  );
};

const MainSearchBar = ({ searchEngine = 'google', onCycleEngine }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      if (searchEngine === 'duckduckgo') searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      if (searchEngine === 'bing') searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

      window.open(searchUrl, '_blank');
      setQuery("");
    }
  };

  const engineDisplayNames = {
    google: 'Google',
    duckduckgo: 'DuckDuckGo',
    bing: 'Bing'
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 relative z-10">
      <div className="flex items-center w-full border border-zinc-700/60 bg-zinc-900/60 backdrop-blur-xl px-6 h-14 
      rounded-2xl shadow-xl focus-within:border-zinc-500 focus-within:bg-zinc-900/80 focus-within:ring-4 
      focus-within:ring-zinc-500/20 transition-all duration-300">
        <Search className="w-5 h-5 text-zinc-400 mr-4 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder={`Search with ${engineDisplayNames[searchEngine] || 'Google'}...`}
          className="flex-1 bg-transparent text-base font-medium text-white placeholder:text-zinc-500 focus:outline-none w-full"
          autoFocus
        />
        <button
          onClick={onCycleEngine}
          title="Click to change search engine"
          className="hidden md:flex items-center justify-center px-4 py-1.5 bg-zinc-800/50
          hover:bg-zinc-700/80 rounded-xl border border-zinc-700/50 transition-all 
          group cursor-pointer ml-2 text-xs font-bold text-zinc-400 hover:text-white capitalize tracking-wider"
        >
          {searchEngine}
        </button>
      </div>
    </div>
  );
};

const LinksWidget = () => {
  const defaultLinks = [
    { url: "https://stardance.hackclub.com/@wtfisquantum" },
    { url: "https://ysws.hackclub.com" },
    { url: "https://hackatime.hackclub.com" },
    { url: "https://youtube.com" },
    { url: "https://hackclub.com" },
    { url: "https://chatgpt.com" },
    { url: "https://news.ycombinator.com" },
    { url: "https://app.slack.com/client/E09V59WQY1E/C0AP0NMSP3P" }
  ];

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('newtab_links');
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    localStorage.setItem('newtab_links', JSON.stringify(links));
  }, [links]);

  const getDomain = (urlStr) => {
    try {
      const formattedUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
      return new URL(formattedUrl).hostname;
    } catch {
      return urlStr;
    }
  };

  const getFormattedUrl = (urlStr) => {
    return urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (newUrl.trim()) {
      setLinks([...links, { url: newUrl.trim() }]);
      setNewUrl("");
      setIsModalOpen(false);
    }
  };

  const handleRemoveLink = (indexToRemove, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLinks(links.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-lg relative">
      <SectionHeader
        icon={ExternalLink}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${isEditing ? 'bg-white text-zinc-900' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-6 h-6 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        }
      >
        Shortcuts
      </SectionHeader>

      <div className="grid grid-cols-5 gap-4 overflow-y-auto custom-scrollbar flex-1 pr-2 content-start pb-2 pt-2">
        {links.map((link, i) => {
          const domain = getDomain(link.url);
          const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

          return (
            <div key={i} className="relative flex justify-center">
              <a
                href={isEditing ? undefined : getFormattedUrl(link.url)}
                onClick={(e) => isEditing && e.preventDefault()}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-3xl transition-all ${isEditing ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
              >
                <img
                  src={iconUrl}
                  alt={domain}
                  className="w-full rounded-3xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E";
                  }}
                />
              </a>

              {isEditing && (
                <button
                  onClick={(e) => handleRemoveLink(i, e)}
                  className="absolute -top-2 -right-2 w-7 h-7 hover:text-red-400 hover:bg-red-400/10 text-zinc-500 rounded-lg flex items-center justify-center transition-colors z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Link Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-20 bg-zinc-950/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4">
          <form onSubmit={handleAddLink} className="w-full flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Add Shortcut</h4>
            <input
              type="text"
              autoFocus
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="e.g. example.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                Add Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const TasksWidget = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('newtab_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Please give good ratings", done: false },
      { id: 2, text: "Btw my real name is Satya", done: true },
      { id: 3, text: "Byyyyyeeeee stranger...", done: false },
    ];
  });
  const [newTask, setNewTask] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('newtab_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000); // Update date check every minute
    return () => clearInterval(timer);
  }, []);

  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const addTask = (e) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-lg relative">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">{dateString}</h3>
        </div>
      </div>

      {/* Task Input */}
      <div className="flex items-center px-3 py-2.5 mb-3 border border-zinc-700/50 bg-zinc-950/50 rounded-xl focus-within:border-zinc-500 transition-colors shadow-inner">
        <Plus className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={addTask}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
            <Check className="w-8 h-8 opacity-20" />
            <span className="text-xs italic">All caught up.</span>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/60 cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-4 h-4 shrink-0 flex items-center justify-center rounded border transition-all duration-300 ${task.done
                  ? 'bg-zinc-300 border-zinc-300'
                  : 'bg-zinc-900 border-zinc-600 group-hover:border-zinc-400'
                  }`}>
                  {task.done && <Check className="w-3 h-3 text-zinc-900" />}
                </div>
                <span className={`text-sm transition-all duration-300 truncate ${task.done ? 'text-zinc-600 line-through' : 'text-zinc-300 group-hover:text-white'
                  }`}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={(e) => deleteTask(task.id, e)}
                className="w-6 h-6 shrink-0 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ApodWidget = () => {

  const [imageurl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://inshorts.vercel.app/news/topics/technology?offset=0");
        const data = await response.json();
        setImageUrl(data.data.articles[0].imageUrl)
        setTitle(data.data.articles[0].title)
        setLink(data.data.articles[0].sourceUrl)
        setExplanation(data.data.articles[0].content)
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }
    fetchNews();
  }, [])

  return (
    <div className="flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 
    backdrop-blur-xl shadow-lg relative">
      <SectionHeader icon={ImageIcon}>Latest Tech News</SectionHeader>

      <div className="relative w-full flex-1 rounded-2xl overflow-hidden group mb-4 shadow-inner bg-zinc-950">
        {/* Strictly grayscale rendering as per design requirements */}
        <img
          src={imageurl}
          alt="Space"
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out brightness-75
           group-hover:brightness-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 
        to-transparent opacity-90" />

        <div className="absolute top-3 right-3">
          <PillBadge text="Tech News" />
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-sm font-semibold text-white truncate shadow-sm mb-1">
            {title}
          </h4>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-tight">
            {explanation}
          </p>
        </div>
      </div>

      {/* <div className="flex items-center justify-between shrink-0">
        <div>
          <DataLabel>Source</DataLabel>
          <span className="text-xs font-medium text-zinc-400">NASA/ESA</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div> */}
    </div>
  );
};

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('newtab_settings');
    return saved ? JSON.parse(saved) : { searchEngine: 'google', theme: 'dark' };
  });

  useEffect(() => {
    localStorage.setItem('newtab_settings', JSON.stringify(settings));
  }, [settings]);

  const cycleSearchEngine = () => {
    const engines = ['google', 'duckduckgo', 'bing'];
    const currentIndex = engines.indexOf(settings.searchEngine);
    const nextIndex = (currentIndex + 1) % engines.length;
    setSettings({ ...settings, searchEngine: engines[nextIndex] });
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

      .fade-in {
        animation: fadeIn 0.8s ease-out forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 4px; }
      .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #52525b; }
      
      /* Fix for leaflet dark mode overrides */
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

      {/* Dynamic Geolocation Map Background */}
      <BackgroundMap />

      {/* Foreground Content */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative z-10 pointer-events-auto">

        <DigitalClock />
        <MainSearchBar
          searchEngine={settings.searchEngine}
          onCycleEngine={cycleSearchEngine}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 fade-in" style={{ animationDelay: '0.1s' }}>
          <ApodWidget />
          <LinksWidget />
          <TasksWidget />
        </div>

      </div>
    </div>
  );
}
