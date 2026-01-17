
import React from 'react';
import { Habit, DayStatus } from '../types';
import { getDaysOfYear, getDayKey } from '../utils';
import { startOfYear, differenceInDays } from 'date-fns';

interface HabitTimelineProps {
  habits: Habit[];
}

export const HabitTimeline: React.FC<HabitTimelineProps> = ({ habits }) => {
  const days = getDaysOfYear(new Date().getFullYear());
  const today = new Date();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Líneas de Tiempo</h2>
        <p className="text-gray-400 font-medium">Cronología anual de tu consistencia.</p>
      </div>

      {habits.length === 0 ? (
        <div className="py-20 text-center text-gray-600 font-bold border-2 border-dashed border-white/5 rounded-[2.5rem]">
          No hay hábitos activos para comparar.
        </div>
      ) : (
        <div className="space-y-12 overflow-x-auto pb-4 no-scrollbar">
          {habits.map(habit => {
            const completedCount = Object.values(habit.history).filter(s => s === 'completed').length;

            return (
              <div key={habit.id} className="min-w-[1000px] px-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: habit.color }} />
                    <span className="text-sm font-black uppercase tracking-widest text-white">
                      {habit.name}
                    </span>
                  </div>
                  <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    {completedCount} días de 365
                  </div>
                </div>
                
                <div className="h-12 bg-white/[0.02] rounded-2xl flex overflow-hidden border border-white/5 relative group hover:border-white/10 transition-all shadow-inner">
                  {days.map((day, idx) => {
                    const key = getDayKey(day);
                    const status = habit.history[key] || 'none';
                    const isFuture = day > today;
                    
                    return (
                      <div 
                        key={idx}
                        className={`flex-1 h-full border-r border-black/10 last:border-0 ${isFuture ? 'opacity-10' : ''}`}
                        style={{
                          backgroundColor: status === 'completed' ? habit.color : 
                                           status === 'break' ? `${habit.color}44` : 'transparent',
                        }}
                        title={`${day.toLocaleDateString()}: ${status}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* X-Axis labels (Months) */}
          <div className="min-w-[1000px] flex border-t border-white/5 pt-6 px-2">
            {Array.from({ length: 12 }).map((_, m) => (
              <div key={m} className="flex-1 text-[10px] text-gray-600 font-black uppercase text-center tracking-widest">
                {new Date(0, m).toLocaleString('es-ES', { month: 'short' })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
