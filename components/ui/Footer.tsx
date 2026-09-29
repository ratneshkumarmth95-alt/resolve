import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#07090F] py-8 text-xs text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-gray-300">MURMUR</span>
          <span>— Hear the machine before it screams.</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Live SSE Active
          </span>
          <span>•</span>
          <span>PS04 Hackathon Demo</span>
        </div>
      </div>
    </footer>
  );
};
