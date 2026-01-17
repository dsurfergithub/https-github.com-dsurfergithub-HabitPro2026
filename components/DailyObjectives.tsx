
import React, { useState, useMemo } from 'react';
import { DailyObjectiveRecord } from '../types';
import { CheckCircle2, Circle, Clock, History, Zap, Star, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DailyObjectivesProps {
  currentRecord: DailyObjectiveRecord;
  history: DailyObjectiveRecord[];
  onToggleTask: (taskId: string) => void;
  onSetTaskText: (taskId: string, text: string) => void;
}

const MOTIVATIONS = [
  "Hoy has vencido al destino.",
  "La disciplina es tu superpoder.",
  "Un paso más cerca de la grandeza.",
  "Eres el arquitecto de tu futuro.",
  "Inercia total alcanzada.",
  "Nivel de enfoque: Legendario."
];

export const DailyObjectives: React.FC<DailyObjectivesProps> = ({ 
  currentRecord, 
  history, 
  onToggleTask,
  onSetTaskText
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const completedCount = currentRecord.tasks.filter(t => t.completed).length;
  const isPerfect = completedCount === 7;
  const progress = (completedCount / 7) * 100;

  const randomQuote = useMemo(() => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)], [isPerfect]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">7 Maestros</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Tu enfoque diario absoluto</p>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 border border-white/5 transition-all active:scale-90"
          title="Ver Historial"
        >
          {showHistory ? <Clock size={20} /> : <History size={20} />}
        </button>
      </div>

      {!showHistory ? (
        <div className="space-y-6">
          {/* Barra de Progreso Visual */}
          <div className="bg-[#141414] p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10">
               <div className="flex items-center gap-2">
                 <Zap className={completedCount > 0 ? "text-lime-400 fill-lime-400" : "text-gray-800"} size={20} />
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Progreso del Día</span>
               </div>
               <span className="text-2xl font-black text-white">{completedCount}/7</span>
            </div>
            
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-lime-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(163,230,53,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {isPerfect && (
              <div className="mt-4 p-4 bg-lime-500/10 border border-lime-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
                <Trophy className="text-lime-400 shrink-0" size={20} />
                <p className="text-xs font-bold text-lime-400 italic">"{randomQuote}"</p>
              </div>
            )}

            {/* Propuesta Creativa: Efecto de Resonancia */}
            {isPerfect && (
              <div className="absolute inset-0 border-2 border-lime-500/30 rounded-[2.5rem] animate-pulse pointer-events-none" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentRecord.tasks.map((task, idx) => (
              <div 
                key={task.id} 
                className={`group flex items-center gap-4 p-3 pr-6 rounded-[1.8rem] border transition-all ${
                  task.completed 
                    ? 'bg-lime-500/5 border-lime-500/10' 
                    : 'bg-[#141414] border-white/5 hover:border-white/10'
                }`}
              >
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                    task.completed 
                      ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/20' 
                      : 'bg-white/5 text-gray-700 hover:text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1 flex flex-col">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Objetivo {idx + 1}</span>
                  <input 
                    value={task.text}
                    onChange={(e) => onSetTaskText(task.id, e.target.value)}
                    placeholder="¿Qué vas a conquistar?"
                    className={`bg-transparent border-none p-0 text-base md:text-lg font-bold focus:ring-0 placeholder:text-gray-800 transition-all ${
                      task.completed ? 'text-gray-600 line-through' : 'text-white'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {history.length === 0 ? (
            <div className="py-24 text-center text-gray-700 font-bold italic border-2 border-dashed border-white/5 rounded-[2.5rem]">
              Tu historial de conquistas está naciendo...
            </div>
          ) : (
            history.map((record) => (
              <div key={record.date} className="bg-[#141414] border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {format(new Date(record.date), 'EEEE', { locale: es })}
                    </span>
                    <span className="text-lg font-black text-gray-200">
                      {format(new Date(record.date), 'dd MMMM', { locale: es })}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {record.tasks.map(t => (
                      <div 
                        key={t.id} 
                        className={`w-2.5 h-2.5 rounded-full ${t.completed ? 'bg-lime-500 shadow-[0_0_5px_#afff00]' : 'bg-white/5'}`} 
                        title={t.text || 'Sin tarea'}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    {record.tasks.every(t => t.completed || t.text === '') && record.tasks.some(t => t.text !== '') && (
                        <Star className="text-lime-400 animate-bounce" size={16} />
                    )}
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${record.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-lime-500/10 text-lime-500'}`}>
                        {record.status === 'failed' ? 'Incompleto' : 'Logrado'}
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
