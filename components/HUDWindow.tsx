
import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { HUD_COLORS } from '../constants';
import { analyzePlayerWithAI } from '../services/geminiService';

interface HUDWindowProps {
  stats: PlayerStats;
  onClose?: () => void;
}

const HUDWindow: React.FC<HUDWindowProps> = ({ stats, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const result = await analyzePlayerWithAI(stats);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-black/90 border border-slate-700 rounded shadow-2xl p-2 w-48 select-none overflow-hidden hover:border-indigo-500 transition-colors">
      <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1">
        <span className="text-[10px] font-bold text-slate-400 truncate w-24">
          {stats.Player.toUpperCase()}
        </span>
        <div className="flex gap-1">
            <button 
                onClick={getInsight}
                className="text-[9px] px-1 bg-indigo-900/50 hover:bg-indigo-700 text-indigo-200 rounded transition-colors"
                title="AI Analysis"
            >
                {loading ? '...' : 'AI'}
            </button>
            <span className="text-[9px] text-slate-600">{stats["Hands Abbr"]}h</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-x-1 text-[11px] mono">
        <div className="text-slate-400">VPIP:</div>
        <div style={{ color: HUD_COLORS.default }}>{stats.VPIP}</div>
        <div className="text-slate-400">PFR:</div>
        <div style={{ color: HUD_COLORS.default }}>{stats.PFR}</div>
        
        <div className="text-slate-400">3B:</div>
        <div style={{ color: HUD_COLORS.orange }}>{stats["3Bet Total"]}</div>
        <div className="text-slate-400">F3B:</div>
        <div style={{ color: HUD_COLORS.green }}>{stats["Fold to 3Bet"]}</div>
        
        <div className="text-slate-400">WWSF:</div>
        <div style={{ color: HUD_COLORS.blue }}>{stats.WWSF}</div>
        <div className="text-slate-400">W$SD:</div>
        <div style={{ color: HUD_COLORS.blue }}>{stats["W$SD"]}</div>
      </div>

      {insight && (
        <div className="mt-2 pt-1 border-t border-slate-800 text-[9px] text-indigo-300 leading-tight italic">
          {insight}
          <button onClick={() => setInsight(null)} className="block mt-1 text-slate-500 hover:text-white underline">dismiss</button>
        </div>
      )}
    </div>
  );
};

export default HUDWindow;
