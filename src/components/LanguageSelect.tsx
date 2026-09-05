import { packs, type LanguageCode } from '../data/pack.ts'

interface LanguageSelectProps {
  onChoose: (code: LanguageCode) => void
}

export function LanguageSelect({ onChoose }: LanguageSelectProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">Waypoint</h1>
          <p className="text-sm text-ink-muted">Pick a path. Progress is stored separately per language.</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onChoose('ko')}
            className="w-full text-left rounded-2xl border border-coral/30 bg-white p-5 hover:bg-coral/5 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-coral">Live</p>
            <p className="font-display text-2xl font-bold mt-1">{packs.ko.name}</p>
            <p className="text-sm text-ink-muted mt-1">
              Hangul week, Billy Korean in-app, drama phrases. The full product.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChoose('de')}
            className="w-full text-left rounded-2xl border border-cream-dark bg-white p-5 hover:bg-cream transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Pilot</p>
            <p className="font-display text-2xl font-bold mt-1">{packs.de.name}</p>
            <p className="text-sm text-ink-muted mt-1">
              Sounds, Easy German, media phrases. Same honesty rules. Thinner than Korean on purpose.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
