import type { NextAction } from '../utils/progressHonesty'
import type { Phase } from '../types'
import { ProgressRing } from './ProgressRing'

interface HomeViewProps {
  currentPhase: Phase
  phasePercent: number
  daysSinceStart: number
  hangulLabel: string
  playlistLabel: string
  quizStatLabel: string
  playlistStatLabel: string
  next: NextAction
  onDoNext: () => void
}

export function HomeView({
  currentPhase,
  phasePercent,
  daysSinceStart,
  hangulLabel,
  playlistLabel,
  quizStatLabel,
  playlistStatLabel,
  next,
  onDoNext,
}: HomeViewProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm text-ink-muted">Day {daysSinceStart + 1}</p>
        <h2 className="font-display text-3xl font-bold text-ink">
          Phase {currentPhase.number}: {currentPhase.title}
        </h2>
        <p className="text-sm text-ink-muted">{currentPhase.subtitle}</p>
      </section>

      <div className="flex items-center gap-4">
        <ProgressRing percent={phasePercent} size={96} label="phase" />
        <div className="text-sm text-ink-muted space-y-1">
          <p>{quizStatLabel}: {hangulLabel}</p>
          <p>{playlistStatLabel}: {playlistLabel}</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-5 border border-coral/25 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-coral">Do this next</p>
        <h3 className="font-display text-xl font-bold">{next.title}</h3>
        <p className="text-sm text-ink-muted">{next.detail}</p>
        <button
          type="button"
          onClick={onDoNext}
          className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90 transition-colors"
        >
          {next.cta}
        </button>
      </section>
    </div>
  )
}
