
import React, { useState, useEffect, useMemo } from 'react';
import { EMPLOYEES, STORAGE_KEY } from './constants';
import { Submission, RankingEntry } from './types';
import SubmissionForm from './components/SubmissionForm';
import RankingTable from './components/RankingTable';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) { console.error("Intel corrupted", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }, [submissions]);

  const handleSubmission = (employeeId: string, lawyerName: string, evidenceBase64: string) => {
    const employee = EMPLOYEES.find(e => e.id === employeeId);
    if (!employee) return;

    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      employeeId,
      lawyerName,
      evidenceBase64,
      points: employee.weight
    };

    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const ranking = useMemo(() => {
    return EMPLOYEES.map(emp => {
      const empSubmissions = submissions.filter(s => s.employeeId === emp.id);
      const totalPoints = empSubmissions.reduce((sum, s) => sum + s.points, 0);
      
      return {
        ...emp,
        employeeId: emp.id,
        totalPoints,
        submissionsCount: empSubmissions.length,
      } as RankingEntry;
    });
  }, [submissions]);

  const recentSubmissions = useMemo(() => submissions.slice(0, 8), [submissions]);

  return (
    <div className="min-h-screen relative bg-[#020617]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]"></div>
      </div>

      <header className="sticky top-0 z-50 glass-card border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-blue-500 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black w-12 h-12 rounded-lg flex items-center justify-center font-orbitron font-black text-white text-2xl italic">
              AE
            </div>
          </div>
          <div>
            <h1 className="font-orbitron font-black text-2xl tracking-tighter text-white italic leading-none">
              CHURN ADV<span className="text-blue-500">EASY</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-1 w-8 bg-blue-500 rounded-full"></span>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                 Operations Terminal
               </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</p>
              <p className="text-sm font-orbitron font-bold text-green-500 uppercase">System Online</p>
           </div>
           <div className="h-10 w-[1px] bg-white/10"></div>
           <div className="flex gap-4">
              <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
           </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Action Hub */}
          <div className="lg:col-span-5 space-y-10">
            <div className="glass-card rounded-2xl p-8 border-white/5 neon-border-blue">
               <SubmissionForm onSubmit={handleSubmission} />
            </div>

            <div className="glass-card rounded-2xl p-6 border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-orbitron font-black text-white uppercase tracking-[0.3em]">MISSION LOG</h3>
                <span className="text-[10px] text-slate-600 font-bold uppercase italic">V. 2.0.4-Stable</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {recentSubmissions.map(s => {
                  const emp = EMPLOYEES.find(e => e.id === s.employeeId);
                  return (
                    <div key={s.id} className="group flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${emp?.color.replace('text-', 'bg-')}`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{s.lawyerName}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                            Operative: <span className={emp?.color}>{emp?.name}</span> • {new Date(s.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-black font-orbitron ${emp?.color}`}>+{s.points.toFixed(1)} CP</span>
                      </div>
                    </div>
                  );
                })}
                {recentSubmissions.length === 0 && (
                   <div className="py-8 text-center">
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest animate-pulse">Scanning for data...</p>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-7 space-y-10">
            <div className="glass-card rounded-2xl p-8 lg:p-10 border-white/10">
              <RankingTable entries={ranking} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: "Rules of Engagement", text: "Mandatory evidence upload for all combat points." },
                 { label: "Real-time Ops", text: "System syncs globally with zero latency for transparent ranking." },
                 { label: "Operative Multiplier", text: "Consecutive lawyer interactions valid per session rules." }
               ].map((rule, idx) => (
                 <div key={idx} className="p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-colors">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 font-orbitron">{rule.label}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-rajdhani font-medium uppercase tracking-wider">{rule.text}</p>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 pb-10 flex flex-col items-center gap-4">
         <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         <button 
           onClick={() => {
             if(confirm('TERMINATE ALL DATA SESSIONS? THIS CANNOT BE UNDONE.')) {
               setSubmissions([]);
               localStorage.removeItem(STORAGE_KEY);
             }
           }}
           className="text-[10px] font-black text-slate-700 hover:text-red-500 transition-colors uppercase tracking-[0.4em] font-orbitron"
         >
           [ TERMINATE_DATA_STREAM ]
         </button>
         <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">© 2025 ADVEASY CYBER-NETWORKS // ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};

export default App;
