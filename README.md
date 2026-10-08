# SkillUp AI

> **AI-Driven Behavioral & Executive Communication Coach**  
> Bridging academic research defenses and high-stakes workplace leadership with real-time speech acoustics, verbal hygiene tracking, and executive composure coaching.

---

## 📖 Overview

**SkillUp AI** helps scholars, engineers, and rising leaders transform technical precision into authoritative executive conviction. By pairing real-time acoustic telemetry with supportive behavioral feedback, the application provides an emotionally safe, disciplined simulation arena for high-stakes conversations.

### Key Capabilities

- **🎙️ Real-Time Speech Waveform & Acoustics HUD**:
  - Housed in a custom 20px-radius enclosure with dynamic frequency bars shifting between Indigo (`#4F46E5`) and Violet (`#8B5CF6`).
  - Supports live microphone capture via Web Audio API + Speech Recognition, with simulated delivery fallbacks for quiet or mic-restricted environments.

- **🛡️ Inline Filler Word Tracker**:
  - Soft Coral indicator (`#FFE4E6` background, `#9F1239` text) monitoring verbal hesitations (*"um"*, *"like"*, *"you know"*, *"sort of"*, *"actually"*).
  - Pairs frequency metrics with non-judgmental, actionable prompts to replace verbal fillers with confident silence pauses.

- **📊 Dynamic Confidence Matrix**:
  - Segmented progress bars with custom easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Real-time cadence telemetry (Words Per Minute) rendered in tabular figures against the 135–160 WPM executive corridor.
  - Measures Executive Presence, Rhetorical Structure, Emotional Regulation, and Verbal Hygiene.

- **🤝 Interactive Counter-Interlocutor Simulation**:
  - Practice against realistic personas (e.g., skeptical doctoral committee chairs, time-pressured C-suite executives, and hiring partners).
  - AI responses powered by Gemini with text-to-speech audio synthesis playback.

- **📑 Diagnostic Evaluation & Score Reporting**:
  - Comprehensive post-session breakdown with readiness scores, color-coded hairline cards (Emerald `#10B981` for strengths, Amber `#F59E0B` for growth areas), and recommended 90-second drills (e.g., *The Pyramid Principle Drill*).

- **📚 Scenario Catalog & Custom Simulation Studio**:
  - Pre-built drills spanning Doctoral Defenses, Executive Crisis Briefings, Salary Negotiations, Cross-Functional Conflict, and Case Interviews.
  - Interactive scenario builder to configure custom interlocutors, temperaments, and opening challenge prompts.

- **📈 Longitudinal Analytics**:
  - Historical session archives, cadence stability charts, and multi-week filler word decay curves.

---

## 🔒 Security & Environment Variables

> **IMPORTANT**: Never commit `.env` or sensitive API keys to source control.

All local environment files (`.env`, `.env.local`, `.env.*`) are strictly excluded in `.gitignore` to prevent secret leakage to GitHub.

### Setup Instructions

1. Copy the template file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your credentials:
   ```bash
   # Required for Gemini AI speech analysis & interlocutor generation
   GEMINI_API_KEY="your-google-gemini-api-key"

   # Host URL (auto-injected in production environments)
   APP_URL="http://localhost:3000"
   ```
3. Verify that git does not track your `.env`:
   ```bash
   git status
   # .env should NOT appear in untracked files
   ```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillup-ai.git
cd skillup-ai

# Install dependencies
npm install
```

### Development Server

Start the development server on port 3000:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Verification & Testing

```bash
# Verify TypeScript types
npm run lint

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Audio & Speech**: Web Audio API, Web Speech API (SpeechRecognition & SpeechSynthesis)
- **AI Engine**: Google Gen AI SDK (`@google/genai` utilizing `gemini-3.8-flash`)
- **Server Middleware**: Vite Dev Server Middleware / Express proxy

---

## 📄 License

Apache-2.0
