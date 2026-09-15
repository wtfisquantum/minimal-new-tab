import React from 'react';

interface PillBadgeProps {
  text: string;
}

const PillBadge = ({ text }: PillBadgeProps) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full bg-zinc-800/60 text-[10px] font-medium uppercase tracking-wider text-zinc-300 border border-zinc-700 backdrop-blur-md">{text}</span>
);

export default PillBadge;
