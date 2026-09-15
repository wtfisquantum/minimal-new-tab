import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import PillBadge from '../ui/PillBadge';

interface Article {
  imageUrl: string;
  title: string;
  content: string;
  sourceUrl: string;
}

const NewsCarousel = () => {
  const [feed, setFeed] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const grab_news = async () => {
      try {
        const res = await fetch('https://inshorts.vercel.app/news/topics/technology?offset=0');
        const data = await res.json();
        setFeed(data.data.articles.slice(0, 7));
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    };
    grab_news();
  }, []);

  const fade_to = (nextIndex: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setFading(false);
    }, 280);
  };

  const jump_to = useCallback(
    (index: number) => {
      if (index === currentIndex || feed.length === 0) return;
      fade_to(index);
    },
    [currentIndex, feed.length]
  );

  const next_slide = useCallback(() => {
    fade_to((currentIndex + 1) % feed.length);
  }, [currentIndex, feed.length]);

  const prev_slide = useCallback(() => {
    fade_to((currentIndex - 1 + feed.length) % feed.length);
  }, [currentIndex, feed.length]);

  const kick_timer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (feed.length > 1) {
      intervalRef.current = setInterval(() => {
        setFading(true);
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % feed.length);
          setFading(false);
        }, 280);
      }, 5000);
    }
  }, [feed.length]);

  useEffect(() => {
    kick_timer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [kick_timer]);

  const curr = feed[currentIndex];

  return (
    <div className="flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-lg relative">
      <SectionHeader icon={ImageIcon}>Latest Tech News</SectionHeader>

      <div className="relative w-full flex-1 rounded-2xl overflow-hidden group mb-3 shadow-inner bg-zinc-950">
        {curr ? (
          <>
            <img
              src={curr.imageUrl}
              alt={curr.title}
              className="w-full h-full object-cover group-hover:scale-105"
              style={{
                transition: 'opacity 0.28s ease, transform 0.6s ease, filter 0.6s ease',
                opacity: fading ? 0 : 1,
                filter: fading ? 'blur(4px)' : 'brightness(0.72)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/30 to-transparent" />

            {/* <div className="absolute top-3 right-3">
              <PillBadge text="Tech News" />
            </div> */}

            {feed.length > 1 && (
              <>
                <button
                  onClick={() => { prev_slide(); kick_timer(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-950/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { next_slide(); kick_timer(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-950/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <div
              className="absolute bottom-3 left-3 right-3"
              style={{
                transition: 'opacity 0.28s ease, transform 0.28s ease',
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(6px)' : 'translateY(0)',
              }}
            >
              <h4 className="text-md font-medium text-white leading-snug tracking-tight mb-1 line-clamp-1">
                {curr.title}
              </h4>
              <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                {curr.content}
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-zinc-400 animate-spin" />
          </div>
        )}
      </div>

      {feed.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 shrink-0 pb-0.5">
          {feed.map((_, i) => (
            <button
              key={i}
              onClick={() => { jump_to(i); kick_timer(); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? '16px' : '6px',
                height: '6px',
                backgroundColor: i === currentIndex ? '#e4e4e7' : '#3f3f46',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsCarousel;
