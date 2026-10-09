import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Disc3,
  LoaderCircle,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
} from 'lucide-react';

const SEARCH_URL = 'https://saavnapi-nine.vercel.app/result/?query=';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  audio: string;
  duration: string;
}

interface ApiTrack {
  id?: string;
  song?: string;
  title?: string;
  primary_artists?: string;
  artist?: string;
  music?: string;
  album?: string;
  image?: string;
  media_url?: string;
  duration?: string;
}

const to_track = (item: ApiTrack, index: number): MusicTrack | null => {
  if (!item.media_url) return null;

  return {
    id: item.id ?? `${item.song ?? item.title ?? 'track'}-${index}`,
    title: item.song ?? item.title ?? 'Untitled track',
    artist: item.primary_artists ?? item.artist ?? item.music ?? 'Unknown artist',
    album: item.album ?? 'Saavn mix',
    image: item.image ?? '',
    audio: item.media_url,
    duration: item.duration ?? '',
  };
};

const format_duration = (seconds: string) => {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return '';
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
};

const MusicPlayer = () => {
  const audio_ref = useRef<HTMLAudioElement>(null);
  const [open, set_open] = useState(false);
  const [query, set_query] = useState('');
  const [tracks, set_tracks] = useState<MusicTrack[]>([]);
  const [current, set_current] = useState<MusicTrack | null>(null);
  const [playing, set_playing] = useState(false);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState('');

  // Initial popular search so next/prev/play work immediately
  useEffect(() => {
    void fetch_initial_tracks();
  }, []);

  const fetch_initial_tracks = async () => {
    try {
      const response = await fetch(`${SEARCH_URL}lofi chill`);
      if (!response.ok) return;
      const data: unknown = await response.json();
      const results = Array.isArray(data) ? data : [];
      const initial_tracks = results
        .map((item, index) => to_track(item as ApiTrack, index))
        .filter((track): track is MusicTrack => track !== null)
        .slice(0, 10);
      if (initial_tracks.length) {
        set_tracks(initial_tracks);
        set_current(initial_tracks[0]);
      }
    } catch {
      // silently fallback
    }
  };

  useEffect(() => {
    const search = query.trim();
    if (!search) {
      set_error('');
      return;
    }

    const timer = window.setTimeout(() => {
      void search_tracks();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const audio = audio_ref.current;
    if (!audio || !current) return;

    audio.src = current.audio;
    audio.load();
    if (playing) {
      void audio.play().then(() => set_playing(true)).catch(() => set_playing(false));
    }
  }, [current]);

  const search_tracks = async () => {
    const search = query.trim();
    if (!search) return;

    set_loading(true);
    set_error('');
    try {
      const response = await fetch(`${SEARCH_URL}${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error('Search failed');
      const data: unknown = await response.json();
      const results = Array.isArray(data) ? data : [];
      const next_tracks = results
        .map((item, index) => to_track(item as ApiTrack, index))
        .filter((track): track is MusicTrack => track !== null)
        .slice(0, 12);
      set_tracks(next_tracks);
      if (!next_tracks.length) set_error('No playable tracks found');
    } catch {
      set_error('Could not reach the music search');
    } finally {
      set_loading(false);
    }
  };

  const toggle_playback = () => {
    const audio = audio_ref.current;
    if (!audio) return;

    if (!current && tracks.length > 0) {
      set_current(tracks[0]);
      audio.src = tracks[0].audio;
      audio.load();
      void audio.play().then(() => set_playing(true));
      return;
    }

    if (!current) return;

    if (audio.paused) {
      void audio.play().then(() => set_playing(true));
    } else {
      audio.pause();
      set_playing(false);
    }
  };

  const handle_prev = () => {
    if (!tracks.length) return;
    if (!current) {
      set_current(tracks[0]);
      set_playing(true);
      return;
    }
    const idx = tracks.findIndex(t => t.id === current.id);
    const prev_idx = idx > 0 ? idx - 1 : tracks.length - 1;
    set_current(tracks[prev_idx]);
    set_playing(true);
  };

  const handle_next = () => {
    if (!tracks.length) return;
    if (!current) {
      set_current(tracks[0]);
      set_playing(true);
      return;
    }
    const idx = tracks.findIndex(t => t.id === current.id);
    const next_idx = idx < tracks.length - 1 ? idx + 1 : 0;
    set_current(tracks[next_idx]);
    set_playing(true);
  };

  return (
    <div className="fixed bottom-0 z-[150] flex flex-col items-end sm:bottom-0 sm:right-6">
      <style>{`
        @keyframes eqBar1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes eqBar2 {
          0%, 100% { height: 16px; }
          50% { height: 5px; }
        }
        @keyframes eqBar3 {
          0%, 100% { height: 7px; }
          50% { height: 18px; }
        }
        @keyframes eqBar4 {
          0%, 100% { height: 14px; }
          50% { height: 6px; }
        }
      `}</style>

      {/* Expandable Search & Playlist Drawer */}
      {open && (
        <section className="-translate-x-[3rem] mb-3 w-[min(20rem,calc(100vw-4rem))] overflow-hidden rounded-2xl border border-white/10 bg-zinc-250/65 shadow-2xl shadow-black/80 backdrop-blur-2xl transition-all duration-300">
          {/* Header with animated equalizer waveform & truncated track title (Now Playing text removed) */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Animated waveform bars */}
              <div className="flex items-end gap-[3px] h-4 shrink-0 px-1">
                <span
                  className="w-[3px] rounded-full bg-zinc-400"
                  style={{
                    height: playing ? undefined : '6px',
                    animation: playing ? 'eqBar1 0.8s ease-in-out infinite' : 'none',
                  }}
                />
                <span
                  className="w-[3px] rounded-full bg-zinc-400"
                  style={{
                    height: playing ? undefined : '18px',
                    animation: playing ? 'eqBar2 0.65s ease-in-out infinite 0.15s' : 'none',
                  }}
                />
                <span
                  className="w-[3px] rounded-full bg-zinc-400"
                  style={{
                    height: playing ? undefined : '17px',
                    animation: playing ? 'eqBar3 0.9s ease-in-out infinite 0.3s' : 'none',
                  }}
                />
                <span
                  className="w-[3px] rounded-full bg-zinc-400"
                  style={{
                    height: playing ? undefined : '24px',
                    animation: playing ? 'eqBar4 0.75s ease-in-out infinite 0.1s' : 'none',
                  }}
                />
              </div>

              {/* Truncated Track Title */}
              <div className="min-w-0 flex flex-inline align-center gap-0.5">
                <p className="max-w-[12ch] truncate text-sm font-medium text-zinc-100 pr-0.5">
                  {current?.title ?? 'No track playing'}
                </p>
              <p className="truncate text-sm text-zinc-400">
    ~ {current?.artist ?? 'Search to pick music'}
  </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Search className="ml-1 h-4 w-4 shrink-0 text-zinc-500" />
            <input
              value={query}
              onChange={event => set_query(event.target.value)}
              placeholder="Search songs, artists..."
              className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            />
            {loading && <LoaderCircle className="h-4 w-4 animate-spin text-zinc-500" />}
          </div>

          {/* Track List */}
          <div className="custom-scrollbar max-h-64 overflow-y-auto px-2 pb-2">
            {error && <p className="px-3 py-5 text-center text-sm text-zinc-500">{error}</p>}
            {!error && !tracks.length && (
              <p className="px-5 py-7 text-center text-sm leading-5 text-zinc-600">
                Search a song to build your queue.
              </p>
            )}
            {tracks.map(track => {
              const is_active = current?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    set_current(track);
                    set_playing(true);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl p-2 my-1 text-left transition ${
                    is_active ? 'bg-white/10' : 'hover:bg-white/10'
                  }`}
                >
                  {track.image ? (
                    <img src={track.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500">
                      <Disc3 className="h-4 w-4" />
                    </div>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-zinc-200">
                      {track.title}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-light text-zinc-500">
                      {track.artist} · {track.album}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-zinc-400/80">
                    {format_duration(track.duration)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom Player Unit: Controls Base Box + Sticking-out Chevron Toggle + Big CD Player */}
      <div className="-translate-x-[3rem] relative flex items-center gap-3">
        {/* The Controls Base Box */}
        <div className="relative flex items-center gap-5 rounded-tl-xl border-l border-t border-white/15 px-2 py-0.5">



        <button
          onClick={() => set_open(prev => !prev)}
          title={playing ? 'Pause vinyl disc' : 'Spin & play vinyl disc'}
          className="z-[10] absolute -top-15 left-1/2 bg-black/50 translate-x-[3rem] flex h-[10rem] w-[10rem] shrink-0 items-center justify-center rounded-full border border-white/20 p-1 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full ${
              playing ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-full" />
            {current?.image ? (
              <img
                src={current.image}
                alt={current.title}
                className="h-[10rem] w-[10rem] rounded-full object-cover border border-zinc-800 shadow"
              />

            ) : (<></>
            )}
          </div>
        </button>

        {/* Controls: Previous, Play/Pause, Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handle_prev}
              title="Previous song"
              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={toggle_playback}
              title={playing ? 'Pause' : 'Play'}
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full text-zinc-200 shadow-md hover:scale-110 hover:text-zinc-100 active:scale-95 cursor-pointer"
            >
              {playing ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4" fill="currentColor" />
              )}
            </button>

            <button
              onClick={handle_next}
              title="Next song"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      <audio
        ref={audio_ref}
        onPlay={() => set_playing(true)}
        onPause={() => set_playing(false)}
        onEnded={handle_next}
      />
    </div>
  );
};

export default MusicPlayer;