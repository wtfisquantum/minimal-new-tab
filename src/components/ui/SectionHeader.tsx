import React from 'react';

interface SectionHeaderProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

const SectionHeader = ({ children, icon: Icon, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
      <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">{children}</h3>
    </div>
    {action && action}
  </div>
);

export default SectionHeader;
