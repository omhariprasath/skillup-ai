import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FillerWordTrackerProps {
  count: number;
  detectedFillers: string[];
  totalWords: number;
}

export const FillerWordTracker: React.FC<FillerWordTrackerProps> = ({
  count,
  detectedFillers,
  totalWords,
}) => {
  // Compute filler density
  const densityPercent = totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-900 tracking-tight">Verbal Cadence & Hygiene</span>
          <span className="text-[11px] text-slate-400">· Real-time</span>
        </div>

        {/* The Inline counter badge with soft Coral accent (#FFE4E6 bg, #9F1239 text) */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFE4E6] text-[#9F1239] border border-rose-200/80 shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5 text-[#9F1239]" />
          <span>{count} Filler {count === 1 ? 'Word' : 'Words'}</span>
          <span className="text-[10px] opacity-75 font-normal">({densityPercent}%)</span>
        </div>
      </div>

      {/* Non-judgmental guidance */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
        {count === 0 ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-800">Pristine verbal stream.</span> Keep anchoring with steady pauses rather than linking phrases.
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-[#9F1239] shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-800">Embrace deliberate stillness.</span>{' '}
              {count > 3
                ? 'When pivoting between analytical points, take a calm 1.5-second inhalation instead of bridging with verbal buffers.'
                : 'Brief hesitation detected. Silence projects deeper executive authority than filler bridges.'}
            </div>
          </>
        )}
      </div>

      {/* Detected fillers pills */}
      {detectedFillers.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Flagged tokens:</span>
          <div className="flex flex-wrap gap-1.5">
            {detectedFillers.map((filler, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100"
              >
                "{filler}"
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
