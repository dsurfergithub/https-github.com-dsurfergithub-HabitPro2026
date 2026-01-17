import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from './components/Layout';
import { HabitGrid } from './components/HabitGrid';
import { HabitTimeline } from './components/HabitTimeline';
import { TrophyCabinet } from './components/TrophyCabinet';
import { HabitModal } from './components/HabitModal';
import { DailyObjectives } from './components/DailyObjectives';
import { UnifiedHeatmap } from './components/UnifiedHeatmap';
import { MilestoneCelebration } from './components/MilestoneCelebration';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Habit, ViewMode, DayStatus, DailyObjectiveRecord, Milestone } from './types';
import { getDayKey } from './utils';
import { Download, Upload, Trash2, PlusCircle, Archive, RotateCcw, ChevronDown, ChevronUp, ChevronLeft, ArrowUpRight } from 'lucide-react';

const INITIAL_HABITS: Habit[] = [];

const createEmptyDailyRecord = (date: string): DailyObjectiveRecord => ({
  date,
  status: 'pending',
  tasks: Array.from({ length: 7 }, (_, i) => ({
    id: (i + 1).toString(),
    text: '',
    completed: false
  }))
});

export default function App() {
  const [view, setView] = useState<ViewMode>(() => {
    return (localStorage.getItem('habit-orbit-last-view') as ViewMode) || 'daily_objectives';
  });
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habit-orbit-data');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [dailyHistory, setDailyHistory] = useState<DailyObjectiveRecord[]>(() => {
    const savedHistory = localStorage.getItem('habit-orbit-daily-history');
    let history: DailyObjectiveRecord[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    // Recuperación de día anterior en carga inicial
    const lastDailyStr = localStorage.getItem('habit-orbit-current-daily');
    if (lastDailyStr) {
      const lastDaily: DailyObjectiveRecord = JSON.parse(lastDailyStr);
      const today = getDayKey(new Date());
      if (lastDaily.date !== today) {
        const hasContent = lastDaily.tasks.some(t => t.text !== '');
        if (hasContent && !history.some(r => r.date === lastDaily.date)) {
          const allCompleted = lastDaily.tasks.every(t => t.completed || t.text === '');
          lastDaily.status = allCompleted ? 'checked' : 'failed';
          history = [lastDaily, ...history].slice(0, 100);
          localStorage.setItem('habit-orbit-daily-history', JSON.stringify(history));
        }
      }
    }
    return history;
  });

  const [currentDaily, setCurrentDaily] = useState<DailyObjectiveRecord>(() => {
    const today = getDayKey(new Date());
    const saved = localStorage.getItem('habit-orbit-current-daily');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        if (parsed.tasks.length < 7) {
            const extra = Array.from({ length: 7 - parsed.tasks.length }, (_, i) => ({
                id: (parsed.tasks.length + i + 1).toString(), text: '', completed: false
            }));
            return { ...parsed, tasks: [...parsed.tasks, ...extra] };
        }
        return parsed;
      }
    }
    return createEmptyDailyRecord(today);
  });

  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [activeCelebration, setActiveCelebration] = useState<{habit: Habit, milestone: Milestone} | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean; title: string; message: string; confirmLabel: string;
    onConfirm: () => void; variant: 'danger' | 'warning';
  }>({ isOpen: false, title: '', message: '', confirmLabel: '', onConfirm: () => {}, variant: 'warning' });

  const activeHabits = habits.filter(h => !h.isArchived);
  const archivedHabits = habits.filter(h => h.isArchived);

  const orbitStatus = useMemo(() => {
    if (habits.length === 0) return { label: 'Iniciando Viaje', color: 'text-gray-500', speed: 'animate-none' };
    const today = getDayKey(new Date());
    const completedToday = habits.filter(h => h.history[today] === 'completed').length;
    const ratio = completedToday / habits.length;
    if (ratio >= 0.8) return { label: 'Órbita Estable', color: 'text-lime-400', speed: 'animate-pulse' };
    if (ratio >= 0.4) return { label: 'En Trayectoria', color: 'text-cyan-400', speed: 'animate-[pulse_3s_infinite]' };
    return { label: 'Retomar Impulso', color: 'text-orange-400', speed: 'animate-[pulse_5s_infinite]' };
  }, [habits, currentDaily]);

  useEffect(() => { localStorage.setItem('habit-orbit-data', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('habit-orbit-daily-history', JSON.stringify(dailyHistory)); }, [dailyHistory]);
  useEffect(() => { localStorage.setItem('habit-orbit-current-daily', JSON.stringify(currentDaily)); }, [currentDaily]);
  useEffect(() => { localStorage.setItem('habit-orbit-last-view', view); }, [view]);

  useEffect(() => {
    const checkDayChange = () => {
      const today = getDayKey(new Date());
      if (currentDaily.date !== today) {
        const oldRecord = { ...currentDaily };
        const hasContent = oldRecord.tasks.some(t => t.text !== '');
        if (hasContent) {
          const allCompleted = oldRecord.tasks.every(t => t.completed || t.text === '');
          oldRecord.status = allCompleted ? 'checked' : 'failed';
          setDailyHistory(prev => {
            if (prev.some(r => r.date === oldRecord.date)) return prev;
            return [oldRecord, ...prev].slice(0, 100);
          });
        }
        setCurrentDaily(createEmptyDailyRecord(today));
      }
    };
    const timer = setInterval(checkDayChange, 30000);
    return () => clearInterval(timer);
  }, [currentDaily]);

  const updateDayStatus = useCallback((habitId: string, date: Date, status: DayStatus) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const newHistory = { ...h.history };
      const key = getDayKey(date);
      if (status === 'none') delete newHistory[key];
      else newHistory[key] = status;
      const completedCount = Object.values(newHistory).filter(s => s === 'completed').length;
      const target = h.cumulativeTarget || 10;
      let newMilestones = [...h.milestones];
      if (status === 'completed' && completedCount > 0 && completedCount % target === 0) {
        const milestoneId = `auto-${completedCount}-${Date.now()}`;
        if (!newMilestones.some(m => m.id.startsWith(`auto-${completedCount}-`))) {
          const newMilestone: Milestone = {
            id: milestoneId, dayIndex: completedCount, label: `${completedCount} Logros`,
            date: key, emoji: h.emojiTemplate, reward: h.rewardTemplate, isAutoGenerated: true
          };
          newMilestones.push(newMilestone);
          setActiveCelebration({ habit: { ...h, history: newHistory, milestones: newMilestones }, milestone: newMilestone });
        }
      }
      return { ...h, history: newHistory, milestones: newMilestones };
    }));
  }, []);

  const handleArchive = (id: string) => {
    setConfirmConfig({
      isOpen: true, 
      title: '¿Archivar Hábito?', 
      message: 'Se ocultará de tus metas diarias pero se mantendrá en tu historial global.',
      confirmLabel: 'Archivar', 
      variant: 'warning',
      onConfirm: () => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, isArchived: true } : h));
        setConfirmConfig(p => ({ ...p, isOpen: false }));
      }
    });
  };

  const handleResetAll = () => {
    setConfirmConfig({
      isOpen: true, 
      title: 'REESTABLECER APP', 
      message: 'Esta acción borrará todos tus datos locales de forma definitiva. La aplicación se reiniciará por completo.',
      confirmLabel: 'CONFIRMAR REINICIO', 
      variant: 'danger',
      onConfirm: () => {
        localStorage.clear();
        window.location.href = window.location.origin;
      }
    });
  };

  const exportData = () => {
    try {
      const data = { habits, dailyHistory, currentDaily, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HabitOrbit_FullBackup_${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) { alert("Error al exportar."); }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.habits) {
          setHabits(data.habits);
          if (data.dailyHistory) setDailyHistory(data.dailyHistory);
          if (data.currentDaily) setCurrentDaily(data.currentDaily);
          alert('Copia de seguridad restaurada.');
        }
      } catch (err) { alert('Archivo no válido.'); }
    };
    reader.readAsText(file);
  };

  const selectedHabit = activeHabits.find(h => h.id === selectedHabitId) || activeHabits[0];

  return (
    <Layout activeView={view} onViewChange={setView} onAddHabit={() => setShowModal(true)}>
      <ConfirmationModal 
        isOpen={confirmConfig.isOpen} title={confirmConfig.title} message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel} onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(p => ({ ...p, isOpen: false }))} variant={confirmConfig.variant}
      />

      {activeCelebration && (
        <MilestoneCelebration 
          habit={activeCelebration.habit} milestone={activeCelebration.milestone}
          onComplete={(reward, emoji, target) => {
            setHabits(prev => prev.map(h => h.id === activeCelebration.habit.id ? { ...h, rewardTemplate: reward, emojiTemplate: emoji, cumulativeTarget: target } : h));
            setActiveCelebration(null);
          }}
        />
      )}

      {view === 'daily_objectives' && (
        <DailyObjectives 
          currentRecord={currentDaily} history={dailyHistory}
          onToggleTask={(id) => setCurrentDaily(p => ({...p, tasks: p.tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t)}))}
          onSetTaskText={(id, txt) => setCurrentDaily(p => ({...p, tasks: p.tasks.map(t => t.id === id ? {...t, text: txt} : t)}))}
        />
      )}

      {view === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-4xl font-black tracking-tighter text-white">Mi Camino</h2>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${orbitStatus.speed}`}>
                   <div className={`w-2 h-2 rounded-full ${orbitStatus.color.replace('text-', 'bg-')}`} />
                   <span className={`text-[10px] font-black uppercase tracking-widest ${orbitStatus.color}`}>{orbitStatus.label}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-semibold">Análisis global de disciplina.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportData} title="Exportar Backup" className="p-4 bg-white/5 rounded-2xl text-gray-400 border border-white/5 active:scale-90 hover:bg-white/10 transition-all shadow-lg flex items-center justify-center"><Download size={24} /></button>
              <label title="Importar Backup" className="p-4 bg-white/5 rounded-2xl text-gray-400 border border-white/5 cursor-pointer active:scale-90 hover:bg-white/10 transition-all shadow-lg flex items-center justify-center"><Upload size={24} /><input type="file" className="hidden" accept=".json" onChange={importData} /></label>
              <button onClick={handleResetAll} title="Reiniciar Aplicación" className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 active:scale-90 hover:bg-red-500/20 transition-all shadow-lg flex items-center justify-center"><RotateCcw size={24} /></button>
            </div>
          </div>
          <UnifiedHeatmap habits={habits} />
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 px-2">Hábitos Activos</h3>
            {activeHabits.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01] flex flex-col items-center gap-4">
                <PlusCircle size={48} className="text-gray-800" /><p className="text-gray-600 font-bold italic">Nada por aquí aún.</p>
                <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-lime-500 text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-lime-500/20 active:scale-95">Crear Hábito</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-12">
                {activeHabits.map(h => (
                  <div key={h.id} className="relative group">
                    <HabitGrid habit={h} onUpdateDay={(date, status) => updateDayStatus(h.id, date, status)} />
                    <div className="absolute bottom-16 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <button onClick={() => { setSelectedHabitId(h.id); setView('individual'); }} className="px-6 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-110 active:scale-95 transition-all">Gestionar <ArrowUpRight size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {archivedHabits.length > 0 && (
            <div className="pt-10 border-t border-white/5">
              <button onClick={() => setShowArchived(!showArchived)} className="w-full py-6 flex items-center justify-between px-6 bg-white/[0.02] rounded-[1.5rem] text-gray-500 hover:text-gray-300 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3"><Archive size={18} /><span className="text-xs font-black uppercase tracking-widest">Archivados ({archivedHabits.length})</span></div>
                {showArchived ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showArchived && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pb-10">
                  {archivedHabits.map(h => (
                    <div key={h.id} className="bg-[#141414] border border-white/5 p-6 rounded-3xl flex items-center justify-between group">
                      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-2xl opacity-50 grayscale">{h.emojiTemplate || '⭐'}</div><span className="text-sm font-bold text-gray-300">{h.name}</span></div>
                      <div className="flex gap-2"><button onClick={() => setHabits(prev => prev.map(item => item.id === h.id ? {...item, isArchived: false} : item))} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-lime-400 border border-white/5 active:scale-90"><RotateCcw size={18} /></button><button onClick={() => setHabits(prev => prev.filter(item => item.id !== h.id))} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 active:scale-90"><Trash2 size={18} /></button></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {view === 'individual' && (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
          <div className="flex items-center gap-4 px-2"><button onClick={() => setView('overview')} className="p-3 bg-white/5 rounded-2xl text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center active:scale-90"><ChevronLeft size={24} /></button><h2 className="text-4xl font-black tracking-tighter text-white">Detalle</h2></div>
          {activeHabits.length > 0 && (
            <>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">{activeHabits.map(h => (<button key={h.id} onClick={() => setSelectedHabitId(h.id)} className={`px-8 py-5 rounded-[1.8rem] text-xs font-black uppercase tracking-widest border transition-all shrink-0 ${ (selectedHabitId || activeHabits[0].id) === h.id ? 'bg-white/10 border-white/20 shadow-2xl scale-105' : 'bg-transparent border-transparent text-gray-600' }`} style={{ color: (selectedHabitId || activeHabits[0].id) === h.id ? h.color : undefined }}>{h.name}</button>))}</div>
              {selectedHabit && (<div className="space-y-6"><div className="flex justify-end gap-3 px-2"><button onClick={() => handleArchive(selectedHabit.id)} className="px-5 py-3 bg-white/5 text-gray-400 rounded-2xl text-[10px] font-black uppercase border border-white/5 active:scale-95 flex items-center gap-2 hover:bg-white/10 transition-colors"><Archive size={14} /> Archivar</button><button onClick={() => setConfirmConfig({ isOpen: true, title: 'ELIMINAR', message: '¿Seguro que quieres borrar este hábito? Se perderán todos sus hitos.', confirmLabel: 'Borrar', variant: 'danger', onConfirm: () => { setHabits(p => p.filter(it => it.id !== selectedHabit.id)); setConfirmConfig(c => ({...c, isOpen: false})); }})} className="px-5 py-3 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase border border-red-500/20 active:scale-95 flex items-center gap-2 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /> Eliminar</button></div><HabitGrid habit={selectedHabit} onUpdateDay={(date, status) => updateDayStatus(selectedHabit.id, date, status)} /></div>)}
            </>
          )}
        </div>
      )}
      {view === 'group' && <HabitTimeline habits={activeHabits} />}
      {view === 'trophies' && <TrophyCabinet habits={habits} />}
      {showModal && (<HabitModal onClose={() => setShowModal(false)} onSave={(name, color, freq, target, reward, emoji) => { const newHabit: Habit = { id: Math.random().toString(36).substr(2, 9), name, color, frequency: freq, history: {}, milestones: [], cumulativeTarget: target, rewardTemplate: reward, emojiTemplate: emoji, createdAt: new Date().toISOString() }; setHabits(prev => [...prev, newHabit]); setSelectedHabitId(newHabit.id); setShowModal(false); }} />)}
    </Layout>
  );
}