# Waypoint

Honest milestones on your language journey — finite phases with clear exit criteria, not endless app grinding.

**Korean is live.** Japanese, German, and more are planned.

## Philosophy

- **Finite phases** with graduation criteria (not infinite levels)
- **Speaking built in** from week 3, not "someday"
- **Media immersion** — turn the shows you already watch into study
- **Honest milestones** — realistic timelines for adult learners

## Docs

| Doc | Role |
|-----|------|
| [AGENTS.md](./AGENTS.md) | How to run, change, and verify this repo (for people and agents) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | As-built layout, then the **planned** multi-language split |
| This file | Product overview, Korean features, **roadmap (todo list)** |

There is no separate `TODO.md`. Unbuilt work is the Roadmap section below.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

`npm run lint` (oxlint), `npm run test` (Hangul spoken-form + YouTube URL/progress helpers), and `npm run build` (`tsc -b && vite build`) are the verification commands. There is no component test suite.

## Current languages

| Language | Status | Highlights |
|----------|--------|------------|
| **Korean** | Live | Hangul quiz, K-drama phrase miner, 4-phase curriculum |
| Japanese | Planned | Hiragana/katakana quiz, anime phrase miner |
| German | Planned | Phased curriculum, media immersion |
| More | Backlog | Same phase model, language-specific scripts |

## Features (Korean v0.1)

| Tab | What it does |
|-----|-------------|
| **Today** | One next action from live progress (not a brochure) |
| **Learn** | Hangul chart/quiz + YouTube player with watch % |
| **Log** | Weekly routine + drama phrase miner / Anki export |
| **Path** | 4 phases + goals (skill-gated, not calendar) |

Progress saves in your browser (localStorage). No account needed.

### PWA — Install on your phone

- **Android (Chrome):** Tap "Install" when prompted, or Menu → Add to Home screen
- **iPhone (Safari):** Share → Add to Home Screen

Works offline after first load.

### Anki export

In the Drama tab, tap **Export for Anki** to download a `.txt` file. In Anki: File → Import → select the file.

## Roadmap (todo)

Source of truth for unbuilt work. None of these exist in `src/` today.

- [ ] Language picker (see `ARCHITECTURE.md` Planned)
- [ ] Japanese module (hiragana quiz, anime miner)
- [ ] German module
- [ ] Tutor booking reminders
- [ ] Cloud sync / accounts
- [ ] Broader automated tests (only `spokenHangul` mapping is covered today)

## Tech Stack

Matches `package.json` (app `0.1.0`):

- Vite 8 + React 19 + TypeScript 6
- Tailwind CSS v4 (`@tailwindcss/vite`)
- vite-plugin-pwa (installable; offline after first load)
- oxlint
- localStorage key `waypoint-progress` (legacy: `korean-path-progress`)
- No server, accounts, or database

## Origin

Born from an idea in [ideas-tracker](https://github.com/AvinashMudunuri/ideas-tracker) — brainstormed there, built here.

## Curriculum Sources (Korean)

- [GO! Billy Korean](https://www.youtube.com/c/GoBillyKorean) — Hangul
- [Talk To Me In Korean](https://talktomeinkorean.com/) — Grammar
- [Anki](https://apps.ankiweb.net/) — Vocabulary
- [Papago](https://papago.naver.com/) — Translation
- [iTalki](https://www.italki.com/) — Speaking practice
