
import React, { useRef } from 'react';
import { Diamond, Download, Info } from 'lucide-react';
import { Habit, MONTHS, DayStatus } from '../types';
import { getMonthDayMatrix, getDayKey } from '../utils';
import { differenceInDays, startOfDay, isAfter, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';

interface HabitGridProps {
  habit: Habit;
  onUpdateDay: (date: Date, status: DayStatus) => void;
  mini?: boolean;
}

interface DayCellProps {
  date: Date | null;
  status: DayStatus;
  isMilestone: boolean;
  milestoneEmoji?: string;
  color: string;
  onClick?: (e: React.MouseEvent) => void;
  mini?: boolean;
  habitCreatedAt?: string;
}

const DayCell: React.FC<DayCellProps> = ({ date, status, isMilestone, milestoneEmoji, color, onClick, mini, habitCreatedAt }) => {
  if (!date) return <div className={mini ? "w-2 h-2" : "w-4 h-4 md:w-5 md:h-5"} />;

  let content = null;
  let bgClass = "";
  let borderClass = mini ? "" : "border border-white/10 hover:border-white/30";
  let style: React.CSSProperties = {};

  // Lógica de fallo automático (visual) mejorada
  const today = startOfDay(new Date());
  const diff = differenceInDays(today, startOfDay(date));
  
  // Solo marcamos como fallido si es un día pasado, han pasado +5 días y EL HÁBITO YA EXISTÍA
  const createdAtDate = habitCreatedAt ? startOfDay(parseISO(habitCreatedAt)) : null;
  const isAutoFailed = status === 'none' && 
                       diff >= 5 && 
                       createdAtDate && 
                       (isAfter(date, createdAtDate) || getDayKey(date) === getDayKey(createdAtDate));

  if (status === 'completed') {
    bgClass = "shadow-lg";
    style = { 
      backgroundColor: color, 
      boxShadow: mini ? 'none' : `0 0 12px ${color}44`,
    };
  } else if (status === 'break') {
    borderClass = mini ? "" : "border-2 border-dashed border-white/20";
    bgClass = "bg-white/5";
  } else if (status === 'failed' || isAutoFailed) {
    bgClass = "bg-red-500/40";
    borderClass = mini ? "" : "border border-red-500/50";
  } else {
    bgClass = "bg-white/[0.02]";
  }

  if (isMilestone && !mini) {
    content = <span className="text-[10px] drop-shadow-md">{milestoneEmoji || '💎'}</span>;
  }

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`${mini ? "w-2 h-2 rounded-[1px]" : "w-4 h-4 md:w-5 md:h-5 rounded-sm"} transition-all flex items-center justify-center shrink-0 cursor-pointer ${bgClass} ${borderClass}`}
      style={style}
      title={`${date.toLocaleDateString()}: ${isAutoFailed ? 'Fallido (Inactividad)' : status}`}
    >
      {content}
    </button>
  );
};

export const HabitGrid: React.FC<HabitGridProps> = ({ habit, onUpdateDay, mini }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const matrix = getMonthDayMatrix(new Date().getFullYear());

  const handleExport = async () => {
    if (gridRef.current) {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#0d0d0d',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `${habit.name}-año-en-pixeles.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const getDayData = (date: Date | null) => {
    if (!date) return { status: 'none' as DayStatus, isMilestone: false, emoji: '' };
    const key = getDayKey(date);
    const milestone = habit.milestones.find(m => m.date === key);
    return {
      status: habit.history[key] || 'none',
      isMilestone: !!milestone,
      emoji: milestone?.emoji
    };
  };

  if (mini) {
    return (
      <div className="bg-[#111] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
          <span className="text-xs font-bold truncate">{habit.name}</span>
        </div>
        <div className="flex gap-[2px]">
          {Array.from({ length: 12 }).map((_, m) => (
            <div key={m} className="flex flex-col gap-[2px]">
              {Array.from({ length: 31 }).map((_, d) => {
                const date = matrix[d][m];
                const data = getDayData(date);
                return <DayCell key={d} date={date} status={data.status} isMilestone={data.isMilestone} color={habit.color} mini habitCreatedAt={habit.createdAt} />;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter" style={{ color: habit.color }}>
            {habit.name}
          </h2>
          <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
            <Info size={14} /> Cuadrícula Anual 12x31 • Hito: cada {habit.cumulativeTarget} d
          </p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all border border-white/5 active:scale-95"
        >
          <Download size={18} /> Exportar Rejilla
        </button>
      </div>

      <div className="overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div ref={gridRef} className="inline-block p-6 bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="grid grid-cols-[30px_repeat(12,1fr)] gap-2 mb-4">
            <div />
            {MONTHS.map(m => (
              <div key={m} className="text-[10px] font-black text-gray-500 text-center uppercase tracking-tighter">
                {m}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[30px_repeat(12,1fr)] gap-2">
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className="h-4 flex items-center justify-end pr-2 text-[9px] font-mono text-gray-600">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {Array.from({ length: 12 }).map((_, m) => (
              <div key={m} className="flex flex-col gap-1.5">
                {Array.from({ length: 31 }).map((_, d) => {
                  const date = matrix[d][m];
                  const data = getDayData(date);
                  
                  return (
                    <DayCell 
                      key={`${m}-${d}`}
                      date={date}
                      status={data.status}
                      isMilestone={data.isMilestone}
                      milestoneEmoji={data.emoji}
                      color={habit.color}
                      habitCreatedAt={habit.createdAt}
                      onClick={() => {
                        if (date) {
                          const cycle: DayStatus[] = ['none', 'completed', 'failed', 'break'];
                          const next = cycle[(cycle.indexOf(data.status) + 1) % cycle.length];
                          onUpdateDay(date, next);
                        }
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border border-white/10" /><span>Pendiente</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: habit.color }} /><span>Logrado</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-dashed border-white/20" /><span>Descanso</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border border-red-500/50 bg-red-500/20" /><span>Fallido</span></div>
      </div>
    </div>
  );
};
