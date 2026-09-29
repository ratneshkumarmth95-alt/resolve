# ⚡ MURMUR — "Hear the machine before it screams."

> **Build the Future Hackathon | PS04: "The Cost of Small Problems"**  
> Smart Factory & IoT Predictive Cost Prevention System.

---

## 📌 Product Thesis

Unplanned factory downtime costs manufacturers over **$50 Billion every year**. These catastrophic failures do not happen overnight—they start as **micro-drifts**:
- A **0.3°C/hr** thermal creep in a spindle bearing
- A **+4% harmonic vibration** in a drive motor
- A **slow refrigerant micro-leak** in an industrial chiller
- A **0.5 Bar pressure oscillation** in a hydraulic valve

**Murmur doesn't send annoying alert spam.** Instead, Murmur calculates the **TRAJECTORY** of each micro-drift, predicts the exact **Time-to-Scream**, displays the exponential **Cost of Inaction**, and provides a **one-click proactive fix**.

---

## ✨ 4 Unique Hooks Built Into Murmur

1. ⏳ **"Time-to-Scream" Countdown**: Real-time countdown timer per machine predicting exact seconds until threshold breach.
2. 🗺️ **Digital Twin Floor Map**: Interactive SVG blueprint of factory line glowing green → amber → red by **drift velocity**, not just current severity.
3. 📉 **Ghost Timeline**: Split-view graph contrasting **"If Ignored"** (red exponential cost curve) vs. **"If You Act Now"** (green flat fixed cost), shaded by dollars saved.
4. ⚡ **Chaos Mode (Judge Playground)**: Allows hackathon judges to inject synthetic micro-faults into any machine, watch the engine calculate drift in real time, and resolve it with a single click.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling & UI**: Tailwind CSS, Glassmorphism design system, Lucide icons
- **State Management**: Zustand
- **Animations & Numbers**: Framer Motion, Tabular-Nums Odometer
- **Data Visualization**: Recharts (Radar, Area, Line charts) & SVG Digital Twin Blueprint
- **Live Telemetry Engine**: Server-Sent Events (SSE) stream (`/api/stream`)
- **Database & Backend**: Prisma + SQLite (with zero-setup in-memory fallback)
- **Math Engine**: EWMA baseline + CUSUM change detection + rolling linear regression slope + exponential cost multiplier model

---

## 🚀 Quick Start (Runs with Zero External Setup)

```bash
# 1. Clone & Navigate
cd murmur

# 2. Install dependencies
npm install

# 3. Generate Prisma client & seed mock machines
npx prisma generate
npm run db:seed

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 90-Second Demo Script for Judges

| Time | Action | What to Say / Observe |
|---|---|---|
| **0:00 - 0:15** | **Landing Page (`/`)** | *"Unplanned factory downtime costs $50B/yr because small drifts are ignored. Watch what happens as I slide 'Days Ignored' from 0 to 30 days—the projected cost skyrockets exponentially!"* |
| **0:15 - 0:35** | **Dashboard (`/dashboard`)** | *"Here is the Murmur Digital Twin Floor Map. Machines glow green, amber, or red based on drift velocity. Notice the top bar: the Live Cost of Inaction ticker is rolling in real-time."* |
| **0:35 - 0:55** | **Chaos Mode** | *"Let's trigger Chaos Mode! Select 'CNC Mill Alpha-1', pick 'Spindle Thermal Creep', and click 'Inject Micro-Fault'. Watch the Time-to-Scream countdown begin immediately!"* |
| **0:55 - 0:75** | **One-Click Fix** | *"In the Early Intervention Queue, Murmur shows the predictive divergence sparkline and projected loss ($174,000). Click 'Trigger Maintenance'—confetti bursts, the fault resolves, and $174k is saved!"* |
| **0:75 - 0:90** | **Impact Report (`/report`)** | *"Finally, click Impact Report to view audited net dollars saved ($482.5k+), production hours preserved, and export a clean PDF executive report."* |

---

## 📂 Project Structure

```
murmur/
├── app/
│   ├── (marketing)/page.tsx     # Landing page with interactive slider & stats
│   ├── dashboard/page.tsx       # Main Digital Twin dashboard
│   ├── machines/[id]/page.tsx   # Machine detail view & live waveform
│   ├── report/page.tsx          # Financial impact & audit report
│   ├── api/                     # Next.js Route Handlers (Machines, SSE, Interventions, Chaos)
│   └── globals.css
├── components/
│   ├── ui/                      # Odometer, Toast, Navbar, Footer, SSEListener
│   ├── dashboard/               # Ticker, DigitalTwinMap, EarlyInterventionQueue, ChaosModePanel
│   ├── charts/                  # DriftRadar, GhostTimeline, WaveformChart
│   └── report/                  # ReportOverview
├── lib/
│   ├── engine.ts                # EWMA + CUSUM + Linear Regression predictive engine
│   ├── cost-model.ts            # Exponential cost function & Ghost Timeline math
│   ├── mock-data.ts             # 10 factory machines & initial interventions
│   ├── store.ts                 # Zustand client state
│   └── utils.ts
├── prisma/schema.prisma         # SQLite database schema
└── scripts/seed.ts              # Database seed script
```
