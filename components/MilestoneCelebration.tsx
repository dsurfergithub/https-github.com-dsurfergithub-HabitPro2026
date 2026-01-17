
import React, { useState } from 'react';
import { Habit, Milestone } from '../types';
import { Gift, Sparkles, ArrowRight, Calendar } from 'lucide-react';

interface MilestoneCelebrationProps {
  habit: Habit;
  milestone: Milestone;
  onComplete: (nextReward: string, nextEmoji: string, nextTargetDays: number) => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ habit, milestone, onComplete }) => {
  const [nextReward, setNextReward] = useState('');
  const [nextEmoji, setNextEmoji] = useState('⭐');
  const [nextTargetDays, setNextTargetDays] = useState(habit.cumulativeTarget || 10);
  const [step, setStep] = useState<'award' | 'next'>('award');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-500 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i}
            className="absolute animate-bounce"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.4
            }}
          >
            {milestone.emoji || '✨'}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg p-6 md:p-10 text-center space-y-8 animate-in zoom-in duration-300 bg-[#141414] border border-white/10 rounded-[3rem] shadow-2xl">
        {step === 'award' ? (
          <>
            <div className="relative inline-block">
               <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-white/5 rounded-full flex items-center justify-center text-7xl md:text-8xl shadow-2xl border border-white/10 animate-pulse">
                {milestone.emoji || '🏆'}
              </div>
              <div className="absolute -top-2 -right-2 bg-lime-500 text-black p-3 rounded-full shadow-lg">
                <Sparkles size={28} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">¡CONSEGUIDO!</h2>
              <p className="text-gray-400 text-lg uppercase font-bold tracking-widest" style={{ color: habit.color }}>
                {habit.name}
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-inner">
               <p className="text-xs text-gray-500 uppercase font-black mb-3 flex items-center justify-center gap-2 tracking-[0.2em]">
                 <Gift size={16} className="text-lime-500" /> Premio Desbloqueado
               </p>
               <h3 className="text-2xl md:text-3xl font-bold text-white italic leading-tight">"{milestone.reward || '¡Increíble disciplina!'}"</h3>
            </div>

            <button 
              onClick={() => setStep('next')}
              className="w-full py-6 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-tighter text-xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              Recoger y Continuar <ArrowRight size={24} />
            </button>
          </>
        ) : (
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-black tracking-tighter text-white text-center">Siguiente Desafío</h2>
            <p className="text-gray-400 text-sm text-center font-medium">Define tu próxima meta y la recompensa que te motivará.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">¿En cuántos días quieres el próximo premio?</label>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <Calendar className="text-lime-500" size={24} />
                  <input 
                    type="number"
                    min="1"
                    value={nextTargetDays}
                    onChange={e => setNextTargetDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-transparent border-none text-2xl font-black text-white focus:ring-0 w-full"
                  />
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Días</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Nueva Recompensa</label>
                <input 
                  autoFocus
                  value={nextReward}
                  onChange={e => setNextReward(e.target.value)}
                  placeholder="Ej: Viaje de fin de semana..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-lime-500 text-lg font-bold"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Elige un Icono</label>
                <div className="flex flex-wrap gap-3">
                  {['⭐', '🏆', '🍕', '🎮', '🍺', '🍫', '🛌'].map(e => (
                    <button 
                      key={e}
                      onClick={() => setNextEmoji(e)}
                      className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center transition-all ${nextEmoji === e ? 'bg-white/20 ring-2 ring-white scale-110 shadow-lg' : 'bg-white/5 active:scale-90'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              disabled={!nextReward}
              onClick={() => onComplete(nextReward, nextEmoji, nextTargetDays)}
              className="w-full py-5 rounded-2xl bg-lime-500 text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-lime-400 active:scale-95 transition-all disabled:opacity-50 mt-4 shadow-xl shadow-lime-500/20"
            >
              Fijar Nueva Meta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
