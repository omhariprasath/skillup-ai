import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Play } from 'lucide-react';

interface SpeechWaveformProps {
  levels: number[];
  isRecording: boolean;
  isSimulating: boolean;
  duration: number;
  wpm: number;
  onToggleRecord: () => void;
  onSimulate: () => void;
  onReset: () => void;
  personaName: string;
}

export const SpeechWaveform: React.FC<SpeechWaveformProps> = ({
  levels,
  isRecording,
  isSimulating,
  duration,
  wpm,
  onToggleRecord,
  onSimulate,
  onReset,
  personaName,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#f1f5f9] rounded-[20px] p-5 border border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] transition-all">
      {/* Header bar of Waveform */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200">
            {isRecording ? (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            ) : (
              <Volume2 className="w-4 h-4 text-slate-500" />
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{isRecording ? (isSimulating ? 'Voice Simulation' : 'Live Speech Capture') : 'Audio Visualizer Ready'}</span>
              {isRecording && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {isRecording ? `Practicing response to ${personaName}` : 'Speak clearly or test with simulated delivery'}
            </p>
          </div>
        </div>

        {/* Live Timer & WPM */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 tabular-nums shadow-2xs">
            <span className="text-slate-400 mr-1.5 font-normal">Session</span>
            <span className="font-semibold text-slate-900">{formatTime(duration)}</span>
          </div>

          <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 tabular-nums shadow-2xs">
            <span className="text-slate-400 mr-1.5 font-normal">Pace</span>
            <span className={`font-semibold ${wpm > 175 ? 'text-amber-600' : 'text-slate-900'}`}>
              {wpm} <span className="text-[10px] text-slate-500 font-normal">WPM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Visualizer bars: shifting from #4F46E5 to #8B5CF6 */}
      <div className="h-24 w-full bg-slate-950/5 rounded-xl px-4 py-3 flex items-center justify-between gap-1 border border-slate-200/50 overflow-hidden">
        {levels.map((level, idx) => {
          // Dynamic color interpolation between #4F46E5 (indigo) and #8B5CF6 (violet)
          const ratio = idx / (levels.length - 1);
          const barColor = ratio < 0.5 ? '#4f46e5' : '#8b5cf6';
          const heightPercent = isRecording ? Math.max(12, level) : 10;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-center items-center h-full"
            >
              <div
                className="w-full max-w-[8px] rounded-full transition-all duration-75"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  opacity: isRecording ? 0.9 : 0.25,
                  boxShadow: isRecording && heightPercent > 50 ? '0 0 8px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRecord}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-xs active:scale-[0.99]'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Pause Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Start Microphone</span>
              </>
            )}
          </button>

          {!isRecording && (
            <button
              onClick={onSimulate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
            >
              <Play className="w-3 h-3 text-[#4f46e5]" />
              <span>Simulate Voice Response</span>
            </button>
          )}

          {duration > 0 && (
            <button
              onClick={onReset}
              className="px-2.5 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Real-time voice acoustics & speech cadence enabled</span>
        </div>
      </div>
    </div>
  );
};
