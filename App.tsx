
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { EMPLOYEES } from './constants';
import { Submission, RankingEntry } from './types';
import SubmissionForm from './components/SubmissionForm';
import RankingTable from './components/RankingTable';

// Configuração fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyAbaSREpw7GIPhUN1CkcNmp4wrYZVqker0",
  authDomain: "ranking-premiacao-adveasy.firebaseapp.com",
  databaseURL: "https://ranking-premiacao-adveasy-default-rtdb.firebaseio.com",
  projectId: "ranking-premiacao-adveasy",
  storageBucket: "ranking-premiacao-adveasy.firebasestorage.app",
  messagingSenderId: "612863845485",
  appId: "1:612863845485:web:47254c723c87f47a6e4b64",
  measurementId: "G-EWCF8QVM2X"
};

// Inicialização segura
let db: any;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase Init Failed:", error);
}

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Monitor de Conexão Real
  useEffect(() => {
    if (!db) return;
    const connectedRef = ref(db, ".info/connected");
    const unsub = onValue(connectedRef, (snap) => {
      setIsConnected(snap.val() === true);
    });
    return () => unsub();
  }, []);

  // Sync de Dados
  useEffect(() => {
    if (!db) return;
    const submissionsRef = ref(db, 'submissions');
    const unsubscribe = onValue(submissionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([key, value]: [string, any]) => ({
          ...value,
          id: key
        })) as Submission[];
        setSubmissions(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setSubmissions([]);
      }
      setIsSyncing(false);
    }, (error) => {
      console.error("Firebase Sync Error:", error);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmission = async (employeeId: string, lawyerName: string, evidenceBase64: string) => {
    if (!isConnected) {
      alert("SEM CONEXÃO COM O SATÉLITE. VERIFIQUE SUA INTERNET.");
      return;
    }

    const employee = EMPLOYEES.find(e => e.id === employeeId);
    if (!employee) return;

    const newSubmission = {
      timestamp: Date.now(),
      employeeId,
      lawyerName: lawyerName.toUpperCase(),
      evidenceBase64,
      points: employee.weight
    };

    try {
      const submissionsRef = ref(db, 'submissions');
      await push(submissionsRef, newSubmission);
    } catch (e) {
      console.error("Transmission Failed:", e);
      alert("FALHA CRÍTICA NO ENVIO. TENTE NOVAMENTE.");
    }
  };

  const ranking = useMemo(() => {
    return EMPLOYEES.map(emp => {
      const empSubmissions = submissions.filter(s => s.employeeId === emp.id);
      const totalPoints = empSubmissions.reduce((sum, s) => sum + (s.points || 0), 0);
      return {
        ...emp,
        employeeId: emp.id,
        totalPoints,
        submissionsCount: empSubmissions.length,
      } as RankingEntry;
    });
  }, [submissions]);

  const recentSubmissions = useMemo(() => submissions.slice(0, 10), [submissions]);

  return (
    <div className="min-h-screen relative bg-[#020617]">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]"></div>
      </div>

      <header className="sticky top-0 z-50 glass-card border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-lg blur opacity-70 transition duration-1000 ${isConnected ? 'bg-blue-500' : 'bg-red-500 animate-pulse'}`}></div>
            <div className="relative bg-black w-12 h-12 rounded-lg flex items-center justify-center font-orbitron font-black text-white text-2xl italic">
              AE
            </div>
          </div>
          <div>
            <h1 className="font-orbitron font-black text-2xl tracking-tighter text-white italic leading-none">
              CHURN ADV<span className="text-blue-500">EASY</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className={`h-1 w-8 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                 {isConnected ? 'Link Established' : 'Signal Lost - Reconnecting...'}
               </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Database Health</p>
              <p className={`text-sm font-orbitron font-bold uppercase ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? 'System Online' : 'System Offline'}
              </p>
           </div>
           <div className="h-10 w-[1px] bg-white/10"></div>
           <div className="flex gap-4">
              <div className={`px-3 py-1 rounded border flex items-center gap-2 ${isConnected ? 'border-blue-500/30 bg-blue-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <span className={`text-[10px] font-black uppercase tracking-widest font-orbitron ${isConnected ? 'text-blue-400' : 'text-red-400'}`}>
                   {isConnected ? 'Cloud Sync active' : 'Disconnected'}
                 </span>
              </div>
           </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-10">
            <div className="glass-card rounded-2xl p-8 border-white/5 neon-border-blue">
               <SubmissionForm onSubmit={handleSubmission} />
            </div>

            <div className="glass-card rounded-2xl p-6 border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-orbitron font-black text-white uppercase tracking-[0.3em]">MISSION LOG</h3>
                <span className="text-[10px] text-slate-600 font-bold uppercase italic">Recent Operations</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {recentSubmissions.map(s => {
                  const emp = EMPLOYEES.find(e => e.id === s.employeeId);
                  return (
                    <div key={s.id} className="group flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${emp?.color.replace('text-', 'bg-') || 'bg-slate-700'}`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{s.lawyerName}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                            Operative: <span className={emp?.color}>{emp?.name || 'Unknown'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-black font-orbitron ${emp?.color || 'text-slate-400'}`}>+{(s.points || 0).toFixed(1)} CP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-10">
            <div className="glass-card rounded-2xl p-8 lg:p-10 border-white/10">
              <RankingTable entries={ranking} />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 pb-10 flex flex-col items-center gap-4">
         <button 
           onClick={async () => {
             if(confirm('PURGE GLOBAL DATABASE?')) {
               await remove(ref(db, 'submissions'));
             }
           }}
           className="text-[10px] font-black text-slate-700 hover:text-red-500 transition-colors uppercase tracking-[0.4em] font-orbitron"
         >
           [ PURGE_DATABASE ]
         </button>
      </footer>
    </div>
  );
};

export default App;
