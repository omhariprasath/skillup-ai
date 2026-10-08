import { GoogleGenAI } from '@google/genai';

export interface EvaluationPayload {
  scenarioTitle: string;
  scenarioRole: string;
  userSpeech: string;
  durationSeconds: number;
  wpm: number;
  fillerCount: number;
  detectedFillers: string[];
}

export interface CoachResponsePayload {
  scenarioTitle: string;
  personaName: string;
  personaRole: string;
  personaTemperament: string;
  dialogueHistory: { speaker: string; text: string }[];
  userMessage: string;
}

export async function evaluateSpeechWithGemini(data: EvaluationPayload, apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    return generateFallbackEvaluation(data);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `You are an expert executive communication and behavioral coach evaluating a professional/academic speaking practice session for SkillUp AI.

Session Details:
- Scenario: ${data.scenarioTitle}
- Interlocutor Role: ${data.scenarioRole}
- Speech Duration: ${data.durationSeconds} seconds
- Measured Pace: ${data.wpm} words per minute (Ideal is 135-160 WPM)
- Filler Word Count: ${data.fillerCount} (${data.detectedFillers.join(', ') || 'None'})

User's Spoken Transcript:
"${data.userSpeech}"

Perform a rigorous, supportive diagnostic assessment. Return JSON strictly in this format:
{
  "readinessScore": 86,
  "executivePresence": 88,
  "rhetoricalClarity": 82,
  "pacingComposure": 85,
  "verbalHygiene": 90,
  "headlineSummary": "Strong strategic thesis with clear framing, but can tighten opening transitions.",
  "strengths": [
    "Grounds arguments with direct outcome-first assertions",
    "Maintains composure when addressing counterarguments",
    "Appropriate vocal projection and authoritative framing"
  ],
  "growthOpportunities": [
    "Insert a deliberate 1.5-second pause before delivering key statistics",
    "Eliminate hedging language when presenting recommendations",
    "Structure conclusions using the Pyramid Principle summary format"
  ],
  "fillerAnalysis": {
    "frequency": "${data.fillerCount > 3 ? 'Moderate' : 'Low'}",
    "primaryFillers": ${JSON.stringify(data.detectedFillers)},
    "coachingTip": "When formulating next thoughts, embrace silence over verbal placeholders."
  },
  "recommendedDrill": {
    "title": "The Pyramid Principle 90-Second Drill",
    "description": "State your conclusion in the first 10 seconds, provide 3 supporting data pillars, and conclude with immediate action items."
  },
  "annotatedSegments": [
    {
      "text": "Extract an exemplary sentence from user transcript",
      "type": "strength",
      "annotation": "High-impact opening framing"
    },
    {
      "text": "Extract a sentence that could be sharpened",
      "type": "improvement",
      "annotation": "Could be more concise and direct"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return generateFallbackEvaluation(data);
  } catch (error) {
    console.error('Gemini evaluation error, using resilient coach engine:', error);
    return generateFallbackEvaluation(data);
  }
}

export async function generateInterlocutorReply(payload: CoachResponsePayload, apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    return generateFallbackReply(payload);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `You are roleplaying as "${payload.personaName}", ${payload.personaRole} in the simulation scenario "${payload.scenarioTitle}".
Your temperament is: ${payload.personaTemperament}.
The user is practicing behavioral communication and executive presence with you.

Dialogue history:
${payload.dialogueHistory.map(d => `${d.speaker}: ${d.text}`).join('\n')}

User just said:
"${payload.userMessage}"

Respond naturally in character in 2 to 3 sentences. Push them constructively with a sharp follow-up question or realistic skepticism tailored to this scenario. Keep it realistic, executive, and direct without breaking character.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return {
      reply: response.text?.trim() || generateFallbackReply(payload).reply,
      speaker: payload.personaName
    };
  } catch (error) {
    console.error('Gemini persona reply error:', error);
    return generateFallbackReply(payload);
  }
}

function generateFallbackEvaluation(data: EvaluationPayload) {
  const fillerPenalty = Math.min(30, data.fillerCount * 4);
  const wpmScore = data.wpm >= 120 && data.wpm <= 165 ? 92 : (data.wpm < 100 || data.wpm > 180 ? 74 : 84);
  const verbalScore = Math.max(65, 96 - fillerPenalty);
  const presenceScore = Math.round((wpmScore + verbalScore) / 2) + 2;
  const clarityScore = Math.round((presenceScore + verbalScore) / 2) - 1;
  const overall = Math.round((presenceScore * 0.3) + (clarityScore * 0.3) + (wpmScore * 0.2) + (verbalScore * 0.2));

  return {
    readinessScore: Math.min(96, Math.max(68, overall)),
    executivePresence: presenceScore,
    rhetoricalClarity: clarityScore,
    pacingComposure: wpmScore,
    verbalHygiene: verbalScore,
    headlineSummary: `Articulate delivery with structured narrative flow. Pacing aligned at ${data.wpm} WPM with strong command of domain context.`,
    strengths: [
      "Assertive vocal grounding with clear articulation of core milestones",
      "Disciplined cadence during complex contextual explanations",
      "Effective rhetorical pivots when presenting data rationale"
    ],
    growthOpportunities: [
      "Incorporate conscious breath pauses between core thesis statements",
      "Streamline introductory preambles to reach bottom-line conclusions faster",
      "Reinforce decisive vocal inflection at sentence endings"
    ],
    fillerAnalysis: {
      frequency: data.fillerCount > 3 ? "Moderate" : "Minimal",
      primaryFillers: data.detectedFillers.length ? data.detectedFillers : ["occasional pause filler"],
      coachingTip: "Replace reflexive verbal conjunctions with steady 1-second strategic pauses."
    },
    recommendedDrill: {
      title: "The Pyramid Principle 90-Second Drill",
      description: "State your bottom-line conclusion within the first 10 seconds, followed by three concise supporting pillars."
    },
    annotatedSegments: [
      {
        text: data.userSpeech.slice(0, 100) + "...",
        type: "strength",
        annotation: "Solid baseline framing and purposeful introduction"
      },
      {
        text: data.userSpeech.slice(100, 220) || "Synthesizing our strategic deliverables for the upcoming fiscal quarter...",
        type: "improvement",
        annotation: "Target for tighter concision and elimination of qualifying modifiers"
      }
    ]
  };
}

function generateFallbackReply(payload: CoachResponsePayload) {
  const replies = [
    `That is a solid premise, but how do you plan to handle the budget deficit in Q3 if cross-functional adoption lags by even fifteen percent?`,
    `I appreciate the clarity on your methodology. However, the committee needs assurance that your sample size accounts for seasonal volatility. What is your contingency?`,
    `I see your point on the timeline. If we reallocate the two senior engineers to support this sprint, what exact business milestone becomes our trade-off?`
  ];
  return {
    reply: replies[Math.floor(Math.random() * replies.length)],
    speaker: payload.personaName
  };
}
