import React from "react";
import {useState, useEffect} from "react";

import {Search} from 'lucide-react';

const sectionHeader= ({children, icon: Icon, action}) => {
return(
    <div className="flex flex-items justify-between mb-4 bordder-b border-zinc-800 pb-3">
    <div className="flex items-center gap-2">
   {
    Icon && <Icon className="w-4 h-4 text-zinc-400"/>
   } 
   <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
    {children}
   </h3>
    </div>
    {action && action}
    </div>
)
}

const pillBadge = ({text}: {text:String}) => {
    return (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-zinc-800/80 text-[10px] font-medium uppercase tracking-wider text-zinc-300 border border-zinc-700 backdrop-blur-md">
{text}
        </span>
    )
}


const digitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {setTime(new Date())}, 1000);
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

const mainSearchBar = ({searchEngine = "google", onCycleEngine}: {searchEngine: string; onCycleEngine: any;}) => {
const [query, setQuery] = useState("");

const handleSearch = (e: React.KeyboardEvent) => {
    if(e.key === "Enter" && query.trim() !== ""){
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

const engineDisplayName:any = {
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
            <Search className="w-5 h-5 text-zinc-400 mr-4 shrink-0"/>

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
            hidden md:flex items-center justify-center px-4 py-1.5 bg-zinc-800/50  hover:bg-zinc-700/80 roundex-xl border border-zinc-700/50 transition-all
            group cursor-pointer ml-2 text-xs font-bold text-zinc-400 hover:text-white capitalize tracking-wider
            "
            >
{searchEngine}
            </button>
        </div>
        </div>
);
}




export default function newTab() {
return (
    <>
    
    </>
)
}