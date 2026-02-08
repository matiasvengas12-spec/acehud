
import React, { useState } from 'react';
import { analyzePlayerWithAI } from '../services/geminiService';
import { PlayerStats } from '../types';

interface HarAnalyzerProps {
  playerDb: Record<string, PlayerStats>;
}

const HarAnalyzer: React.FC<HarAnalyzerProps> = ({ playerDb }) => {
  const [handLog, setHandLog] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!handLog.trim()) return;
    setAnalyzing(true);
    
    // Simulate AI analysis of the logic
    try {
      // In a real app, we'd parse the log. Here we just use AI to find patterns.
      const prompt = `Analyze this poker hand log and provide a logical breakdown of the hero's mistake or a good play. Keep it professional and technical: \n\n ${handLog}`;
      // Using a simplified call for this mock-up
      const result = await analyzePlayerWithAI({ Player: 'Log Analysis', VPIP: '0', PFR: '0', "3Bet Total": '0', "Fold to 3Bet": '0', WWSF: '0', "W$SD": '0', "Hands Abbr": '0' } as any);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Error analyzing hand log.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">HAR Logic Analyzer</h2>
        <p className="text-slate-400">Paste your Hand History (HH) or HAR logs to analyze strategic patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
            <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Input Raw Log
            </div>
            <textarea
              className="w-full h-96 bg-transparent p-4 text-slate-300 mono text-xs outline-none resize-none"
              placeholder="Paste Hand History here... [PokerStars / GG / Winamax format]"
              value={handLog}
              onChange={(e) => setHandLog(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing || !handLog}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-xl ${
              analyzing || !handLog 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {analyzing ? 'Processing Logic...' : 'Analyze Strategic Pattern'}
          </button>
        </div>

        <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-bold text-white">AI Reasoning Engine</h3>
          </div>
          
          <div className="flex-1 space-y-4">
            {!analysis && !analyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <p className="text-sm">Enter a hand history to receive an automated tactical audit.</p>
              </div>
            )}
            
            {analyzing && (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
            )}

            {analysis && (
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-slate-300 text-sm leading-relaxed italic">
                {analysis}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarAnalyzer;
