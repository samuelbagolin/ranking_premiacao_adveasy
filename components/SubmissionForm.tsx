
import React, { useState, useRef } from 'react';
import { EMPLOYEES } from '../constants';

interface SubmissionFormProps {
  onSubmit: (employeeId: string, lawyerName: string, evidenceBase64: string) => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [lawyerName, setLawyerName] = useState('');
  const [evidence, setEvidence] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedEmployee = EMPLOYEES.find(e => e.id === selectedEmployeeId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEvidence(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployeeId && lawyerName && evidence) {
      onSubmit(selectedEmployeeId, lawyerName, evidence);
      setLawyerName('');
      setEvidence(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-xs font-black text-slate-500 mb-5 uppercase tracking-[0.4em] font-orbitron flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-500"></span> SELECT OPERATIVE
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EMPLOYEES.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployeeId(emp.id)}
              className={`relative cursor-pointer group rounded-xl border-2 transition-all duration-500 overflow-hidden h-48 flex flex-col justify-end p-4 ${
                selectedEmployeeId === emp.id 
                ? `${emp.borderColor} bg-slate-800 scale-[1.05] z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]` 
                : 'border-slate-800/50 bg-slate-900/40 opacity-70 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${emp.borderColor.replace('border-', 'bg-')}`}></div>
              
              {/* Character Image with Error Handling */}
              <div className="absolute inset-0">
                <img 
                   src={emp.avatar} 
                   className={`w-full h-full object-cover transition-all duration-700 ${
                     selectedEmployeeId === emp.id ? 'scale-110 brightness-110' : 'grayscale brightness-[0.3]'
                   }`} 
                   alt={emp.name}
                   onError={(e) => {
                     // Fallback para quando o link quebra
                     (e.target as HTMLImageElement).style.display = 'none';
                     const parent = (e.target as HTMLImageElement).parentElement;
                     if(parent) parent.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-800');
                   }}
                />
                {/* Fallback Label if image missing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 font-orbitron font-black text-2xl text-slate-700">
                  {emp.name.toUpperCase()}
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent ${selectedEmployeeId === emp.id ? 'opacity-90' : 'opacity-60'}`}></div>

              {/* HUD Brackets */}
              <div className={`${selectedEmployeeId === emp.id ? emp.color : 'text-slate-800'} transition-colors`}>
                <div className="hud-bracket-tl"></div>
                <div className="hud-bracket-br"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p className={`font-orbitron font-black text-xl leading-none uppercase tracking-tighter ${selectedEmployeeId === emp.id ? `${emp.color} ${emp.glowColor}` : 'text-slate-400'}`}>
                  {emp.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`h-[2px] w-4 ${selectedEmployeeId === emp.id ? emp.borderColor.replace('border-', 'bg-') : 'bg-slate-700'}`}></div>
                  <p className={`text-[9px] font-black tracking-[0.2em] uppercase ${selectedEmployeeId === emp.id ? 'text-white' : 'text-slate-600'}`}>
                    {emp.sector}
                  </p>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedEmployeeId === emp.id && (
                <div className="absolute top-3 right-3 animate-pulse">
                   <div className={`px-2 py-0.5 rounded text-[8px] font-black text-black bg-white shadow-[0_0_10px_white] tracking-widest uppercase`}>Active</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedEmployee && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.4em] font-orbitron">
              TARGET_IDENTIFICATION
            </label>
            <div className="relative">
               <input
                type="text"
                required
                value={lawyerName}
                onChange={(e) => setLawyerName(e.target.value)}
                placeholder="NOME DO ADVOGADO"
                className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-lg font-rajdhani text-2xl font-bold tracking-widest px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-800 uppercase"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.4em] font-orbitron">
              INTEL_SOURCE (SCREENSHOT)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group relative h-40 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                evidence ? 'border-green-500 bg-green-500/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-600'
              }`}
            >
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              
              {evidence ? (
                <div className="flex items-center gap-6 p-4">
                  <div className="relative">
                    <img src={evidence} className="h-28 w-40 object-cover rounded border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" alt="Evidence" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-black p-1 rounded-full"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg></div>
                  </div>
                  <div>
                    <span className="text-green-500 font-black text-xs tracking-[0.2em] uppercase font-orbitron block mb-1">DATA_SECURED</span>
                    <span className="text-slate-500 text-[9px] uppercase font-bold">Encrypted stream active</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform border border-slate-800">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-black text-[10px] tracking-widest uppercase font-orbitron">Establish Link</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedEmployeeId || !lawyerName || !evidence}
            className={`group relative w-full h-16 rounded-lg font-orbitron font-black text-xl tracking-[0.4em] transition-all duration-300 overflow-hidden transform active:scale-95 border-b-4 ${
              !selectedEmployeeId || !lawyerName || !evidence
              ? 'bg-slate-800 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
              : 'bg-blue-600 border-blue-800 text-white hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              SUBMIT_REPORT
            </span>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
          </button>
        </div>
      )}
    </form>
  );
};

export default SubmissionForm;
