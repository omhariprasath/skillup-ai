import { Scenario, HistoricSession } from '../types';

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'thesis-defense',
    title: 'Defending Thesis to a Skeptical Panel',
    subtitle: 'Navigating aggressive methodological pushback with academic poise',
    category: 'academic',
    difficulty: 'High-Stakes',
    estimatedMinutes: 5,
    personaName: 'Dr. Ronald Sterling',
    personaRole: 'Doctoral Committee Chair & Senior Faculty',
    personaAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    personaTemperament: 'Rigorous, demanding, razor-focused on statistical validity',
    description: 'Defend your core dissertation conclusions when the committee chair questions whether your sample size adequately accounts for latent confounding variables.',
    contextPrompt: 'You have just presented 20 minutes of doctoral research on organizational decision-making under uncertainty. Dr. Sterling leans forward with folded arms to test your composure under academic fire.',
    initialQuestion: 'Your empirical models make an ambitious claim about predictive causality. How do you reconcile that with the 14% variance unaccounted for in your third control cohort?',
    keySkills: ['Methodological Precision', 'Graceful Pushback', 'Executive Grounding'],
    suggestedOpening: 'Thank you, Dr. Sterling. That variance was specifically isolated in Chapter 4 because our non-parametric robustness checks confirmed...'
  },
  {
    id: 'exec-briefing',
    title: 'Delivering Bad News to Senior Leadership',
    subtitle: 'Framing a multi-week deployment slip using the Pyramid Principle',
    category: 'executive',
    difficulty: 'High-Stakes',
    estimatedMinutes: 4,
    personaName: 'Marcus Chen',
    personaRole: 'Chief Strategy Officer & Board Liaison',
    personaAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    personaTemperament: 'Time-pressured, results-oriented, values bottom-line solutions over excuses',
    description: 'Brief executive leadership on a 3-week infrastructure delay while presenting two viable mitigation tracks and protecting team morale.',
    contextPrompt: 'You requested an urgent 10-minute briefing with Marcus. The quarterly earnings report is in three weeks, and a critical database schema migration failed load tests.',
    initialQuestion: 'I have four minutes before the audit committee calls. Give me the bottom line: are we launching on Friday or not, and what is our financial exposure?',
    keySkills: ['Pyramid Principle', 'Outcome-First Framing', 'Crisis Composure'],
    suggestedOpening: 'Marcus, our bottom-line recommendation is to delay production cutover by 14 days to preserve data integrity, which carries zero compliance exposure if we initiate Track B today.'
  },
  {
    id: 'salary-negotiation',
    title: 'Salary & Equity Counter-Proposal',
    subtitle: 'Anchoring market value with assertiveness, warmth, and strategic leverage',
    category: 'negotiation',
    difficulty: 'Intermediate',
    estimatedMinutes: 4,
    personaName: 'Lauren Vance',
    personaRole: 'Head of Global Talent & VP People',
    personaAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    personaTemperament: 'Diplomatic, budget-conscious, evaluating conviction and cultural fit',
    description: 'Respond to an initial offer that is 12% below your target base compensation while negotiating accelerated RSUs and remote flexibility.',
    contextPrompt: 'You received a written offer for Staff Product Lead. The role scope is broader than initially advertised. You are in a 1-on-1 negotiation sync with Lauren.',
    initialQuestion: 'We are thrilled about the team consensus around you. The $185k package with 15k options is at the top of our band for this tier. Does that align with your expectations?',
    keySkills: ['Value Anchoring', 'Collaborative Firmness', 'Tactful Silence'],
    suggestedOpening: 'Lauren, I am energized by the team vision and the mandate for this product suite. Looking at the expanded remit across the two platform squads, $205k base with a four-year vesting ramp reflects the immediate impact I will deliver.'
  },
  {
    id: 'conflict-resolution',
    title: 'Cross-Functional Deadlock Under Launch Pressure',
    subtitle: 'De-escalating technical friction between engineering and design',
    category: 'conflict',
    difficulty: 'Intermediate',
    estimatedMinutes: 5,
    personaName: 'Derek Hoffman',
    personaRole: 'VP of Product Experience',
    personaAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    personaTemperament: 'Passionate, defensive of design standards, skeptical of engineering compromises',
    description: 'De-escalate a heated debate over whether to cut a complex micro-interaction animation to meet the hard iOS app submission deadline.',
    contextPrompt: 'Derek has threatened to block the release build because engineering trimmed a 60fps gesture animation due to battery drain on older devices.',
    initialQuestion: 'If we ship this build without the haptic transition, we are degrading the entire brand promise. Why are we cutting user experience rather than fixing the underlying cache logic?',
    keySkills: ['Empathetic Listening', 'Objective Re-framing', 'Consensus Synthesis'],
    suggestedOpening: 'Derek, I completely share your standard for our brand craft. Let us walk through the performance telemetry together so we can preserve 90% of the visual fidelity while maintaining 60 frames per second.'
  },
  {
    id: 'case-interview',
    title: 'Consulting Case: Market Entry & Unit Economics',
    subtitle: 'Synthesizing a structured business recommendation under scrutiny',
    category: 'interview',
    difficulty: 'High-Stakes',
    estimatedMinutes: 6,
    personaName: 'Sofia Rossi',
    personaRole: 'Principal Consultant & Case Interviewer',
    personaAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    personaTemperament: 'Analytical, fast-paced, testing structured thinking under ambiguity',
    description: 'Deliver your final 3-minute synthesis on whether a traditional automotive OEM should enter the commercial EV fleet subscription market.',
    contextPrompt: 'You have just spent 25 minutes crunching contribution margins and fleet utilization rates. Sofia asks for your executive recommendation.',
    initialQuestion: 'Alright, the board of directors has three minutes. Walk me through your definitive recommendation and the two biggest downside risks.',
    keySkills: ['MECE Framework', 'Numerical Articulation', 'Decisive Recommendation'],
    suggestedOpening: 'I recommend our client enter the commercial EV subscription market specifically targeting municipal delivery fleets, driven by three core economic indicators...'
  }
];

export const INITIAL_HISTORY: HistoricSession[] = [
  {
    id: 'hist-1',
    date: 'Yesterday, 4:15 PM',
    scenarioTitle: 'Delivering Bad News to Senior Leadership',
    category: 'executive',
    durationSeconds: 195,
    readinessScore: 88,
    wpm: 142,
    fillerCount: 3,
    topFeedback: 'Exceptional bottom-line clarity; eliminated hedging language in response to budget pushback.'
  },
  {
    id: 'hist-2',
    date: 'Oct 5, 2026',
    scenarioTitle: 'Defending Thesis to a Skeptical Panel',
    category: 'academic',
    durationSeconds: 240,
    readinessScore: 82,
    wpm: 158,
    fillerCount: 7,
    topFeedback: 'High technical competence; slowed cadence noticeably when challenged on cohort variance.'
  },
  {
    id: 'hist-3',
    date: 'Oct 3, 2026',
    scenarioTitle: 'Salary & Equity Counter-Proposal',
    category: 'negotiation',
    durationSeconds: 180,
    readinessScore: 91,
    wpm: 136,
    fillerCount: 2,
    topFeedback: 'Masterful use of 2-second silence after anchoring counter-offer; projected executive poise.'
  }
];

export const FILLER_WORD_DICTIONARY = [
  'um',
  'uh',
  'like',
  'you know',
  'sort of',
  'kind of',
  'actually',
  'basically',
  'literally',
  'honestly',
  'i mean',
  'so yeah'
];
