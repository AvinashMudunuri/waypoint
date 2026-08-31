import { ProgressRing } from './ProgressRing'
import type { Tab } from '../types'

interface HomeViewProps {
  currentPhase: { number: number; title: string; subtitle: string; duration: string }
  phasePercent: number
  overallPercent: number
  daysSinceStart: number
  phraseCount: number
  routineDone: number
  hangulAccuracy: number
  watchPercent: number
  onNavigate: (tab: Tab) => void
  onWatch: () => void
}

export function HomeView({
  currentPhase,
  phasePercent,
  overallPercent,
  daysSinceStart,
  phraseCount,
  routineDone,
  hangulAccuracy,
  watchPercent,
  onNavigate,
  onWatch,
}: HomeViewProps) {
  return (
    <div className="space-y-6">
      <section className="text-center space-y-4">
        <p className="text-sm text-ink-muted">Day {daysSinceStart + 1} of your journey</p>
        <h2 className="font-display text-3xl font-bold text-ink">
          Phase {currentPhase.number}: {currentPhase.title}
        </h2>
        <p className="text-ink-muted max-w-md mx-auto">{currentPhase.subtitle}</p>
        <div className="flex justify-center pt-2">
          <ProgressRing percent={phasePercent} label="phase" />
        </div>
        <p className="text-sm text-ink-muted">
          {currentPhase.duration} · {overallPercent}% overall complete
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Phrases mined" value={phraseCount} onClick={() => onNavigate('drama')} />
        <StatCard label="Routine this week" value={`${routineDone}/7`} onClick={() => onNavigate('routine')} />
        <StatCard
          label="Hangul accuracy"
          value={hangulAccuracy > 0 ? `${hangulAccuracy}%` : '—'}
          onClick={() => onNavigate('hangul')}
        />
        <StatCard
          label="Hangul playlist"
          value={watchPercent > 0 ? `${watchPercent}%` : '—'}
          onClick={onWatch}
        />
      </section>

      {currentPhase.number === 1 && (
        <section className="bg-white rounded-2xl p-5 border border-coral/20 space-y-3">
          <h3 className="font-display font-semibold text-lg">Start here: Hangul quiz</h3>
          <p className="text-sm text-ink-muted">
            Phase 1 is all about the alphabet. Study the chart, then quiz yourself until you hit 80%+.
          </p>
          <button
            onClick={() => onNavigate('hangul')}
            className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90 transition-colors"
          >
            Practice Hangul →
          </button>
          <button
            onClick={onWatch}
            className="w-full py-3 border border-cream-dark rounded-xl font-semibold text-sm hover:bg-cream transition-colors"
          >
            Watch Hangul playlist →
          </button>
        </section>
      )}

      <section className="bg-white rounded-2xl p-5 border border-cream-dark space-y-3">
        <h3 className="font-display font-semibold text-lg">Today's focus</h3>
        <p className="text-sm text-ink-muted">
          Work through your current phase tasks. Check them off as you complete each one — when
          every task in a phase is done, you automatically advance to the next phase.
        </p>
        <button
          onClick={() => onNavigate('phases')}
          className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90 transition-colors"
        >
          View Phase {currentPhase.number} tasks →
        </button>
      </section>

      <section className="bg-sage-light/50 rounded-2xl p-5 border border-sage/20">
        <h3 className="font-display font-semibold text-lg text-sage mb-2">Why this works</h3>
        <ul className="text-sm text-ink-muted space-y-2">
          <li>✓ Finite phases with clear graduation criteria</li>
          <li>✓ Speaking practice built into your weekly routine</li>
          <li>✓ Your K-drama watching counts as real study</li>
          <li>✓ No streaks, no XP — just measurable progress</li>
        </ul>
      </section>
    </div>
  )
}

function StatCard({ label, value, onClick }: { label: string; value: string | number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-cream-dark text-left hover:border-coral/30 transition-colors"
    >
      <p className="text-2xl font-display font-bold text-ink">{value}</p>
      <p className="text-xs text-ink-muted mt-1">{label}</p>
    </button>
  )
}
