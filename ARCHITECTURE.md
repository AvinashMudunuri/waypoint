# Multi-language architecture (planned)

Waypoint uses a **language module** pattern. Each language is a self-contained config:

```
src/
  languages/
    korean/
      curriculum.ts    # phases, tasks, resources
      script.ts        # Hangul data + quiz
      media.ts         # drama miner labels
    japanese/          # (planned)
    german/            # (planned)
  core/                # shared UI, progress, PWA, Anki export
```

## Shared across all languages

- Phase model (script → foundation → immersion → conversation)
- Weekly routine tracker
- Media phrase miner + Anki export
- Milestone timeline (adjusted per language difficulty)
- PWA shell

## Per-language

- Writing system quiz (Hangul, Hiragana, etc.)
- Curriculum tasks and resource links
- Media labels ("Drama" vs "Anime" vs "Series")
- Realistic milestone timelines (FSI category affects estimates)

## Adding a new language

1. Create `src/languages/<code>/` with curriculum + script data
2. Register in `src/languages/index.ts`
3. Add language picker to onboarding / settings
4. Scope localStorage keys per language: `waypoint:<code>:progress`

Korean ships first. Architecture refactors as language #2 is added — no premature abstraction.
