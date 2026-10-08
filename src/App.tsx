/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveScreen } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { PracticeSimulationView } from './views/PracticeSimulationView';
import { EvaluationReportView } from './views/EvaluationReportView';
import { ScenarioLibraryView } from './views/ScenarioLibraryView';
import { AnalyticsView } from './views/AnalyticsView';
import { INITIAL_SCENARIOS, INITIAL_HISTORY } from './data/scenarios';
import { Scenario, HistoricSession, EvaluationResult } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<Scenario>(INITIAL_SCENARIOS[1]); // Default to Executive Briefing
  const [history, setHistory] = useState<HistoricSession[]>(INITIAL_HISTORY);

  // Latest evaluation state
  const [lastEvaluation, setLastEvaluation] = useState<{
    result: EvaluationResult;
    scenario: Scenario;
    userSpeech: string;
    duration: number;
    wpm: number;
    fillerCount: number;
  }>({
    result: {
      readinessScore: 88,
      executivePresence: 90,
      rhetoricalClarity: 84,
      pacingComposure: 88,
      verbalHygiene: 92,
      headlineSummary: 'Executive presence was remarkably anchored. Opening bottom-line recommendation neutralized risk upfront.',
      strengths: [
        'Direct outcome-first framing using the Pyramid Principle',
        'Steady vocal posture without defensive escalation',
        'Disciplined 142 WPM delivery throughout questioning'
      ],
      growthOpportunities: [
        'Insert a deliberate 1.5-second pause before detailing financial contingencies',
        'Eliminate qualifying preambles ("frankly", "essentially")',
        'Reinforce the decisive concluding call-to-action'
      ],
      fillerAnalysis: {
        frequency: 'Low',
        primaryFillers: ['um', 'like'],
        coachingTip: 'When pivoting between analytical arguments, hold quiet silence.'
      },
      recommendedDrill: {
        title: 'The Pyramid Principle 90-Second Drill',
        description: 'Lead with the executive recommendation in sentence one, followed by three non-overlapping supporting data pillars.'
      }
    },
    scenario: INITIAL_SCENARIOS[1],
    userSpeech: 'Marcus, our bottom-line recommendation is to delay production cutover by 14 days to preserve data integrity, which carries zero compliance exposure if we initiate Track B today.',
    duration: 195,
    wpm: 142,
    fillerCount: 3,
  });

  // Start a scenario from catalog or dashboard
  const handleStartScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setActiveScreen('practice');
  };

  // When practice completes and returns evaluation
  const handleFinishEvaluation = (
    result: EvaluationResult,
    transcript: string,
    duration: number,
    wpm: number,
    fillerCount: number
  ) => {
    const newSessionRecord: HistoricSession = {
      id: `hist-${Date.now()}`,
      date: 'Just now',
      scenarioTitle: activeScenario.title,
      category: activeScenario.category,
      durationSeconds: duration,
      readinessScore: result.readinessScore,
      wpm: wpm,
      fillerCount: fillerCount,
      topFeedback: result.headlineSummary,
    };

    setHistory(prev => [newSessionRecord, ...prev]);
    setLastEvaluation({
      result,
      scenario: activeScenario,
      userSpeech: transcript,
      duration,
      wpm,
      fillerCount,
    });
    setActiveScreen('evaluation');
  };

  // Add custom scenario from the library modal
  const handleAddCustomScenario = (newScenario: Scenario) => {
    setScenarios(prev => [newScenario, ...prev]);
    setActiveScenario(newScenario);
    setActiveScreen('practice');
  };

  // Launch a targeted drill
  const handleStartDrill = (drillTitle: string) => {
    // Customize active scenario with the drill focus
    const drillScenario: Scenario = {
      ...activeScenario,
      title: drillTitle,
      subtitle: 'Targeted behavioral calibration challenge',
      estimatedMinutes: 2,
      initialQuestion: 'Let us run the 90-second executive synthesis. State your bottom line first, followed by your three supporting pillars.',
    };
    setActiveScenario(drillScenario);
    setActiveScreen('practice');
  };

  // Review a historical session
  const handleReviewSession = (session: HistoricSession) => {
    const matched = scenarios.find(s => s.title === session.scenarioTitle) || activeScenario;
    setLastEvaluation(prev => ({
      ...prev,
      scenario: matched,
      duration: session.durationSeconds,
      wpm: session.wpm,
      fillerCount: session.fillerCount,
      result: {
        ...prev.result,
        readinessScore: session.readinessScore,
        headlineSummary: session.topFeedback,
      }
    }));
    setActiveScreen('evaluation');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Global Executive Navigation Bar */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={screen => setActiveScreen(screen)}
        isRecording={false}
        activeScenarioTitle={activeScenario.title}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeScreen === 'dashboard' && (
          <DashboardView
            scenarios={scenarios}
            history={history}
            onStartScenario={handleStartScenario}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'practice' && (
          <PracticeSimulationView
            scenario={activeScenario}
            onFinishEvaluation={handleFinishEvaluation}
            onSelectOtherScenario={() => setActiveScreen('scenarios')}
          />
        )}

        {activeScreen === 'evaluation' && (
          <EvaluationReportView
            result={lastEvaluation.result}
            scenario={lastEvaluation.scenario}
            userSpeech={lastEvaluation.userSpeech}
            duration={lastEvaluation.duration}
            wpm={lastEvaluation.wpm}
            fillerCount={lastEvaluation.fillerCount}
            onRetry={() => setActiveScreen('practice')}
            onExploreScenarios={() => setActiveScreen('scenarios')}
            onStartDrill={handleStartDrill}
          />
        )}

        {activeScreen === 'scenarios' && (
          <ScenarioLibraryView
            scenarios={scenarios}
            onSelectScenario={handleStartScenario}
            onAddCustomScenario={handleAddCustomScenario}
          />
        )}

        {activeScreen === 'analytics' && (
          <AnalyticsView
            history={history}
            onReviewSession={handleReviewSession}
          />
        )}
      </main>

      {/* Subtle Quiet Executive Footer */}
      <footer className="w-full border-t border-slate-200/70 bg-white/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SkillUp AI</span>
            <span>·</span>
            <span>Empathetic Executive Behavioral Coaching</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by real-time acoustic telemetry, speech cadence analysis & the Pyramid Principle
          </div>
        </div>
      </footer>
    </div>
  );
}
