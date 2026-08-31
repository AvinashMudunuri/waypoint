# AGENTS.md

Instructions for humans and coding agents working in this repo.

## What this app is

Waypoint is a **client-only Korean learning PWA** (v0.1). Finite curriculum phases, Hangul quiz, weekly routine, K-drama phrase miner + Anki export, milestone timeline. Progress lives in the browser. There is **no backend, auth, API, or database**.

Japanese, German, language picker, tutor reminders, and cloud sync are **not implemented**. They are backlog in `README.md` (Roadmap).

## What is true vs what is planned

| Source | Treat as |
|--------|----------|
| This file + `src/` | Current product |
| `README.md` | Product overview + roadmap (todo list) |
| `ARCHITECTURE.md` — **Current** | As-built layout |
| `ARCHITECTURE.md` — **Planned** | Target for language #2. Do not implement `src/languages/` until that work starts. |

Do not invent `src/languages/`, `src/core/`, or `waypoint:<code>:progress` keys. Those are future.

## Commands

Local machines often use [Volta](https://volta.sh/) to pin Node. Prefer `node` / `npm` on PATH. If those fail, `volta run npm run <script>`. Align with Node 22 (Cloud Agent image).

```bash
npm install
npm run dev      # Vite → http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run test     # node:test on spokenHangul mapping
npm run preview  # serve dist
```

`npm run test` covers `spokenHangul` only (`src/data/hangul.test.ts`). There is no component test suite. Do not claim UI or TTS quality from that script.

## Layout (as built)

```
src/
  App.tsx                 # tab state + wires useProgress into views
  types.ts                # Phase, Task, AppProgress, Tab, …
  index.css               # Tailwind v4
  data/
    curriculum.ts         # Korean phases, milestones, weekly routine keys
    hangul.ts             # consonants, vowels, syllables for chart + quiz
  hooks/
    useProgress.ts        # load/save localStorage; all mutations
  components/             # one view per tab + Layout, InstallPrompt, ProgressRing
  utils/
    ankiExport.ts         # .txt (Anki) + CSV download from drama phrases
    speech.ts             # Web Speech API, lang ko-KR
```

Tabs (`types.ts` `Tab`): `home` | `phases` | `hangul` | `routine` | `drama` | `milestones` (UI label: Goals).

Korean copy and Hangul UI are hardcoded (e.g. `Layout` subtitle “Korean · Honest milestones”). Changing language is a product change, not a config flip.

## Persistence

- Key: `waypoint-progress`
- Legacy migrate-once: `korean-path-progress` → current key
- Shape: `AppProgress` in `types.ts` (completed tasks, current phase, phrases, routine checks, start date, hangul stats)
- Completing every task in the current phase advances `currentPhaseId` to the next phase (`useProgress.toggleTask`)
- Clearing site data wipes progress. There is no export of progress (only phrase Anki/CSV).

## Product constraints

- **Finite phases with exit criteria** — do not add infinite gamified levels or streak-as-product.
- Speaking appears in the curriculum from the foundation phase; do not bury it as “later.”
- Media immersion is first-class (Drama tab), not a side note.
- Honest adult timelines live in `curriculum.ts` milestones — do not invent faster marketing numbers.

## Change guidance

- Korean content edits: `src/data/curriculum.ts`, `src/data/hangul.ts`.
- Progress behavior: `src/hooks/useProgress.ts` + `types.ts`. Changing the stored shape needs a migration or default merge (load already spreads defaults).
- New surface: add a `Tab`, a view under `components/`, and a nav entry in `Layout.tsx`.
- Styling: Tailwind v4 via `@tailwindcss/vite`. Tokens live in `src/index.css`.
- PWA: `vite.config.ts` (`vite-plugin-pwa`), icons in `public/`.
- Pronunciation: `spokenHangul()` maps jamo to a syllable, then `speakKorean()` uses the device voice (`ko-KR`). Isolated ㅏ/ㄱ will not speak correctly if you skip the mapping. Quality depends on the OS voice — this is not recorded audio.
- Do not add accounts, sync, or a server unless that roadmap item is the task.

## Verification

After UI or client-state changes:

1. `npm run lint` and `npm run build`
2. Exercise the changed tab and any other tab that reads the same `useProgress` fields (Home aggregates several)
3. Check empty / first-visit state (no phrases, no hangul answers, no tasks done)
4. Confirm localStorage still round-trips after reload

If a browser is unavailable, use lint/build plus the closest substitute and say what you did not click through.

## Cursor Cloud

- Install: `npm install` (see `.cursor/environment.json`)
- Dev server: `npm run dev` on port **5173**
- Image: `.cursor/Dockerfile` — Ubuntu 24.04, Volta, Node 22
- No prebuilt environment builds are required for this frontend-only app

## Out of scope unless asked

Backend, auth, multi-language modules, tests, and rewriting `ARCHITECTURE.md` Planned as if it were shipped.
