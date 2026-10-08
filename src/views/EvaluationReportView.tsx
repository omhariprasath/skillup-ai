import React, { useState } from 'react';
import { EvaluationResult, Scenario } from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  Share2,
  Clock,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

interface EvaluationReportViewProps {
  result: EvaluationResult;
  scenario: Scenario;
  userSpeech: string;
  duration: number;
  wpm: number;
  fillerCount: number;
  onRetry: () => void;
  onExploreScenarios: () => void;
  onStartDrill: (drillTitle: string) => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  result,
  scenario,
  userSpeech,
  duration,
  wpm,
  fillerCount,
  onRetry,
  onExploreScenarios,
  onStartDrill,
}) => {
  const [copied, setCopied] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const handleCopySummary = () => {
    const text = `SkillUp AI Performance Report: ${scenario.title}\nReadiness Score: ${result.readinessScore}/100\nExecutive Presence: ${result.executivePresence}%\nPacing: ${wpm} WPM\nFillers: ${fillerCount}\nSummary: ${result.headlineSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#3525cd]">
              <Award className="w-4 h-4" />
              <span>Behavioral & Executive Diagnostic</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Performance Review: {scenario.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {result.headlineSummary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duration: {formatTime(duration)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                Cadence: {wpm} WPM
              </span>
              <span>·</span>
              <span>Interlocutor: {scenario.personaName}</span>
            </div>
          </div>

          {/* Primary Score Badge */}
          <div className="flex flex-col items-center justify-center bg-[#f8f9ff] p-5 rounded-2xl border border-indigo-100 min-w-[210px] shadow-2xs self-stretch md:self-auto">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Executive Readiness
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-[#3525cd] tabular-nums">
                {result.readinessScore}
              </span>
              <span className="text-lg font-semibold text-slate-400">/100</span>
            </div>
            <span className="mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {result.readinessScore >= 85 ? 'High Executive Competency' : 'Emerging Proficiency'}
            </span>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow-xs transition-transform active:scale-[0.99]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
            <button
              onClick={onExploreScenarios}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              Next Scenario
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Executive Presence
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {result.executivePresence}%
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Vocal conviction, authority under interrogation, and firm conclusion anchoring.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Rhetorical Clarity
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {result.rhetoricalClarity}%
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Pyramid principle adherence, bottom-line upfront framing, and conceptual taxonomy.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Pacing & Composure
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {result.pacingComposure}%
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Measured delivery at {wpm} WPM. Controlled breath intervals between quantitative assertions.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Verbal Hygiene
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {result.verbalHygiene}%
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {fillerCount === 0 ? 'Zero filler words detected.' : `${fillerCount} filler occurrences mapped to strategic pause gaps.`}
          </div>
        </div>
      </div>

      {/* Two Column Feedback: Strengths vs Growth Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card with Emerald top accent hairline */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#10b981]" />

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#065f46]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mastered Behavioral Strengths</span>
            </span>
          </div>

          <ul className="space-y-3">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Opportunities Card with Amber top accent hairline */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#f59e0b]" />

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fffbeb] text-[#92400E]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High-Leverage Growth Opportunities</span>
            </span>
          </div>

          <ul className="space-y-3">
            {result.growthOpportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Next Drill Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-[#3525cd] rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Targeted Drill</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {result.recommendedDrill.title}
          </h3>
          <p className="mt-1 text-xs text-slate-200 leading-relaxed">
            {result.recommendedDrill.description}
          </p>
        </div>

        <button
          onClick={() => onStartDrill(result.recommendedDrill.title)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-[#3525cd] shadow-md transition-all active:scale-[0.98] shrink-0"
        >
          <span>Launch 90-Second Drill</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Spoken Transcript Archive */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-semibold text-slate-900">Spoken Delivery Transcript</h3>
          </div>
          <span className="text-[11px] text-slate-400">Captured in session</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 leading-relaxed font-normal">
          {userSpeech || 'No spoken text recorded.'}
        </div>

        {/* Filler Word Analysis note */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#FFE4E6]/50 border border-rose-200/80 flex items-start gap-2.5 text-xs text-[#9F1239]">
          <span className="font-semibold shrink-0">Cadence Guidance:</span>
          <span>{result.fillerAnalysis.coachingTip}</span>
        </div>
      </div>
    </div>
  );
};
