
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, title, message, confirmLabel, onConfirm, onCancel, variant = 'warning' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#141414] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${variant === 'danger' ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-orange-500/20 text-orange-500 border-orange-500/20'} border shadow-inner`}>
            <AlertTriangle size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-white">{title}</h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">{message}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            <button 
              onClick={onConfirm}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg ${variant === 'danger' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-white text-black'}`}
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-5 rounded-2xl bg-white/5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 border border-white/5"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
