import React from 'react';
import { DialogueTurn } from '../types';
import { FILLER_WORD_DICTIONARY } from '../data/scenarios';
import { Volume2 } from 'lucide-react';

interface AnnotatedTranscriptProps {
  dialogueHistory: DialogueTurn[];
  liveTranscript: string;
  interimTranscript?: string;
  isRecording: boolean;
  onPlaySpeaker?: (text: string) => void;
}

export const AnnotatedTranscript: React.FC<AnnotatedTranscriptProps> = ({
  dialogueHistory,
  liveTranscript,
  interimTranscript,
  isRecording,
  onPlaySpeaker,
}) => {
  // Helper to highlight fillers in text
  const renderHighlightedUserText = (text: string) => {
    if (!text) return null;
    const words = text.split(/(\s+)/);

    return words.map((word, idx) => {
      const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
      const isFiller = FILLER_WORD_DICTIONARY.includes(cleanWord);

      if (isFiller && cleanWord.length > 0) {
        return (
          <mark
            key={idx}
            className="bg-[#FFE4E6] text-[#9F1239] font-medium px-1 py-0.5 rounded border border-rose-200/80 mx-0.5"
            title="Filler word detected"
          >
            {word}
          </mark>
        );
      }
      return <span key={idx}>{word}</span>;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div>
          <h4 className="text-xs font-semibold text-slate-900 tracking-tight">Interactive Practice Transcript</h4>
          <p className="text-[11px] text-slate-400">Live speech stream & counter-party dialogue</p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FFE4E6] border border-rose-300" />
            Filler Highlight
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {dialogueHistory.map(turn => {
          const isUser = turn.speaker === 'user';

          return (
            <div
              key={turn.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-medium text-slate-700">
                  {isUser ? 'You (Candidate)' : 'Interlocutor'}
                </span>
                <span className="text-[10px] text-slate-400">{turn.timestamp}</span>

                {!isUser && onPlaySpeaker && (
                  <button
                    onClick={() => onPlaySpeaker(turn.text)}
                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded hover:bg-slate-100"
                    title="Play voice audio"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div
                className={`max-w-[88%] text-xs leading-relaxed p-3.5 rounded-2xl ${
                  isUser
                    ? 'bg-[#eff4ff] text-slate-900 border border-indigo-100/80 rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {isUser ? renderHighlightedUserText(turn.text) : turn.text}
              </div>
            </div>
          );
        })}

        {/* Live speech in progress */}
        {isRecording && (liveTranscript || interimTranscript) && (
          <div className="flex flex-col items-end animate-fade-in">
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[11px] font-medium text-indigo-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Live Spoken Stream
              </span>
            </div>
            <div className="max-w-[88%] text-xs leading-relaxed p-3.5 rounded-2xl bg-indigo-50/70 text-slate-900 border border-indigo-200/60 rounded-tr-xs">
              {renderHighlightedUserText(liveTranscript)}
              {interimTranscript && (
                <span className="text-slate-400 italic"> {interimTranscript}</span>
              )}
            </div>
          </div>
        )}

        {dialogueHistory.length === 0 && !liveTranscript && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-xs">
              No speech recorded yet. Tap <strong className="text-slate-600 font-semibold">Start Microphone</strong> or{' '}
              <strong className="text-slate-600 font-semibold">Simulate Voice Response</strong> to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
