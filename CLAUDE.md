# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A "game personality test" interactive website — users answer 10 fun questions, the system analyzes their answers and recommends the best-fitting game genre (one of 6 personality types), and generates a shareable result card. Target deployment is Alibaba Cloud Linux 3 behind Nginx.

## Tech stack

- **Frontend**: React 18 + Tailwind CSS, built with Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (file-based, no separate DB process)
- **Reverse proxy**: Nginx → serves static frontend build + proxies `/api` to Express

## Repo structure (planned)

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Landing, Quiz, QuestionCard, OptionCard, ProgressBar, Result, RadarChart, ShareCard, ParticleBackground
│   │   ├── data/questions.js
│   │   ├── hooks/useQuiz.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                   # Express backend
│   ├── routes/api.js
│   ├── models/result.js
│   ├── index.js
│   └── package.json
└── nginx.conf
```

## Commands

```bash
# Frontend
cd client
npm install
npm run dev        # Vite dev server
npm run build      # Production build → client/dist/

# Backend
cd server
npm install
node index.js      # Start Express server
```

## Architecture decisions

- **Mobile-first responsive design** — mobile is the primary use case (WeChat sharing, QR code scanning)
- **Card-flip quiz UX** — each question is a card; selecting an answer triggers a flip animation before the next card appears. All animations use CSS `transform`/`opacity` only — no layout-triggering properties — to stay performant.
- **Scoring model** — each option awards points to 1-2 personality types (primary +3, secondary +1). After all 10 questions, the highest-scoring type wins. Ties are broken by picking the more "interesting" result.
- **6 personality types**: 策略家 (Strategist), 冒险家 (Adventurer), 创造者 (Creator), 竞技者 (Competitor), 社交者 (Socializer), 休闲党 (Casual)
- **Share card generation** — Canvas-based, produces 1080×1920 (WeChat Moments) or 1080×1080 images with the user's personality type and radar chart
- **Radar chart** on result page shows scores across all 6 dimensions
- **Dark theme** (#0f0f23 background) with neon gradient accents (purple→blue→cyan), glassmorphism cards, and particle/geometric background effects

## API endpoints

| Method | Path             | Purpose                          |
|--------|------------------|----------------------------------|
| GET    | `/api/questions` | Return all 10 quiz questions     |
| POST   | `/api/submit`    | Submit answers, return result    |
| GET    | `/api/result/:id`| Retrieve a historical result     |
| GET    | `/api/stats`     | Aggregate stats (count per type) |
