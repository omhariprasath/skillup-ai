import React from 'react';
import { Compass, Mic, Award, BarChart3, BookOpen, Sparkles } from 'lucide-react';

export type ActiveScreen = 'dashboard' | 'practice' | 'scenarios' | 'evaluation' | 'analytics';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  isRecording: boolean;
  activeScenarioTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  isRecording,
  activeScenarioTitle,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Compass },
    { id: 'practice', label: 'Simulation HUD', icon: Mic, badge: isRecording ? 'LIVE' : undefined },
    { id: 'scenarios', label: 'Scenarios', icon: BookOpen },
    { id: 'evaluation', label: 'Evaluation Report', icon: Award },
    { id: 'analytics', label: 'Trajectory', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8f9ff]/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-[#0b1c30]">SkillUp AI</span>
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Behavioral Coach
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Bridging Academic Rigor & Workplace Success</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as ActiveScreen)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-white text-[#3525cd] shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#3525cd]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5">
            {activeScreen !== 'practice' && (
              <button
                onClick={() => onNavigate('practice')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#3525cd] hover:bg-[#2b1da7] text-white shadow-xs transition-transform active:scale-[0.99]"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Launch Practice</span>
              </button>
            )}

            {/* Mobile menu pill bar button */}
            <div className="flex md:hidden">
              <button
                onClick={() => onNavigate(activeScreen === 'practice' ? 'dashboard' : 'practice')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700"
              >
                {activeScreen === 'practice' ? 'Dashboard' : 'Simulate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
