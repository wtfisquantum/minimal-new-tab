import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface MainSearchBarProps {
  searchEngine?: 'google' | 'duckduckgo' | 'bing';
  onCycleEngine: () => void;
}

const search_urls: Record<string, (q: string) => string> = {
  google:     q => `https://www.google.com/search?q=${q}`,
  duckduckgo: q => `https://duckduckgo.com/?q=${q}`,
  bing:       q => `https://www.bing.com/search?q=${q}`,
};

const engine_names: Record<string, string> = {
  google: 'Google',
  duckduckgo: 'DuckDuckGo',
  bing: 'Bing',
};

const MainSearchBar = ({ searchEngine = 'google', onCycleEngine }: MainSearchBarProps) => {
  const [query, setQuery] = useState('');

  const do_search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      const url = search_urls[searchEngine]?.(encodeURIComponent(query)) ?? search_urls.google(encodeURIComponent(query));
      window.open(url, '_blank');
      setQuery('');
    }
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
          onChange={e => setQuery(e.target.value)}
          onKeyDown={do_search}
          placeholder={`Search with ${engine_names[searchEngine] ?? 'Google'}...`}
          className="flex-1 bg-transparent text-base font-medium text-white placeholder:text-zinc-500 focus:outline-none w-full"
          autoFocus
        />
        <button
          onClick={onCycleEngine}
          title="Click to change search engine"
          className="hidden md:flex items-center justify-center px-4 py-1.5 bg-zinc-800/50
            hover:bg-zinc-700/80 rounded-xl border border-zinc-700/50 transition-all
            cursor-pointer ml-2 text-xs font-bold text-zinc-400 hover:text-white capitalize tracking-wider"
        >
          {searchEngine}
        </button>
      </div>
    </div>
  );
};

export default MainSearchBar;
