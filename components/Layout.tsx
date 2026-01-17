
import React from 'react';
import { Activity, LayoutGrid, Trophy, Layers, Plus, Grid2X2, CheckCircle2 } from 'lucide-react';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddHabit: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onAddHabit }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0d0d0d] text-gray-100">
      {/* Sidebar - Desktop (FIXED) */}
      <nav className="hidden md:flex flex-col w-24 bg-[#141414] border-r border-white/5 items-center py-8 gap-8 z-50 shrink-0">
        <div className="text-lime-400 mb-4 animate-pulse">
          <Activity size={36} strokeWidth={2.5} />
        </div>
        
        <NavItem 
          icon={<CheckCircle2 size={24} />} 
          active={activeView === 'daily_objectives'} 
          onClick={() => onViewChange('daily_objectives')} 
          label="Metas"
        />
        <NavItem 
          icon={<Grid2X2 size={24} />} 
          active={activeView === 'overview'} 
          onClick={() => onViewChange('overview')} 
          label="Órbita"
        />
        <NavItem 
          icon={<LayoutGrid size={24} />} 
          active={activeView === 'individual'} 
          onClick={() => onViewChange('individual')} 
          label="Control"
        />
        <NavItem 
          icon={<Layers size={24} />} 
          active={activeView === 'group'} 
          onClick={() => onViewChange('group')} 
          label="Líneas"
        />
        <NavItem 
          icon={<Trophy size={24} />} 
          active={activeView === 'trophies'} 
          onClick={() => onViewChange('trophies')} 
          label="Logros"
        />

        <div className="mt-auto">
          <button 
            onClick={onAddHabit}
            className="w-14 h-14 rounded-full bg-lime-500 text-black flex items-center justify-center hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 active:scale-90"
          >
            <Plus size={28} />
          </button>
        </div>
      </nav>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        <div className="max-w-5xl mx-auto p-6 md:p-12 pb-32 md:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav (FIXED) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#141414]/90 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)] h-[calc(70px+env(safe-area-inset-bottom))] grid grid-cols-5 items-center px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <MobileNavItem icon={<CheckCircle2 size={24} />} active={activeView === 'daily_objectives'} onClick={() => onViewChange('daily_objectives')} label="Metas" />
        <MobileNavItem icon={<Grid2X2 size={24} />} active={activeView === 'overview'} onClick={() => onViewChange('overview')} label="Órbita" />
        
        <div className="flex justify-center items-center">
          <button 
             onClick={onAddHabit}
             className="w-16 h-16 -mt-10 rounded-full bg-lime-500 text-black flex items-center justify-center shadow-2xl shadow-lime-500/40 border-4 border-[#0d0d0d] active:scale-75 transition-transform"
          >
            <Plus size={32} />
          </button>
        </div>

        <MobileNavItem icon={<Layers size={24} />} active={activeView === 'group'} onClick={() => onViewChange('group')} label="Líneas" />
        <MobileNavItem icon={<Trophy size={24} />} active={activeView === 'trophies'} onClick={() => onViewChange('trophies')} label="Logros" />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`group relative flex flex-col items-center gap-1.5 transition-all ${active ? 'text-lime-400' : 'text-gray-500 hover:text-gray-300'}`}
  >
    <div className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-lime-400/10 shadow-[0_0_20px_rgba(163,230,53,0.1)]' : 'group-hover:bg-white/5'}`}>
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    {active && <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-lime-400 rounded-r-full shadow-[0_0_15px_#afff00]" />}
  </button>
);

const MobileNavItem = ({ icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-lime-400' : 'text-gray-600'}`}
  >
    {icon}
    <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);
