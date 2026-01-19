
import React from 'react';
import { RankingEntry } from '../types';

interface RankingTableProps {
  entries: RankingEntry[];
}

const RankingTable: React.FC<RankingTableProps> = ({ entries }) => {
  const sorted = [...entries].sort((a, b) => b.totalPoints - a.totalPoints);

  const getRankBadge = (index: number) => {
    switch(index) {
      case 0: return 'bg-yellow-500 shadow-[0_0_15px_#eab308]';
      case 1: return 'bg-slate-300 shadow-[0_0_15px_#cbd5e1]';
      case 2: return 'bg-amber-600 shadow-[0_0_15px_#d97706]';
      default: return 'bg-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-orbitron font-black tracking-tighter text-white uppercase italic">
            LEADERBOARD
          </h2>
          <p className="text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase">Season 01 // Active</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-orbitron">Live Ops</span>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((entry, index) => (
          <div 
            key={entry.employeeId}
            className={`group relative overflow-hidden rounded-xl border-l-4 transition-all duration-500 p-1 ${entry.borderColor} bg-slate-900/60 hover:bg-slate-800/80 hover:translate-x-2`}
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-6">
                <div className={`flex items-center justify-center w-12 h-12 font-orbitron font-black text-xl italic rounded-lg skew-x-[-15deg] ${getRankBadge(index)} text-black`}>
                  {index + 1}
                </div>
                
                <div className="relative group-hover:scale-110 transition-transform duration-500">
                  <div className={`absolute -inset-1 rounded-full blur-md opacity-40 transition-opacity group-hover:opacity-100 ${entry.borderColor.replace('border-', 'bg-')}`}></div>
                  <img 
                    src={entry.avatar} 
                    alt={entry.name}
                    className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${entry.name}&background=random&color=fff`; }}
                  />
                  {index === 0 && (
                     <div className="absolute -top-2 -right-2 bg-yellow-400 text-black p-1 rounded-full shadow-[0_0_10px_#facc15]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                     </div>
                  )}
                </div>

                <div>
                  <h3 className={`font-orbitron font-black text-2xl leading-none uppercase tracking-tighter text-white ${entry.glowColor}`}>
                    {entry.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${entry.color}`}>
                        {entry.sector}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                       {entry.submissionsCount} OPS COMPLETE
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-orbitron font-black text-4xl italic tracking-tighter ${entry.color} ${entry.glowColor}`}>
                  {entry.totalPoints.toFixed(1)}
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-[-4px]">Combat Points</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingTable;
