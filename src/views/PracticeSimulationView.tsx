import React, { useState, useEffect } from 'react';
import { Scenario, DialogueTurn, EvaluationResult } from '../types';
import { SpeechWaveform } from '../components/SpeechWaveform';
import { FillerWordTracker } from '../components/FillerWordTracker';
import { ConfidenceMatrix } from '../components/ConfidenceMatrix';
import { AnnotatedTranscript } from '../components/AnnotatedTranscript';
import { useSpeechPractice } from '../hooks/useSpeechPractice';
import { 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  Volume2, 
  Lightbulb, 
  ArrowRight, 
  RefreshCw,
  Send,
  HelpCircle
} from 'lucide-react';

interface PracticeSimulationViewProps {
  scenario: Scenario;
  onFinishEvaluation: (result: EvaluationResult, transcript: string, duration: number, wpm: number, fillerCount: number) => void;
  onSelectOtherScenario: () => void;
}

export const PracticeSimulationView: React.FC<PracticeSimulationViewProps> = ({
  scenario,
  onFinishEvaluation,
  onSelectOtherScenario,
}) => {
  const [dialogueHistory, setDialogueHistory] = useState<DialogueTurn[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isInterlocutorReplying, setIsInterlocutorReplying] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const [showTips, setShowTips] = useState(false);

  // Hook for audio waveform, filler words, WPM, and confidence
  const {
    isRecording,
    isSimulating,
    duration,
    transcript,
    interimTranscript,
    wpm,
    fillerCount,
    detectedFillers,
    audioLevels,
    confidence,
    currentNudge,
    startRecording,
    startSimulatedPractice,
    stopRecording,
    resetPractice,
    speakInterlocutor,
  } = useSpeechPractice();

  // Initialize scenario dialogue turn
  useEffect(() => {
    const initialTurn: DialogueTurn = {
      id: 'init-1',
      speaker: 'interlocutor',
      text: scenario.initialQuestion,
      timestamp: 'Just now',
    };
    setDialogueHistory([initialTurn]);
  }, [scenario]);

  // When speech stops or user commits speech, add turn
  const handleCommitUserTurn = (spokenText?: string) => {
    const textToCommit = (spokenText || transcript || typedResponse).trim();
    if (!textToCommit) return;

    const newTurn: DialogueTurn = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: textToCommit,
      timestamp: 'Just now',
      fillersDetected: detectedFillers,
      wpmAtTurn: wpm,
    };

    setDialogueHistory(prev => [...prev, newTurn]);
    setTypedResponse('');

    // Trigger AI interlocutor counter-response
    triggerInterlocutorResponse(textToCommit, [...dialogueHistory, newTurn]);
  };

  // Call API for interlocutor counter-turn
  const triggerInterlocutorResponse = async (userText: string, currentHistory: DialogueTurn[]) => {
    setIsInterlocutorReplying(true);

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          personaName: scenario.personaName,
          personaRole: scenario.personaRole,
          personaTemperament: scenario.personaTemperament,
          dialogueHistory: currentHistory.map(d => ({ speaker: d.speaker, text: d.text })),
          userMessage: userText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyTurn: DialogueTurn = {
          id: `interlocutor-${Date.now()}`,
          speaker: 'interlocutor',
          text: data.reply,
          timestamp: 'Just now',
        };
        setDialogueHistory(prev => [...prev, replyTurn]);
        speakInterlocutor(data.reply);
      }
    } catch (err) {
      console.warn('Interlocutor response fallback:', err);
    } finally {
      setIsInterlocutorReplying(false);
    }
  };

  // Finish practice session and generate full evaluation
  const handleFinishAndEvaluate = async () => {
    stopRecording();
    setIsEvaluating(true);

    const fullUserSpeech = [
      ...dialogueHistory.filter(d => d.speaker === 'user').map(d => d.text),
      transcript,
    ]
      .filter(Boolean)
      .join(' ');

    const fallbackSpeech =
      fullUserSpeech ||
      scenario.suggestedOpening +
        ' Furthermore, we isolated the underlying performance invariants to ensure non-disruptive cutover.';

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          scenarioRole: scenario.personaRole,
          userSpeech: fallbackSpeech,
          durationSeconds: Math.max(25, duration),
          wpm: wpm > 0 ? wpm : 142,
          fillerCount: fillerCount,
          detectedFillers: detectedFillers,
        }),
      });

      if (response.ok) {
        const result: EvaluationResult = await response.json();
        onFinishEvaluation(
          result,
          fallbackSpeech,
          Math.max(25, duration),
          wpm > 0 ? wpm : 142,
          fillerCount
        );
      }
    } catch (err) {
      console.error('Evaluation request error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSimulateCustom = () => {
    startSimulatedPractice([
      scenario.suggestedOpening,
      'We verified that by maintaining this cadence, our risk profile drops by roughly forty percent.',
      'So, um, the decisive path forward is executing Track B before the end of the sprint.'
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Scenario Briefing Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={scenario.personaAvatar}
              alt={scenario.personaName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200/80 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3525cd]">
                  Active Simulation HUD
                </span>
                <span className="text-[11px] text-slate-400">· {scenario.difficulty}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {scenario.title}
              </h2>
              <p className="text-xs text-slate-600">
                Counter-Interlocutor: <strong className="text-slate-900 font-medium">{scenario.personaName}</strong> ({scenario.personaRole})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Coaching Intel</span>
            </button>
            <button
              onClick={onSelectOtherScenario}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Change Scenario
            </button>
          </div>
        </div>

        {/* Collapsible Coaching Intel */}
        {showTips && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <span className="font-semibold text-indigo-900 block mb-1">Target Persona Temperament</span>
              <p className="text-indigo-800 text-[11px] leading-relaxed">{scenario.personaTemperament}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-1">Recommended Opening Hook</span>
              <p className="text-slate-600 text-[11px] italic leading-relaxed">"{scenario.suggestedOpening}"</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="font-semibold text-emerald-900 block mb-1">Key Competency Criteria</span>
              <ul className="text-emerald-800 text-[11px] list-disc list-inside space-y-0.5">
                {scenario.keySkills.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Floating Coaching Whisper Nudge if available */}
      {currentNudge && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#ede9fe] text-[#4338ca] border border-purple-200/70 shadow-xs text-xs font-medium animate-slide-down">
          <Lightbulb className="w-4 h-4 text-[#4338ca] shrink-0" />
          <span>{currentNudge}</span>
        </div>
      )}

      {/* Main Grid: Audio Visualizer & Real-Time Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Waveform + Live Transcript */}
        <div className="lg:col-span-7 space-y-5">
          {/* Domain Component 1: Speech Waveform */}
          <SpeechWaveform
            levels={audioLevels}
            isRecording={isRecording}
            isSimulating={isSimulating}
            duration={duration}
            wpm={wpm}
            onToggleRecord={() => {
              if (isRecording) {
                stopRecording();
                if (transcript) handleCommitUserTurn(transcript);
              } else {
                startRecording();
              }
            }}
            onSimulate={handleSimulateCustom}
            onReset={resetPractice}
            personaName={scenario.personaName}
          />

          {/* Interactive Live Transcript */}
          <AnnotatedTranscript
            dialogueHistory={dialogueHistory}
            liveTranscript={transcript}
            interimTranscript={interimTranscript}
            isRecording={isRecording}
            onPlaySpeaker={speakInterlocutor}
          />

          {/* Quick Input Bar (for hybrid text/speech input) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs flex items-center gap-2">
            <input
              type="text"
              value={typedResponse}
              onChange={e => setTypedResponse(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCommitUserTurn();
              }}
              placeholder="Or type an executive answer to submit directly to the interlocutor..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            <button
              onClick={() => handleCommitUserTurn()}
              disabled={!typedResponse.trim() && !transcript.trim()}
              className="p-2 rounded-xl bg-[#3525cd] text-white hover:bg-indigo-800 disabled:opacity-40 transition-colors"
              title="Submit response turn"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {isInterlocutorReplying && (
            <div className="flex items-center gap-2 text-xs text-indigo-700 animate-pulse px-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{scenario.personaName} is evaluating your response and formulating a counter-inquiry...</span>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Filler Word Tracker + Confidence Matrix */}
        <div className="lg:col-span-5 space-y-5">
          {/* Domain Component 2: Filler Word Tracker */}
          <FillerWordTracker
            count={fillerCount}
            detectedFillers={detectedFillers}
            totalWords={transcript ? transcript.split(/\s+/).length : 24}
          />

          {/* Domain Component 3: Confidence Matrix */}
          <ConfidenceMatrix scores={confidence} wpm={wpm} />

          {/* Complete Practice & Evaluate Button */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-center space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">Session Completion</h4>
            <p className="text-[11px] text-slate-500">
              Generate a comprehensive diagnostic report analyzing verbal hygiene, rhetorical structure, and executive presence.
            </p>

            <button
              onClick={handleFinishAndEvaluate}
              disabled={isEvaluating}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-[#3525cd] hover:bg-[#281aa8] text-white shadow-md active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Diagnostic Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Finish & Generate Comprehensive Evaluation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
