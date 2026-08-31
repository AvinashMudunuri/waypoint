import type { Milestone } from '../types'

interface MilestonesViewProps {
  milestones: Milestone[]
  daysSinceStart: number
  overallPercent: number
  reached: boolean[]
  currentIndex: number
}

export function MilestonesView({
  milestones,
  daysSinceStart,
  overallPercent,
  reached,
  currentIndex,
}: MilestonesViewProps) {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Realistic Milestones</h2>
        <p className="text-sm text-ink-muted mt-1">
          From logged work. Fluency is never auto-checked.
        </p>
      </div>

      <div className="relative">
        {milestones.map((milestone, i) => {
          const isReached = reached[i]
          const isCurrent = i === currentIndex && !isReached

          return (
            <div key={milestone.id} className="flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                    isReached
                      ? 'bg-coral border-coral'
                      : 'bg-white border-cream-dark'
                  } ${isCurrent ? 'ring-4 ring-coral/20' : ''}`}
                />
                {i < milestones.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1 ${isReached ? 'bg-coral' : 'bg-cream-dark'}`} />
                )}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h3 className={`font-display font-semibold ${isCurrent ? 'text-coral' : ''}`}>
                    {milestone.label}
                  </h3>
                  <span className="text-xs text-ink-muted bg-cream px-2 py-0.5 rounded-full">
                    {milestone.timeline}
                  </span>
                </div>
                <p className="text-sm text-ink-muted mt-1">{milestone.description}</p>
                {isCurrent && (
                  <p className="text-xs text-coral font-semibold mt-2">← Here — not yet evidenced</p>
                )}
                {isReached && (
                  <p className="text-xs text-sage font-semibold mt-2">Evidenced in this app</p>
                )}
                {i === milestones.length - 1 && (
                  <p className="text-xs text-ink-muted mt-2">
                    The app will not mark fluency from checkboxes or calendar time.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark p-5">
        <h3 className="font-display font-semibold mb-2">Your stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ink-muted">Days learning</p>
            <p className="font-display text-xl font-bold">{daysSinceStart + 1}</p>
          </div>
          <div>
            <p className="text-ink-muted">Curriculum progress</p>
            <p className="font-display text-xl font-bold">{overallPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
