
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, label: 'Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: ViewType.TABLES, label: 'Session View', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: ViewType.DATABASE, label: 'Data Registry', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
    { id: ViewType.HAR_ANALYZER, label: 'Logic Audit', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: ViewType.SETTINGS, label: 'Preferences', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-900/50 flex flex-col h-full shrink-0 z-30">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">ACE<span className="text-indigo-500">HUD</span></h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Desktop Master</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
        <div className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Main Application</div>
        {menuItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)]'
                : 'text-slate-500 hover:bg-slate-900/80 hover:text-slate-300'
            }`}
          >
            <svg className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}

        <div className="pt-6 px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">System</div>
        {menuItems.slice(4).map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
              currentView === item.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-500 hover:bg-slate-900/80 hover:text-slate-300'
            }`}
          >
            <svg className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-indigo-600/5 rounded-3xl border border-indigo-500/10 p-5 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </div>
             <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-tight">License Active<br/><span className="text-slate-500 font-medium normal-case tracking-normal underline cursor-pointer">Manage subscription</span></div>
          </div>
          <div className="h-px bg-indigo-500/10"></div>
          <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-tighter">
             <span>Memory: 1.4GB</span>
             <span>CPU: 4%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
