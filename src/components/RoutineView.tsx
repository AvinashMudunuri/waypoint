import { routineDayKeys, routineDayLabels } from '../data/curriculum'

interface RoutineViewProps {
  routineChecks: Record<string, boolean>
  onToggle: (key: string) => void
  onResetWeek: () => void
}

export function RoutineView({ routineChecks, onToggle, onResetWeek }: RoutineViewProps) {
  const doneCount = routineDayKeys.filter((k) => routineChecks[k]).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Weekly Routine</h2>
        <p className="text-sm text-ink-muted mt-1">
          ~3–4 hours of structured study per week, plus your normal drama time.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold">This week: {doneCount}/7</p>
          <button
            onClick={onResetWeek}
            className="text-xs text-ink-muted hover:text-coral transition-colors"
          >
            Reset week
          </button>
        </div>

        <div className="space-y-2">
          {routineDayKeys.map((key) => {
            const { day, activity } = routineDayLabels[key]
            const done = routineChecks[key]
            const isSpeaking = key.includes('speak')
            const isDrama = key.includes('drama')

            return (
              <label
                key={key}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors border ${
                  done
                    ? 'bg-sage-light/40 border-sage/20'
                    : 'border-cream-dark hover:bg-cream'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!done}
                  onChange={() => onToggle(key)}
                  className="w-4 h-4 rounded accent-coral"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${done ? 'line-through text-ink-muted' : ''}`}>
                      {day}
                    </p>
                    {isSpeaking && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-coral/10 text-coral rounded-full font-semibold">
                        SPEAK
                      </span>
                    )}
                    {isDrama && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gold/20 text-gold rounded-full font-semibold">
                        DRAMA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">{activity}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="bg-coral/5 rounded-2xl p-5 border border-coral/10">
        <h3 className="font-display font-semibold text-coral mb-2">The rule</h3>
        <p className="text-sm text-ink-muted">
          Start speaking by week 3–4, not "when you're ready." Input from dramas and TTMIK
          builds recognition; tutor sessions convert it into real conversation.
        </p>
      </div>
    </div>
  )
}
