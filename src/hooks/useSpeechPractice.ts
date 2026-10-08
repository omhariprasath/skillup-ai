import { useState, useEffect, useRef, useCallback } from 'react';
import { FILLER_WORD_DICTIONARY } from '../data/scenarios';
import { ConfidenceScores } from '../types';

interface UseSpeechPracticeOptions {
  onInterlocutorReply?: (text: string) => void;
}

export function useSpeechPractice(options?: UseSpeechPracticeOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  
  // Real-time metrics
  const [duration, setDuration] = useState(0); // in seconds
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [wpm, setWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(28).fill(12));
  
  // Dynamic confidence scores (0-100)
  const [confidence, setConfidence] = useState<ConfidenceScores>({
    executivePresence: 82,
    rhetoricalClarity: 78,
    pacingComposure: 85,
    verbalHygiene: 92,
  });

  // Current coaching nudge
  const [currentNudge, setCurrentNudge] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Analyze transcript for fillers & WPM
  const analyzeText = useCallback((fullText: string, currentSeconds: number) => {
    if (!fullText.trim()) return;

    const words = fullText.trim().split(/\s+/);
    const wordCount = words.length;

    // Calculate WPM (if at least 3 seconds)
    const activeMinutes = Math.max(0.08, currentSeconds / 60);
    const calculatedWpm = Math.round(wordCount / activeMinutes);
    setWpm(Math.min(260, calculatedWpm));

    // Detect fillers
    const lowerText = fullText.toLowerCase();
    const foundFillers: string[] = [];
    let count = 0;

    FILLER_WORD_DICTIONARY.forEach(filler => {
      // Regex for whole word or exact phrase matching
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        count += matches.length;
        if (!foundFillers.includes(filler)) {
          foundFillers.push(filler);
        }
      }
    });

    setFillerCount(count);
    setDetectedFillers(foundFillers);

    // Compute dynamic confidence
    const fillerPenalty = Math.min(30, count * 5);
    const paceDelta = Math.abs(calculatedWpm - 145);
    const paceScore = Math.max(50, Math.min(98, 96 - Math.round(paceDelta * 0.4)));
    const hygieneScore = Math.max(55, 98 - fillerPenalty);
    const clarityScore = Math.max(60, Math.min(96, Math.round((paceScore * 0.4) + (hygieneScore * 0.6))));
    const presenceScore = Math.max(65, Math.min(96, Math.round((clarityScore * 0.5) + (paceScore * 0.5) + 3)));

    setConfidence({
      executivePresence: presenceScore,
      rhetoricalClarity: clarityScore,
      pacingComposure: paceScore,
      verbalHygiene: hygieneScore,
    });

    // Generate contextual whisper nudges based on telemetry
    if (calculatedWpm > 175) {
      setCurrentNudge('Pace accelerating past 175 WPM. Inhale, land the sentence, and hold a 1-second pause.');
    } else if (count > 3 && count % 2 === 0) {
      setCurrentNudge(`Detected "${foundFillers[foundFillers.length - 1] || 'filler'}". Replace hesitation with quiet eye contact.`);
    } else if (calculatedWpm >= 130 && calculatedWpm <= 155 && count === 0 && currentSeconds > 10) {
      setCurrentNudge('Exceptional executive cadence (140 WPM). Clear, authoritative vocal projection.');
    }
  }, []);

  // Web Audio visualizer loop
  const updateVisualizer = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Downsample to 28 bars
      const barCount = 28;
      const step = Math.floor(dataArray.length / barCount);
      const levels: number[] = [];

      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j] || 0;
        }
        const avg = sum / step;
        // Normalize 12-100 height percent
        const normalized = Math.max(14, Math.min(96, Math.round((avg / 255) * 100)));
        levels.push(normalized);
      }

      setAudioLevels(levels);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    }
  }, []);

  // Initialize Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalStr += item[0].transcript + ' ';
        } else {
          interimStr += item[0].transcript;
        }
      }

      if (finalStr) {
        setTranscript(prev => {
          const updated = (prev + ' ' + finalStr).trim();
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          analyzeText(updated, elapsed);
          return updated;
        });
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (e: any) => {
      console.warn('Speech recognition status:', e.error);
    };

    return recognition;
  }, [analyzeText]);

  // Start Real Microphone Practice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasMicPermission(true);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      startTimeRef.current = Date.now();
      setIsRecording(true);
      setIsSimulating(false);
      setDuration(0);
      setTranscript('');
      setInterimTranscript('');
      setFillerCount(0);
      setDetectedFillers([]);
      setCurrentNudge('Microphone calibrated. Lead with your core takeaway.');

      // Start timer
      timerIntervalRef.current = window.setInterval(() => {
        setDuration(prev => {
          const next = prev + 1;
          return next;
        });
      }, 1000);

      // Start visualizer animation
      updateVisualizer();

      // Start Web Speech
      const recognition = initSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (err) {
          console.warn('Could not start recognition:', err);
        }
      }
    } catch (err) {
      console.warn('Microphone permission not granted or unavailable:', err);
      setHasMicPermission(false);
      // Fallback seamlessly to simulated audio practice
      startSimulatedPractice();
    }
  };

  // Stop Recording
  const stopRecording = () => {
    setIsRecording(false);
    setIsSimulating(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Reset audio levels to calm resting state
    setAudioLevels(new Array(28).fill(12));
  };

  // Simulated Voice Practice (for quick demoing or when mic is disabled)
  const startSimulatedPractice = (customPhrases?: string[]) => {
    stopRecording();
    setIsSimulating(true);
    setIsRecording(true);
    setHasMicPermission(true);
    startTimeRef.current = Date.now();
    setDuration(0);
    setTranscript('');
    setInterimTranscript('');
    setFillerCount(0);
    setDetectedFillers([]);
    setCurrentNudge('Simulating speech capture. Observe live waveform and filler telemetry.');

    const sampleChunks = customPhrases || [
      'Marcus, looking at our core telemetry, um, we recommend a 14-day deployment shift.',
      'This guarantees zero compliance exposure, and frankly, protects database consistency.',
      'If we execute Track B immediately, like, our enterprise SLAs remain entirely intact.',
      'We have already isolated the three latent schema queries and re-indexed the cluster.'
    ];

    let chunkIndex = 0;

    // Simulate animated waveform bars
    const waveSim = () => {
      if (!streamRef.current) {
        const nextLevels = Array.from({ length: 28 }, (_, i) => {
          const mid = 14;
          const dist = Math.abs(i - mid);
          const base = 70 - dist * 3;
          const jitter = Math.sin(Date.now() / 150 + i * 0.4) * 25;
          return Math.max(16, Math.min(95, Math.round(base + jitter)));
        });
        setAudioLevels(nextLevels);
        animationFrameRef.current = requestAnimationFrame(waveSim);
      }
    };
    waveSim();

    // Timer & streaming text chunks
    timerIntervalRef.current = window.setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    simulationIntervalRef.current = window.setInterval(() => {
      if (chunkIndex < sampleChunks.length) {
        const chunk = sampleChunks[chunkIndex];
        setTranscript(prev => {
          const combined = (prev ? prev + ' ' : '') + chunk;
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          analyzeText(combined, elapsed);
          return combined;
        });
        chunkIndex++;
      } else {
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current);
          simulationIntervalRef.current = null;
        }
      }
    }, 3200);
  };

  // Interlocutor vocal synthesizer
  const speakInterlocutor = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Reset practice state
  const resetPractice = () => {
    stopRecording();
    setDuration(0);
    setTranscript('');
    setInterimTranscript('');
    setWpm(0);
    setFillerCount(0);
    setDetectedFillers([]);
    setCurrentNudge(null);
    setConfidence({
      executivePresence: 82,
      rhetoricalClarity: 78,
      pacingComposure: 85,
      verbalHygiene: 92,
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return {
    isRecording,
    isSimulating,
    hasMicPermission,
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
  };
}
