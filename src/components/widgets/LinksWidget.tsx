import React, { useState, useEffect } from 'react';
import { ExternalLink, Edit2, Plus, Check, Trash2 } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

interface LinkEntry {
  url: string;
}

const starter_links: LinkEntry[] = [
  { url: 'https://stardance.hackclub.com/@wtfisquantum' },
  { url: 'https://ysws.hackclub.com' },
  { url: 'https://hackatime.hackclub.com' },
  { url: 'https://youtube.com' },
  { url: 'https://hackclub.com' },
  { url: 'https://chatgpt.com' },
  { url: 'https://news.ycombinator.com' },
  { url: 'https://app.slack.com/client/E09V59WQY1E/C0AP0NMSP3P' },
];

const get_host = (urlStr: string) => {
  try {
    const formatted = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    return new URL(formatted).hostname;
  } catch {
    return urlStr;
  }
};

const fix_url = (urlStr: string) =>
  urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;

const LinksWidget = () => {
  const [links, setLinks] = useState<LinkEntry[]>(() => {
    const saved = localStorage.getItem('newtab_links');
    return saved ? JSON.parse(saved) : starter_links;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('newtab_links', JSON.stringify(links));
  }, [links]);

  const save_link = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      setLinks([...links, { url: newUrl.trim() }]);
      setNewUrl('');
      setIsModalOpen(false);
    }
  };

  const nuke_link = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-lg relative">
      <SectionHeader
        icon={ExternalLink}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
                isEditing ? 'bg-white text-zinc-900' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
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
          const domain = get_host(link.url);
          const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

          return (
            <div key={i} className="relative flex justify-center">
              <a
                href={isEditing ? undefined : fix_url(link.url)}
                onClick={e => isEditing && e.preventDefault()}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-3xl transition-all ${
                  isEditing ? 'cursor-default opacity-50' : 'cursor-pointer'
                }`}
              >
                <img
                  src={iconUrl}
                  alt={domain}
                  className="w-full rounded-3xl"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E";
                  }}
                />
              </a>

              {isEditing && (
                <button
                  onClick={e => nuke_link(i, e)}
                  className="absolute -top-2 -right-2 w-7 h-7 hover:text-red-400 hover:bg-red-400/10 text-zinc-500 rounded-lg flex items-center justify-center transition-colors z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-20 bg-zinc-950/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4">
          <form onSubmit={save_link} className="w-full flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-1">Add Shortcut</h4>
            <input
              type="text"
              autoFocus
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
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

export default LinksWidget;
