# Waypoint

Honest milestones on your language journey — finite phases with clear exit criteria, not endless app grinding.

**Korean is live.** Japanese, German, and more are planned.

## Philosophy

- **Finite phases** with graduation criteria (not infinite levels)
- **Speaking built in** from week 3, not "someday"
- **Media immersion** — turn the shows you already watch into study
- **Honest milestones** — realistic timelines for adult learners

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

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
| **Home** | Current phase progress, stats, today's focus |
| **Phases** | 4-phase curriculum with checkable tasks + resource links |
| **Hangul** | Interactive alphabet chart + char↔sound quiz |
| **Routine** | Weekly study/speaking/drama schedule tracker |
| **Drama** | Capture phrases from K-dramas + Anki export |
| **Goals** | Realistic milestone timeline |

Progress saves in your browser (localStorage). No account needed.

### PWA — Install on your phone

- **Android (Chrome):** Tap "Install" when prompted, or Menu → Add to Home screen
- **iPhone (Safari):** Share → Add to Home Screen

Works offline after first load.

### Anki export

In the Drama tab, tap **Export for Anki** to download a `.txt` file. In Anki: File → Import → select the file.

## Roadmap

- [ ] Language picker (multi-language architecture)
- [ ] Japanese module (hiragana quiz, anime miner)
- [ ] German module
- [ ] Tutor booking reminders
- [ ] Cloud sync / accounts

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- vite-plugin-pwa
- localStorage for persistence

## Origin

Born from an idea in [ideas-tracker](https://github.com/AvinashMudunuri/ideas-tracker) — brainstormed there, built here.

## Curriculum Sources (Korean)

- [GO! Billy Korean](https://www.youtube.com/c/GoBillyKorean) — Hangul
- [Talk To Me In Korean](https://talktomeinkorean.com/) — Grammar
- [Anki](https://apps.ankiweb.net/) — Vocabulary
- [Papago](https://papago.naver.com/) — Translation
- [iTalki](https://www.italki.com/) — Speaking practice
