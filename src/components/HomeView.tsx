import type { LanguagePack } from '../data/pack'
import type { NextAction, SessionSnapshot } from '../utils/progressHonesty'
import type { Phase } from '../types'
import { ProgressRing } from './ProgressRing'
import { TodaySession } from './TodaySession'

interface HomeViewProps {
  pack: LanguagePack
  currentPhase: Phase
  phasePercent: number
  daysSinceStart: number
  hangulReady: boolean
  hangulLabel: string
  playlistLabel: string
  quizStatLabel: string
  playlistStatLabel: string
  recent: boolean[]
  session: SessionSnapshot
  next: NextAction
  onDoNext: () => void
  onHangulAnswer: (correct: boolean) => void
  onWatch: () => void
}

export function HomeView({
  pack,
  currentPhase,
  phasePercent,
  daysSinceStart,
  hangulReady,
  hangulLabel,
  playlistLabel,
  quizStatLabel,
  playlistStatLabel,
  recent,
  session,
  next,
  onDoNext,
  onHangulAnswer,
  onWatch,
}: HomeViewProps) {
  if (!hangulReady) {
    return (
      <div className="space-y-6">
        <section className="space-y-1">
          <p className="text-sm text-ink-muted">
            Day {daysSinceStart + 1} · {pack.scriptLabel}
          </p>
          <h2 className="font-display text-3xl font-bold text-ink">A short session</h2>
          <p className="text-sm text-ink-muted">
            Hear it, answer five, stop. The long playlist is not day one.
          </p>
        </section>

        <TodaySession
          pack={pack}
          recent={recent}
          session={session}
          onAnswer={onHangulAnswer}
          onWatch={onWatch}
        />
      </div>
    )
  }

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
