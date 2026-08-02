import React from "react";
import { useState, useEffect } from "react";

import { Image as ImageIcon, Search } from 'lucide-react';

const SectionHeader = ({ children, icon: Icon, action }) => (
    <div className="flex flex-items justify-between mb-4 bordder-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
            {
                Icon && <Icon className="w-4 h-4 text-zinc-400" />
            }
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                {children}
            </h3>
        </div>
        {action && action}
    </div>
)

const PillBadge = ({ text }: { text: String }) => {
    return (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-zinc-800/80 text-[10px] font-medium uppercase tracking-wider text-zinc-300 border border-zinc-700 backdrop-blur-md">
            {text}
        </span>
    )
}


const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => { setTime(new Date()) }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const splitAMPM = timeString.split(" ");
    return (
        <div className="flex flex-col items-center mb-8 fade-in relative z-10">
            <h1 className="flex inline-flex justify-center items-baseline gap-3 text-7xl md:text-8xl font-semibold font-['Rubik'] text-white tracking-wide leading-none drop-shadow-lg">
                {splitAMPM[0]} <span className="text-7xl font-bold text-zinc-400">{splitAMPM[1]}</span>
            </h1>
        </div>
    )
}

const MainSearchBar = ({ searchEngine = "google", onCycleEngine }: { searchEngine: string; onCycleEngine: any; }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && query.trim() !== "") {
            let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            if (searchEngine === "duckduckgo") {
                searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            }
            if (searchEngine === "bing") {
                searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
            }
            window.open(searchUrl, "_blank");
            setQuery("");
        }
    }

    const engineDisplayName: any = {
        google: "Google",
        bing: "Bing",
        duckduckgo: "DuckDuckGo"
    }
    return (
        <div className="
    w-full max-w-2xl mx-auto mb-10 relative z-10
    ">
            <div className="
        flex items-center w-full border border-zinc-700/60 bg-zinc-900/60 backdrop-blur-xl px-6 h-14
        rounded-2xl shadow-xl focus-within:border-zinc-500 focus-within:bg-zinc-900/80 focus-within:ring-4
        focus-within:ring-zinc-500/20 transition-all duration-300
        ">
                <Search className="w-5 h-5 text-zinc-400 mr-4 shrink-0" />

                <input

                    type="text"
                    value={query}
                    onChange={(e => setQuery(e.target.value))}
                    onKeyDown={handleSearch}
                    placeholder={`Search with ${engineDisplayName[searchEngine || "Google"]}...`}
                    className="
            flex-1 bg-transparent text-base font-medium tetx-white placeholder:text-zinc-500 focus:outline-none w-full
            "
                    autoFocus={true}
                />

                <button
                    onClick={onCycleEngine}
                    title="Click to change the search engine"
                    className="
            hidden md:flex items-center justify-center px-4 py-1.5 bg-zinc-800/50  hover:bg-zinc-700/80 rounded-xl border border-zinc-700/50 transition-all
            group cursor-pointer ml-2 text-xs font-bold text-zinc-400 hover:text-white capitalize tracking-wider
            "
                >
                    {searchEngine}
                </button>
            </div>
        </div>
    );
}


const TaskWidget = () => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    });
    const [newTask, setNewTask] = useState("");

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);


    const dateString = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    const addTask = (e) => {
        if (e.key === "Enter" && newTask.trim() !== "") {
            setTasks([...tasks, {
                id: Date.now(),
                text: newTask.trim(),
                done: false
            }]);
            setNewTask("");
        }
    };

    const toggleTask = (id: any) => {
        setTasks(tasks.map((task: any) => task.id === id ? { ...task, done: !task.done } : task));
    }

}



const NewsWidget = () => {
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
        <div className="
        flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-900/80 rounded-3xl p-5 backdrop-blur-xl shadow-lg relative
        ">
            <SectionHeader icon={ImageIcon}>Daily Discovery</SectionHeader>

            <div className="
relative w-full flex-1 rounded-2xl overflow-hidden group mb-4 shadow-inner bg-zinc-950">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <img src={imageurl} alt={title} className="
    w-full h-full object-cover transition-all duration-1000 ease-in-out brightness-75 group-hover:brightness-100 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 
        to-transparent opacity-90" />

                    <div className="absolute top-3 right-3">
                        <PillBadge text="Tech News" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 font-['Rubik']">
                        <h4 className="text-sm font-semibold text-white truncate shadow-sm mb-1">
                            {title}
                        </h4>
                        <p className="text-sm text-zinc-400 line-clamp-2 leading-tight">
                            {explanation}
                        </p>
                    </div>
                </a>
            </div>

        </div>
    )
}


const BakcgroundMap = () => {
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



const LinksWidget = () => {
    const defaultLinks = [
        { url: "https://github.com" },
        { url: "https://vercel.com" },
        { url: "https://stackoverflow.com" },
        { url: "https://youtube.com" },
        { url: "https://x.com" },
        { url: "https://chatgpt.com" },
        { url: "https://figma.com" },
        { url: "https://notion.so" },
        { url: "https://linear.app" },
        { url: "https://reddit.com" },
        { url: "https://aws.amazon.com" },
        { url: "https://news.ycombinator.com" }
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


export default function NewTab() {

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("settings");
        return saved ? JSON.parse(saved) : { searchEngine: "google", theme: "dark" };
    });

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
    }, [settings]);

    const cycleSearchEngine = () => {
        const engines = ["google", "bing", "duckduckgo"];
        const crindex = engines.indexOf(settings.searchEngine);
        const nxtindex = (crindex + 1) % engines.length;
        setSettings({
            ...settings, searchEngine: engines[nxtindex]
        });
    }




    return (
        <div className="h-screen w-full relative flex flex-col justify-center items-center px-6 md:px-12 selection:bg-zinc-200 selection:text-zinc-900">
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative z-10 pointer-events-auto">



                <DigitalClock />

                <MainSearchBar
                    searchEngine={settings.searchEngine}
                    onCycleEngine={cycleSearchEngine}
                />

                <NewsWidget />
            </div>
        </div>
    )
}
