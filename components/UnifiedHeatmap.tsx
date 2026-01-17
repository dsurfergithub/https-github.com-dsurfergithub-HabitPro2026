
import React from 'react';
import { Habit, MONTHS } from '../types';
import { getMonthDayMatrix, getDayKey } from '../utils';

interface UnifiedHeatmapProps {
  habits: Habit[];
}

export const UnifiedHeatmap: React.FC<UnifiedHeatmapProps> = ({ habits }) => {
  const matrix = getMonthDayMatrix(new Date().getFullYear());
  
  const getGlobalIntensity = (date: Date | null) => {
    if (!date || habits.length === 0) return 0;
    const key = getDayKey(date);
    const completedCount = habits.filter(h => h.history[key] === 'completed').length;
    return completedCount / habits.length;
  };

  if (habits.length === 0) return null;

  return (
    <div className="bg-[#111] p-6 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tighter">Anillo de Triunfo</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Intensidad global de hábitos activos</p>
        </div>
        <div className="flex gap-1">
           {[0.2, 0.4, 0.6, 0.8, 1].map(v => (
             <div key={v} className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#afff00', opacity: v }} />
           ))}
        </div>
      </div>

      <div className="inline-block min-w-max">
        <div className="grid grid-cols-[30px_repeat(12,1fr)] gap-2 mb-2">
          <div />
          {MONTHS.map(m => (
            <div key={m} className="text-[9px] font-black text-gray-600 text-center uppercase tracking-tighter w-4 md:w-6">
              {m}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[30px_repeat(12,1fr)] gap-2">
          <div className="flex flex-col gap-1.5">
            {[1, 10, 20, 31].map(d => (
              <div key={d} className="h-4 flex items-center justify-end pr-2 text-[8px] font-mono text-gray-700">
                {d.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {Array.from({ length: 12 }).map((_, m) => (
            <div key={m} className="flex flex-col gap-1.5">
              {Array.from({ length: 31 }).map((_, d) => {
                const date = matrix[d][m];
                const intensity = getGlobalIntensity(date);
                if (!date) return <div key={d} className="w-4 h-4 md:w-6 md:h-6" />;
                
                return (
                  <div 
                    key={d}
                    className="w-4 h-4 md:w-6 md:h-6 rounded-[2px] transition-all"
                    style={{ 
                      backgroundColor: intensity > 0 ? '#afff00' : 'rgba(255,255,255,0.02)',
                      opacity: intensity > 0 ? intensity : 1,
                      boxShadow: intensity > 0.7 ? '0 0 10px rgba(175, 255, 0, 0.3)' : 'none',
                      border: intensity === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}
                    title={`${date.toLocaleDateString()}: ${(intensity * 100).toFixed(0)}% cumplido`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
