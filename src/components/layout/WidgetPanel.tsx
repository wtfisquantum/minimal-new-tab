import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { widget_list } from '../../constants/widgets';

const PANEL_PX = 360;

interface WidgetPanelProps {
  open: boolean;
  selectedWidgets: string[];
  onToggle: () => void;
  onToggleWidget: (id: string) => void;
}

const NewsPreview = () => (
  <div className="w-full h-full bg-zinc-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/60 to-zinc-950" />
    <div className="absolute top-2 left-2 right-2 h-9 rounded-md bg-gradient-to-b from-zinc-700/30 to-zinc-900/50" />
    <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
      <div className="h-1 w-4/5 rounded-full bg-zinc-600" />
      <div className="h-0.5 w-3/5 rounded-full bg-zinc-800" />
      <div className="flex gap-1 mt-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === 2 ? 'w-3 bg-zinc-300' : 'w-1.5 bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  </div>
);

const ShortcutsPreview = () => (
  <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
    <div className="grid grid-cols-4 gap-1.5 px-3 w-full">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-lg bg-zinc-800/50 border border-zinc-700/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-500/70" />
        </div>
      ))}
    </div>
  </div>
);

const TodosPreview = () => {
  const rows = [
    { done: false, width: 'w-3/4' },
    { done: true, width: 'w-1/2' },
    { done: false, width: 'w-4/5' },
    { done: false, width: 'w-3/5' },
  ];
  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col justify-center gap-2 px-3.5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-sm flex-shrink-0 border ${r.done ? 'bg-zinc-400 border-zinc-400' : 'bg-transparent border-zinc-600'}`} />
          <div className={`h-0.5 rounded-full ${r.width} ${r.done ? 'bg-zinc-700 opacity-50' : 'bg-zinc-500'}`} />
        </div>
      ))}
    </div>
  );
};

const SoonPreview = () => (
  <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
    <div className="grid grid-cols-3 gap-1.5 opacity-[0.08] px-5 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-zinc-500" />
      ))}
    </div>
  </div>
);

const preview_map: Record<string, React.ReactNode> = {
  news: <NewsPreview />,
  shortcuts: <ShortcutsPreview />,
  todos: <TodosPreview />,
};

const WidgetPanel = ({ open, selectedWidgets, onToggle, onToggleWidget }: WidgetPanelProps) => (
  <>
    <div
      className="fixed top-0 right-0 h-full z-[200] flex flex-col bg-zinc-950/90 border-l border-zinc-700/50 backdrop-blur-2xl"
      style={{
        width: '22.5rem',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.6)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        <div className="grid grid-cols-2 gap-3">
          {widget_list.map(w => {
            const picked = selectedWidgets.includes(w.id);
            const slots_full = !picked && selectedWidgets.length >= 3;
            const blocked = w.soon || slots_full;
            const thumb = preview_map[w.id] ?? <SoonPreview />;

            return (
              <div
                key={w.id}
                onClick={() => !blocked && onToggleWidget(w.id)}
                className={`rounded-2xl border-2 overflow-hidden transition-all duration-200
                  ${picked ? 'border-white/75 bg-zinc-800/50' : 'border-zinc-700/40 bg-zinc-900/40'}
                  ${blocked && !picked ? 'opacity-35' : 'opacity-100'}
                  ${!blocked ? 'cursor-pointer hover:border-zinc-500/60' : 'cursor-not-allowed'}
                `}
              >
                <div className="relative overflow-hidden" style={{ height: '88px' }}>
                  {thumb}

                  {w.soon && (
                    <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-3 py-1 rounded-full border border-zinc-700/70 bg-zinc-900/60 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        Soon
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-3 py-2.5">
                  <p className={`text-[12px] font-medium leading-snug tracking-wider text-center transition-colors duration-200 ${picked ? 'text-zinc-200' : 'text-zinc-500'}`}>
                    {w.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <button
      onClick={onToggle}
      className="fixed top-1/2 -translate-y-1/2 z-[201] flex items-center justify-center bg-zinc-900/85 backdrop-blur-md border border-zinc-700/70"
      style={{
        right: open ? `${PANEL_PX - 0.5}px` : '0px',
        width: '20px',
        height: '56px',
        borderRight: open ? undefined : 'none',
        borderRadius: '8px 0 0 8px',
        boxShadow: '-2px 0 12px rgba(0,0,0,0.4)',
        transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'pointer',
      }}
    >
      {open
        ? <ChevronRight className="w-6 h-6 text-zinc-400" />
        : <ChevronLeft className="w-6 h-6 text-zinc-400" />
      }
    </button>
  </>
);

export default WidgetPanel;
