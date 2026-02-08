
import React from 'react';
import { PokerTable, PlayerStats } from '../types';
import HUDWindow from './HUDWindow';

interface PokerTableDisplayProps {
  table: PokerTable;
  playerDb: Record<string, PlayerStats>;
  onSeatChange: (tableId: number, seatIndex: number, playerName: string) => void;
}

const PokerTableDisplay: React.FC<PokerTableDisplayProps> = ({ table, playerDb, onSeatChange }) => {
  const getSeatClass = (index: number) => {
    // Better positioning for a professional feel
    const positions = table.size === 6 
      ? ["top-[-20px] left-1/2 -translate-x-1/2", "top-[20%] right-[-10px]", "bottom-[20%] right-[-10px]", "bottom-[-20px] left-1/2 -translate-x-1/2", "bottom-[20%] left-[-10px]", "top-[20%] left-[-10px]"]
      : ["top-[-20px] left-1/2 -translate-x-1/2", "top-[10%] right-[5%]", "top-1/2 right-[-20px] -translate-y-1/2", "bottom-[10%] right-[5%]", "bottom-[-20px] left-1/2 -translate-x-1/2", "bottom-[10%] left-[5%]", "top-1/2 left-[-20px] -translate-y-1/2", "top-[10%] left-[5%]"];

    return `absolute ${positions[index] || ''}`;
  };

  return (
    <div className="relative w-full h-[540px] bg-slate-900/10 rounded-[4rem] border border-slate-800/50 flex items-center justify-center p-16 shadow-inner transition-all hover:border-slate-700/50 group">
      {/* Table Background Glow */}
      <div className="absolute inset-20 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      {/* Table Surface */}
      <div className="w-full h-full bg-[#0d2a1f] rounded-[140px] border-[16px] border-slate-950 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-visible">
        <div className="absolute inset-6 border-2 border-emerald-800/10 rounded-[120px]"></div>
        
        {/* Table Logo Center */}
        <div className="flex flex-col items-center opacity-10 select-none transform -rotate-12">
            <svg className="w-32 h-32 text-white mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
            <div className="text-white font-black text-5xl tracking-[0.5em]">ACE</div>
        </div>
        
        {/* Seats */}
        {Array.from({ length: table.size }).map((_, i) => {
          const playerName = table.players[i];
          const stats = playerName ? playerDb[playerName.toLowerCase()] : null;

          return (
            <div key={i} className={`${getSeatClass(i)} z-10 p-4 transition-all hover:scale-105`}>
              <div className="flex flex-col items-center">
                {stats ? (
                  <div className="shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)]">
                    <HUDWindow stats={stats} />
                  </div>
                ) : (
                  <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/50 rounded-2xl p-4 w-40 flex flex-col items-center gap-3 shadow-xl ring-1 ring-white/5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-700">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Assign Player..." 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-center outline-none text-slate-300 focus:border-indigo-500/50 transition-colors font-bold"
                      onBlur={(e) => onSeatChange(table.id, i, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onSeatChange(table.id, i, (e.target as HTMLInputElement).value)}
                    />
                  </div>
                )}
                <div className="mt-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 shadow-sm">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Position {i + 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokerTableDisplay;
