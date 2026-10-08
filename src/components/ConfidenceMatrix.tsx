import React from 'react';
import { ConfidenceScores } from '../types';
import { Activity, ShieldCheck, Zap, Scale } from 'lucide-react';

interface ConfidenceMatrixProps {
  scores: ConfidenceScores;
  wpm: number;
}

export const ConfidenceMatrix: React.FC<ConfidenceMatrixProps> = ({ scores, wpm }) => {
  const metrics = [
    {
      id: 'presence',
      name: 'Executive Presence',
      value: scores.executivePresence,
      description: 'Poise, conviction & vocal grounding',
      icon: ShieldCheck,
      color: 'bg-[#4f46e5]',
    },
    {
      id: 'clarity',
      name: 'Rhetorical Structure',
      value: scores.rhetoricalClarity,
      description: 'Pyramid principle, bottom-line first',
      icon: Scale,
      color: 'bg-[#6b38d4]',
    },
    {
      id: 'pacing',
      name: 'Cadence & Regulation',
      value: scores.pacingComposure,
      description: `${wpm} WPM · Target 135–160 WPM`,
      icon: Activity,
      color: 'bg-[#10b981]',
    },
    {
      id: 'hygiene',
      name: 'Verbal Hygiene',
      value: scores.verbalHygiene,
      description: 'Precision & low filler density',
      icon: Zap,
      color: 'bg-[#006e4b]',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-900 tracking-tight">Confidence Matrix</h4>
          <p className="text-[11px] text-slate-500">Live behavioral telemetry & composite acoustics</p>
        </div>

        {/* Real-time WPM tabular metric indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium tabular-nums border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span>{wpm}</span>
          <span className="text-[10px] text-slate-500">WPM</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {metrics.map(metric => {
          const Icon = metric.icon;
          // Determine status color tier
          let tierLabel = 'Proficient';
          let tierBadgeColor = 'text-emerald-700 bg-emerald-50';
          if (metric.value < 70) {
            tierLabel = 'Calibrating';
            tierBadgeColor = 'text-amber-700 bg-amber-50';
          } else if (metric.value >= 88) {
            tierLabel = 'Executive';
            tierBadgeColor = 'text-indigo-700 bg-indigo-50';
          }

          return (
            <div key={metric.id} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-medium text-slate-800">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${tierBadgeColor}`}>
                    {tierLabel}
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums w-8 text-right">
                    {metric.value}%
                  </span>
                </div>
              </div>

              {/* Segmented progress bar with 8px radius and cubic-bezier(0.16, 1, 0.3, 1) */}
              <div className="h-2 w-full bg-slate-100 rounded-[8px] overflow-hidden p-[1px] border border-slate-200/40">
                <div
                  className={`h-full rounded-[6px] ${metric.color} transition-all duration-500`}
                  style={{
                    width: `${Math.max(5, Math.min(100, metric.value))}%`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>

              <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>{metric.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
