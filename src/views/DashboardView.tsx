import React from 'react';
import { Scenario, HistoricSession } from '../types';
import { 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Award, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Target,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface DashboardViewProps {
  scenarios: Scenario[];
  history: HistoricSession[];
  onStartScenario: (scenario: Scenario) => void;
  onNavigate: (screen: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scenarios,
  history,
  onStartScenario,
  onNavigate,
}) => {
  const featuredScenario = scenarios[1]; // Marcus Chen executive briefing

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Executive Readiness Banner */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-50/70 to-purple-50/40 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#3525cd]">
              <ShieldCheck className="w-4 h-4" />
              <span>Behavioral & Executive Trajectory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
              Master high-stakes academic defenses and executive boardroom briefings.
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              SkillUp AI analyzes verbal hygiene, rhetorical structure, and emotional composure in real-time. Turn academic precision into executive conviction.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Flame className="w-4 h-4 text-amber-500" />
                <span><strong className="text-slate-900 font-semibold">6-Day</strong> Practice Streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Next Milestone: <strong className="text-slate-900 font-semibold">Pyramid Principle Mastery</strong></span>
              </div>
            </div>
          </div>

          {/* Readiness Score Ring Card */}
          <div className="flex flex-col items-center justify-center bg-[#f8f9ff] p-5 rounded-2xl border border-indigo-100 min-w-[220px] shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Workplace Readiness
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-[#3525cd] tabular-nums">86</span>
              <span className="text-lg font-semibold text-slate-400">/100</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8 pts past 14 days</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#4f46e5] h-full rounded-full w-[86%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fast-Track Practice Card */}
      {featuredScenario && (
        <section className="bg-gradient-to-r from-slate-900 to-[#1e1b4b] rounded-3xl p-6 sm:p-7 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-indigo-200 mb-3 backdrop-blur-xs">
                <span>Recommended 4-Minute Challenge</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                {featuredScenario.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {featuredScenario.subtitle}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  {featuredScenario.estimatedMinutes} min drill
                </span>
                <span>·</span>
                <span>Interlocutor: {featuredScenario.personaName} ({featuredScenario.personaRole})</span>
              </div>
            </div>

            <button
              onClick={() => onStartScenario(featuredScenario)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md transition-all active:scale-[0.98] shrink-0"
            >
              <span>Begin Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Dual Tracks: Academic Rigor vs Executive Workplace */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Curated Practice Tracks</h3>
            <p className="text-xs text-slate-500">Bridging empirical thesis defenses with C-suite stakeholder briefings</p>
          </div>
          <button
            onClick={() => onNavigate('scenarios')}
            className="text-xs font-medium text-[#3525cd] hover:underline flex items-center gap-1"
          >
            <span>View all 5 scenarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scenarios.slice(0, 3).map(scenario => {
            const isAcademic = scenario.category === 'academic';

            return (
              <div
                key={scenario.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      {isAcademic ? (
                        <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      <span className="capitalize">{scenario.category}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#3525cd] transition-colors">
                    {scenario.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <img
                      src={scenario.personaAvatar}
                      alt={scenario.personaName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-[11px] truncate">
                      <span className="font-medium text-slate-800 block truncate">{scenario.personaName}</span>
                      <span className="text-slate-400 block truncate">{scenario.personaRole}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{scenario.estimatedMinutes} mins</span>
                  <button
                    onClick={() => onStartScenario(scenario)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#3525cd] hover:text-indigo-800"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Telemetry & Practice Log */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Session Telemetry</h3>
            <p className="text-xs text-slate-500">Historical performance across rhetorical and acoustic metrics</p>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Full Analytics →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {history.map(item => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.scenarioTitle}</span>
                  <span className="text-[10px] text-slate-400">· {item.date}</span>
                </div>
                <p className="text-slate-500 text-[11px] max-w-xl">{item.topFeedback}</p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Pace</div>
                  <div className="font-semibold text-slate-700 tabular-nums">{item.wpm} WPM</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Fillers</div>
                  <div className="font-semibold text-slate-700 tabular-nums">{item.fillerCount}</div>
                </div>
                <div className="text-right pl-2 border-l border-slate-200">
                  <div className="text-[10px] text-slate-400">Score</div>
                  <div className="font-bold text-[#3525cd] text-sm tabular-nums">{item.readinessScore}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
