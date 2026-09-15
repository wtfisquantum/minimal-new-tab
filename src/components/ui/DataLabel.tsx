import React from 'react';

interface DataLabelProps {
  children: React.ReactNode;
}

const DataLabel = ({ children }: DataLabelProps) => (
  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{children}</h4>
);

export default DataLabel;
