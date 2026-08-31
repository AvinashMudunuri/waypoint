# Architecture

This file has two layers. **Current** is what ships. **Planned** is the module split for a second language. Agents must follow Current unless the task is implementing language #2.

## Current (Korean v0.1)

Single-page Vite + React app. No router library: `App.tsx` holds `tab` state and renders one view. No `src/languages/` or `src/core/` directories.

```
src/
  App.tsx
  types.ts
  data/curriculum.ts      # phases, milestones, routine
  data/hangul.ts          # script + quiz source
  hooks/useProgress.ts    # sole persistence + mutations
  components/*View.tsx    # Today / Learn / Log / Path shells
  utils/ankiExport.ts
  utils/speech.ts
  utils/youtube.ts
  utils/progressHonesty.ts  # next action + skill gates
  data/videos.ts
```

### Runtime model

```
┌─────────────────────────────────────────┐
│  Layout — Today · Learn · Log · Path    │
│  ┌───────────────────────────────────┐  │
│  │  Today: one next action           │  │
│  │  Learn: Hangul | Watch            │  │
│  │  Log: Routine | Phrases           │  │
│  │  Path: Phases | Goals             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                 │
                 ▼
         useProgress()
                 │
                 ▼
     localStorage["waypoint-progress"]
     (legacy: korean-path-progress)
```

- **Curriculum** is static TypeScript data, not fetched.
- **Phase advance** is client-side: all tasks in `currentPhaseId` checked → next phase id.
- **PWA**: service worker + manifest via `vite-plugin-pwa` in `vite.config.ts`. Offline after first load; data is still localStorage, not a remote cache of user progress.
- **Anki**: Drama phrases download as tab-separated Anki import (`#deck:Waypoint Korean Phrases`) or CSV. Not a sync API.

### Tech stack (as installed)

| Layer | Choice |
|-------|--------|
| Bundler | Vite 8 |
| UI | React 19 |
| Language | TypeScript 6 |
| CSS | Tailwind CSS 4 (`@tailwindcss/vite`) |
| PWA | vite-plugin-pwa |
| Lint | oxlint |
| Persistence | `localStorage` only |
| Tests | none |

See `package.json` for exact versions.

### Why it is not modularized yet

Korean is the only language. Extracting `languages/korean` + a registry would be premature until a second language has real content and a picker. That matches the original intent: refactor when language #2 lands.

---

## Planned (language #2+)

Each language becomes a config module. Shared chrome stays in today’s `components` / `hooks` / `utils`, not a new `core/` package unless reuse actually requires it.

```
src/
  languages/
    korean/
      curriculum.ts
      script.ts
      media.ts
    japanese/          # not started
    german/            # not started
    index.ts           # registry — not started
```

### Shared (keep one implementation)

- Phase model: script → foundation → immersion → conversation
- Weekly routine tracker
- Media phrase miner + Anki/CSV export
- Milestone timeline (numbers differ per language / FSI category)
- PWA shell

### Per language

- Writing-system quiz data
- Tasks and resource links
- Media labels (Drama vs Anime vs Series)
- Milestone copy and timelines

### Adding a language (when that work is the task)

1. Add `src/languages/<code>/` with curriculum + script data
2. Register in `src/languages/index.ts`
3. Language picker on first run / settings
4. Scope storage: `waypoint:<code>:progress` (today’s key is global `waypoint-progress` — migrate Korean)

Until then, do not create empty language folders or a picker UI.
