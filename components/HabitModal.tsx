import React, { useState } from 'react';
import { X, Check, Smile, Gift, Calendar } from 'lucide-react';
import { NEON_COLORS } from '../types';

interface HabitModalProps {
  onClose: () => void;
  onSave: (name: string, color: string, freq: number, target: number, reward: string, emoji: string) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(NEON_COLORS.LIME);
  const [freq, setFreq] = useState(7);
  const [target, setTarget] = useState(10);
  const [reward, setReward] = useState('');
  const [emoji, setEmoji] = useState('🔥');

  const COMMON_EMOJIS = ['🔥', '⭐', '🏆', '🍔', '🍺', '🎮', '🎬', '🛌', '🏔️', '🍫'];

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tighter">Nuevo Hábito</h2>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 active:scale-90 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <section>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">¿Qué vas a mejorar?</label>
            <input 
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Yoga al despertar"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-gray-700 focus:outline-none focus:border-lime-500/50 font-bold text-lg"
            />
          </section>

          <section>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Color de Energía</label>
            <div className="flex justify-between">
              {Object.values(NEON_COLORS).map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-4 ring-white ring-offset-4 ring-offset-[#141414] scale-110 shadow-lg' : 'opacity-40 active:scale-90'}`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={20} className="text-black" strokeWidth={4} />}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Frecuencia</label>
              <select 
                value={freq}
                onChange={e => setFreq(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold focus:outline-none"
              >
                {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} días/sem</option>)}
              </select>
            </section>
            <section>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Hito cada...</label>
              <div className="relative">
                <input 
                  type="number"
                  value={target}
                  onChange={e => setTarget(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold focus:outline-none pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-[10px] uppercase">Días</span>
              </div>
            </section>
          </div>

          <section>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Smile size={16} /> Icono de Hito
            </label>
            <div className="flex flex-wrap gap-3">
              {COMMON_EMOJIS.map(e => (
                <button 
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all ${emoji === e ? 'bg-white/20 ring-2 ring-white shadow-xl scale-110' : 'bg-white/5 active:scale-90'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Gift size={16} /> Primer Premio
            </label>
            <input 
              value={reward}
              onChange={e => setReward(e.target.value)}
              placeholder="Ej: Tarde de cine..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-gray-700 focus:outline-none font-bold italic"
            />
          </section>
        </div>

        <div className="p-8 bg-[#1a1a1a] border-t border-white/5">
          <button 
            disabled={!name}
            onClick={() => onSave(name, color, freq, target, reward, emoji)}
            className="w-full py-6 rounded-[1.5rem] bg-lime-500 text-black font-black uppercase tracking-[0.2em] text-sm active:scale-95 transition-all disabled:opacity-30 shadow-2xl shadow-lime-500/20"
          >
            Empezar Hábito
          </button>
        </div>
      </div>
    </div>
  );
};
