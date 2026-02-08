
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewType, AppState, TableSize, PokerTable, PlayerStats, HandHistory } from './types';
import Sidebar from './components/Sidebar';
import PokerTableDisplay from './components/PokerTableDisplay';
import HarAnalyzer from './components/HarAnalyzer';
import { generateMockStats, MOCK_PLAYER_NAMES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: ViewType.DASHBOARD,
    tableCount: 1,
    tableSize: 6,
    playerDb: {},
    activeTables: [],
    isDbLoaded: false,
    recentHands: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeData = useCallback(() => {
    const db: Record<string, PlayerStats> = {};
    MOCK_PLAYER_NAMES.forEach(name => {
      // Fixed: generateMockStats now returns full PlayerStats object
      db[name.toLowerCase()] = generateMockStats(name);
    });

    const tables: PokerTable[] = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      name: `Table #${1024 + i}`,
      size: 6,
      players: new Array(6).fill(null)
    }));

    // Generate some fake recent hands for the dashboard
    const hands: HandHistory[] = [
      { id: 'h1', timestamp: '14:20:01', hero: 'AceMaster99', table: 'Table #1024', action: 'All-in Preflop', outcome: '+142 BB' },
      { id: 'h2', timestamp: '14:22:15', hero: 'AceMaster99', table: 'Table #1024', action: 'Fold on River', outcome: '-12 BB' },
      { id: 'h3', timestamp: '14:25:30', hero: 'AceMaster99', table: 'Table #1025', action: 'Check-Raise', outcome: '+45 BB' },
    ];

    tables[0].players[0] = "AceMaster99";
    tables[0].players[1] = "FishFinder";

    setState(prev => ({
      ...prev,
      playerDb: db,
      activeTables: tables,
      isDbLoaded: true,
      recentHands: hands
    }));
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Assuming file format matches Record<string, PlayerStats> or an array of PlayerStats
        let newDb: Record<string, PlayerStats> = {};
        if (Array.isArray(json)) {
          json.forEach(p => { newDb[p.Player.toLowerCase()] = p; });
        } else {
          newDb = json;
        }
        
        setState(prev => ({ ...prev, playerDb: { ...prev.playerDb, ...newDb }, isDbLoaded: true }));
        alert(`Loaded ${Object.keys(newDb).length} players successfully.`);
      } catch (err) {
        alert("Invalid file format. Please upload a valid JSON player database.");
      }
    };
    reader.readAsText(file);
  };

  const setView = (view: ViewType) => setState(prev => ({ ...prev, currentView: view }));

  const handleSeatChange = (tableId: number, seatIndex: number, playerName: string) => {
    setState(prev => {
      const newTables = [...prev.activeTables];
      const table = newTables.find(t => t.id === tableId);
      if (table) {
        table.players[seatIndex] = playerName || null;
      }
      return { ...prev, activeTables: newTables };
    });
  };

  const renderContent = () => {
    switch (state.currentView) {
      case ViewType.DASHBOARD:
        return (
          <div className="p-10 max-w-7xl mx-auto space-y-10">
            <header className="flex justify-between items-start">
              <div className="animate-in fade-in slide-in-from-left duration-700">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                   Online Tracking Active
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Operation Dashboard</h2>
                <p className="text-slate-400 max-w-lg">Advanced real-time statistics hub for professional multi-tabling environments.</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json"
                  onChange={handleFileUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Import Database
                </button>
                <button 
                   onClick={() => setView(ViewType.TABLES)}
                   className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] text-sm font-semibold transition-all flex items-center gap-2 group"
                >
                  Launch HUD
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Player Database', value: Object.keys(state.playerDb).length, sub: 'Verified profiles', color: 'indigo' },
                { label: 'Active Tables', value: state.tableCount, sub: 'In simulation', color: 'emerald' },
                { label: 'Hands Processed', value: '142.5k', sub: 'Last 24h', color: 'amber' },
                { label: 'System Uptime', value: '99.9%', sub: 'No drops detected', color: 'blue' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 hover:bg-slate-900/60 transition-all group">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4 group-hover:text-slate-400 transition-colors">{stat.label}</span>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Live Monitoring Flow</h3>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Feed Stable</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {state.activeTables.slice(0, 2).map(table => (
                      <div key={table.id} className="group bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50 flex items-center justify-between hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base">{table.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{table.size}-Max NL Hold'em • Blinds: $1/$2</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <div className="text-sm font-bold text-indigo-400">{table.players.filter(p => !!p).length} players</div>
                            <div className="text-[10px] text-slate-600 uppercase font-black">Tracking HUD</div>
                          </div>
                          <button onClick={() => setView(ViewType.TABLES)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 p-8 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="flex-1 space-y-6">
                  {state.recentHands.map((hand) => (
                    <div key={hand.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-800">
                      <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-300">{hand.action}</span>
                        <span className="text-[10px] text-slate-600 mono">{hand.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{hand.table}</span>
                        <span className={`text-xs font-bold ${hand.outcome.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{hand.outcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-8 text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] w-full text-center">View Session Report</button>
              </div>
            </div>
          </div>
        );
      case ViewType.TABLES:
        return (
          <div className="flex-1 flex flex-col h-full bg-[#070b14]">
            <div className="px-8 py-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/60 backdrop-blur-2xl sticky top-0 z-20">
              <div className="flex items-center gap-6">
                 <div>
                    <h3 className="text-white font-bold text-lg leading-tight">Live HUD Suite</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active session: 01:24:12</p>
                 </div>
                 <div className="h-8 w-px bg-slate-800 mx-2"></div>
                <div className="flex gap-3">
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button 
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${state.tableCount === 1 ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setState(prev => ({ ...prev, tableCount: 1 }))}
                        >Single</button>
                        <button 
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${state.tableCount === 2 ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setState(prev => ({ ...prev, tableCount: 2 }))}
                        >Dual</button>
                        <button 
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${state.tableCount === 4 ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setState(prev => ({ ...prev, tableCount: 4 }))}
                        >Quad</button>
                    </div>
                    <select 
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-1.5 text-xs font-bold text-white outline-none cursor-pointer hover:border-slate-700 transition-colors"
                        value={state.tableSize}
                        onChange={(e) => setState(prev => ({ ...prev, tableSize: parseInt(e.target.value) as TableSize }))}
                    >
                        <option value={6}>6-MAX</option>
                        <option value={9}>9-MAX</option>
                    </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">P{i}</div>)}
                 </div>
                 <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Sync All</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-12 bg-[#070b14] custom-scrollbar">
              <div className={`grid gap-16 ${state.tableCount > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-6xl mx-auto'}`}>
                {state.activeTables.slice(0, state.tableCount).map((table) => (
                  <div key={table.id} className="animate-in zoom-in-95 duration-500 space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <h3 className="text-white font-black uppercase text-sm tracking-widest">{table.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-tighter">
                            <span>VPIP: 24.2%</span>
                            <span className="text-slate-700">|</span>
                            <span>PFR: 19.8%</span>
                        </div>
                    </div>
                    <PokerTableDisplay 
                      table={{...table, size: state.tableSize}} 
                      playerDb={state.playerDb} 
                      onSeatChange={handleSeatChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case ViewType.DATABASE:
        return (
          <div className="p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-extrabold text-white mb-2">Registry</h2>
                <p className="text-slate-400">Manage and analyze your historical player data.</p>
              </div>
              <div className="flex gap-3">
                 <div className="relative group">
                    <input 
                    type="text" 
                    placeholder="Search player name..." 
                    className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-white pl-12 w-80 outline-none focus:ring-2 ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                    <svg className="w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 absolute left-4 top-3.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900/40 rounded-[32px] border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Full Identification</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sample Size</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Pre-Flop (V/P)</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Aggression (3B)</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Post-Flop (WWSF)</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Profile</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                    {/* Fixed: Explicitly typed 'p' as PlayerStats to handle 'unknown' type inference from Object.values */}
                    {Object.values(state.playerDb).map((p: PlayerStats, idx) => (
                        <tr key={idx} className="hover:bg-indigo-500/5 transition-all group cursor-pointer">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-900/40 group-hover:text-indigo-400 transition-all font-bold text-xs">
                                    {p.Player.charAt(0)}
                                </div>
                                <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">{p.Player}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-slate-400 mono text-xs">{p["Hands Abbr"]} Hands</td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-1">
                                <span className="text-emerald-400 font-bold">{p.VPIP}%</span>
                                <span className="text-slate-600">/</span>
                                <span className="text-emerald-500/80 font-bold">{p.PFR}%</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded text-xs font-bold border border-amber-500/10">{p["3Bet Total"]}%</span>
                        </td>
                        <td className="px-8 py-6 text-indigo-400 font-bold">{p.WWSF}%</td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                                    <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (parseInt(p.PFR) / parseInt(p.VPIP)) * 100)}%` }}></div>
                                </div>
                                <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest border border-slate-800 px-3 py-1 rounded-lg hover:bg-slate-800 transition-all">Details</button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case ViewType.HAR_ANALYZER:
        return <HarAnalyzer playerDb={state.playerDb} />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 mb-6">
                <svg className="w-10 h-10 text-slate-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
            </div>
            <p className="font-bold text-slate-600 uppercase tracking-[0.3em]">Component Access Restricted</p>
            <p className="text-sm mt-2">Experimental build: Module "{state.currentView}" integration pending.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#05070a] overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar currentView={state.currentView} setView={setView} />
      <main className="flex-1 flex flex-col min-w-0 overflow-auto scroll-smooth bg-[radial-gradient(circle_at_top_right,rgba(30,41,59,0.3),transparent)]">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
