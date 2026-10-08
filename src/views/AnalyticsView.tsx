import React from 'react';
import { HistoricSession } from '../types';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Award, 
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';

interface AnalyticsViewProps {
  history: HistoricSession[];
  onReviewSession: (session: HistoricSession) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history,
  onReviewSession,
}) => {
  // Aggregate stats
  const totalSessions = history.length;
  const avgReadiness = Math.round(
    history.reduce((acc, curr) => acc + curr.readinessScore, 0) / (totalSessions || 1)
  );
  const avgWpm = Math.round(
    history.reduce((acc, curr) => acc + curr.wpm, 0) / (totalSessions || 1)
  );
  const totalFillers = history.reduce((acc, curr) => acc + curr.fillerCount, 0);

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#3525cd]">
            <BarChart3 className="w-4 h-4" />
            <span>Longitudinal Trajectory & Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Behavioral Progress & Verbal Habit Calibration
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Monitor real-time cadence adjustments, filler decay trajectories, and executive composure across academic and workplace simulations.
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "skillup_ai_telemetry.json");
            dlAnchorElem.click();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-transform active:scale-[0.99] shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Telemetry Data</span>
        </button>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Average Readiness</span>
            <Award className="w-4 h-4 text-[#3525cd]" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {avgReadiness}%
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% trajectory improvement</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Average Cadence</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {avgWpm} <span className="text-sm font-normal text-slate-400">WPM</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Optimal executive corridor: 135–160
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Filler Word Decay</span>
            <TrendingDown className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            -64%
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Down from 8.2 to 2.4 / session</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Completed Drills</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalSessions}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Across 4 specialized competencies
          </div>
        </div>
      </div>

      {/* Visual Analytics Comparison: Filler Word Reduction Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 tracking-tight">Filler Word Decay Curve</h3>
              <p className="text-[11px] text-slate-400">Average fillers detected per 3-minute simulation</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Improving
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
            {[
              { label: 'Week 1', count: 12, height: '80%' },
              { label: 'Week 2', count: 9, height: '60%' },
              { label: 'Week 3', count: 6, height: '40%' },
              { label: 'Week 4', count: 3, height: '22%' },
              { label: 'Current', count: 2, height: '14%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-semibold text-slate-700 tabular-nums">{bar.count}</span>
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-[#4f46e5] to-[#8b5cf6] rounded-t-lg transition-all"
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] text-slate-400 mt-1">{bar.label}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Transitioning verbal hesitations ("um", "like") into deliberate 1-second silence pauses.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 tracking-tight">Speech Cadence Stability</h3>
              <p className="text-[11px] text-slate-400">Words per minute variance across scenario stress levels</p>
            </div>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              Zone: Executive
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
            {[
              { label: 'Academic Defense', wpm: 158, height: '72%' },
              { label: 'Exec Briefing', wpm: 142, height: '65%' },
              { label: 'Negotiation', wpm: 136, height: '60%' },
              { label: 'Conflict', wpm: 148, height: '68%' },
              { label: 'Target', wpm: 145, height: '66%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-semibold text-slate-700 tabular-nums">{bar.wpm}</span>
                <div
                  className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                    bar.label === 'Target' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] text-slate-400 mt-1 truncate w-full text-center">
                  {bar.label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Your delivery remains composed within the 135–160 WPM corridor even under simulated pushback.
          </p>
        </div>
      </div>

      {/* Historical Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-xs font-semibold text-slate-900 tracking-tight">Full Session Archive</h3>
          <span className="text-[11px] text-slate-400">{history.length} logged sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium text-[11px]">
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Scenario</th>
                <th className="pb-2.5">Cadence</th>
                <th className="pb-2.5">Fillers</th>
                <th className="pb-2.5">Readiness Score</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 text-[11px]">{item.date}</td>
                  <td className="py-3 font-semibold text-slate-800">{item.scenarioTitle}</td>
                  <td className="py-3 text-slate-600 tabular-nums">{item.wpm} WPM</td>
                  <td className="py-3 text-slate-600 tabular-nums">{item.fillerCount}</td>
                  <td className="py-3 font-bold text-[#3525cd] tabular-nums">{item.readinessScore}%</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onReviewSession(item)}
                      className="text-xs font-medium text-[#4f46e5] hover:text-[#3525cd]"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
