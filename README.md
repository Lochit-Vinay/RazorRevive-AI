# AI Payment Revenue Recovery Agent

An AI-powered revenue recovery system for merchants that continuously identifies potentially recoverable failed payments, diagnoses the likely root cause, determines the most appropriate recovery action, safely executes that action through a bounded recovery engine, and measures the revenue recovered.

## Problem
Failed payments result in lost revenue. Merchants lack the tooling to automatically differentiate between a temporary network glitch (which should be retried) and a permanently invalid card (which requires a new payment link), leading to crude, unsafe retry logic or abandoned revenue.

## Solution
Detect → Diagnose → Decide → Guardrail → Execute → Measure

## Features
- **AI Decision Engine**: Analyzes failure context and customer history to recommend the best recovery action.
- **Deterministic Guardrails**: Rejects AI recommendations if they violate retry limits, amount thresholds, or cooldowns.
- **Bounded Execution**: Only permitted actions are simulated/executed.
- **Batch Recovery**: Run thousands of failed payments through the pipeline instantly.
- **Audit Trail**: Every action (AI, System, Human) is logged.

## Tech Stack
- Frontend: React, Vite, TailwindCSS v4, Recharts, Lucide React
- Backend: Node.js, Express, TypeScript
- Database: SQLite via Prisma ORM (configurable to PostgreSQL via `.env`)
- AI: Google Gemini 1.5 Flash (Abstracted)

## Setup
```bash
git clone ...
cd RazorPay
npm install
cd backend
npx prisma migrate dev --name init
npm run db:seed
cd ..
npm run dev
```

## Environment Variables (backend/.env)
```env
PORT=3001
DATABASE_URL="file:./dev.db" # Defaulting to SQLite for prototype
RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="rzp_test_secret_placeholder"
GEMINI_API_KEY="your_gemini_api_key_here"
```

## Testing
The application uses a simulated engine for the prototype demo to prevent live financial transactions while demonstrating the value of the platform. You can trigger the Batch Simulation directly from the Dashboard.
