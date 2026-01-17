import React from 'react';
import { Habit } from '../types';
import { Trophy, Gift, Medal, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TrophyCabinetProps {
  habits: Habit[];
}

export const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ habits }) => {
  // Aplanamos todos los hitos y añadimos la info del hábito
  const allMilestones = habits.flatMap(h => 
    h.milestones.map(m => ({ ...m, habitName: h.name, habitColor: h.color }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Resumen agrupado para las tarjetas de arriba
  const habitSummary = habits.map(h => ({
    name: h.name,
    color: h.color,
    count: h.milestones.length,
    emoji: h.emojiTemplate || '⭐'
  })).filter(h => h.count > 0);

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Mi Vitrina</h2>
          <p className="text-gray-400 font-medium">Logros alcanzados a través de tu disciplina.</p>
        </div>
        <div className="bg-lime-500/10 border border-lime-500/20 px-6 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
           <Medal className="text-lime-400" size={32} />
           <div className="text-left">
             <span className="block text-[10px] font-black uppercase text-lime-600 leading-none mb-1 tracking-widest">Hitos Totales</span>
             <span className="text-2xl font-black text-lime-400 leading-none">{allMilestones.length}</span>
           </div>
        </div>
      </div>

      {/* Resumen Agrupado */}
      {habitSummary.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {habitSummary.map((h, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 p-5 rounded-3xl flex flex-col items-center text-center gap-2 hover:border-white/10 transition-all">
              <span className="text-4xl mb-2 drop-shadow-lg">{h.emoji}</span>
              <span className="text-sm font-bold text-white truncate w-full">{h.name}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{h.count} premios</span>
              <div className="w-8 h-1 rounded-full mt-2" style={{ backgroundColor: h.color }} />
            </div>
          ))}
        </div>
      )}

      {/* Historial Individual de Trofeos */}
      <section className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Historial Detallado</h3>
        
        {allMilestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <Trophy size={80} className="mb-6 opacity-5" />
            <p className="text-2xl font-black tracking-tight mb-2">Vitrina Vacía</p>
            <p className="text-sm max-w-xs text-center opacity-60 font-bold italic">
              Alcanza hitos en tus hábitos para ver tus medallas aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMilestones.map((milestone, idx) => (
              <div 
                key={`${milestone.id}-${idx}`}
                className="group relative bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 transition-all hover:bg-[#1a1a1a] hover:-translate-y-2 hover:border-white/20 active:scale-95 shadow-xl overflow-hidden"
              >
                {/* Glow decorativo */}
                <div 
                  className="absolute -right-16 -top-16 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: milestone.habitColor }}
                />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl bg-white/[0.03] border"
                    style={{ borderColor: `${milestone.habitColor}44` }}
                  >
                    {milestone.emoji || '🏆'}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-gray-500 mb-1">
                      <Calendar size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Fecha</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                      {format(new Date(milestone.date), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mb-8">
                  <h3 className="text-3xl font-black text-white leading-tight mb-2">
                    {milestone.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: milestone.habitColor, color: milestone.habitColor }} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                      {milestone.habitName}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 bg-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                   <div className="flex items-start gap-4">
                     <Gift size={20} className="shrink-0 text-lime-400 mt-1" />
                     <div className="space-y-1">
                       <span className="block text-[10px] font-black uppercase text-gray-600 tracking-widest">Recompensa</span>
                       <p className="text-lg font-bold text-lime-400 italic">"{milestone.reward || 'Mérito propio'}"</p>
                     </div>
                   </div>
                </div>

                <div className="absolute bottom-6 right-8 opacity-5 group-hover:opacity-20 transition-all pointer-events-none">
                   <Award size={80} style={{ color: milestone.habitColor }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
