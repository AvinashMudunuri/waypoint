import type { Phase } from '../types'
import { catalog } from '../data/videos'
import { phaseTasksComplete } from '../utils/progressHonesty'

interface PhasesViewProps {
  phases: Phase[]
  currentPhaseId: string
  completedTasks: Record<string, boolean>
  phaseProgress: (id: string) => number
  onToggleTask: (taskId: string) => void
  onWatch: (catalogId: string) => void
}

export function PhasesView({
  phases,
  currentPhaseId,
  completedTasks,
  phaseProgress,
  onToggleTask,
  onWatch,
}: PhasesViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Your 4 Phases</h2>
        <p className="text-sm text-ink-muted mt-1">
          Complete all tasks in a phase to graduate. No infinite levels.
        </p>
      </div>

      {phases.map((phase) => {
        const isPast = phaseTasksComplete(phase, completedTasks)
        const isCurrent = phase.id === currentPhaseId && !isPast
        const percent = phaseProgress(phase.id)

        return (
          <div
            key={phase.id}
            className={`bg-white rounded-2xl border overflow-hidden transition-all ${
              isCurrent ? 'border-coral shadow-sm shadow-coral/10' : 'border-cream-dark'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isPast ? 'bg-sage-light text-sage' : isCurrent ? 'bg-coral/10 text-coral' : 'bg-cream-dark text-ink-muted'
                    }`}>
                      {isPast ? 'Complete' : isCurrent ? 'Current' : `Phase ${phase.number}`}
                    </span>
                    <span className="text-xs text-ink-muted">{phase.duration}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mt-2">{phase.title}</h3>
                  <p className="text-sm text-ink-muted mt-1">{phase.subtitle}</p>
                </div>
                <span className="font-display text-lg font-bold text-ink-muted">{percent}%</span>
              </div>

              <div className="mt-3 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-coral rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-4 p-3 bg-cream rounded-xl">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Exit criteria</p>
                <p className="text-sm mt-1">{phase.exitCriteria}</p>
              </div>
            </div>

            <div className="border-t border-cream-dark px-5 py-4 space-y-2">
              {phase.tasks.map((task) => {
                const done = completedTasks[task.id]
                return (
                  <label
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      done ? 'bg-sage-light/40' : 'hover:bg-cream'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!done}
                      onChange={() => onToggleTask(task.id)}
                      className="mt-0.5 w-4 h-4 rounded accent-coral"
                    />
                    <div>
                      <p className={`text-sm font-medium ${done ? 'line-through text-ink-muted' : ''}`}>
                        {task.label}
                      </p>
                      {task.description && (
                        <p className="text-xs text-ink-muted mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>

            {phase.resources.length > 0 && (
              <div className="border-t border-cream-dark px-5 py-4">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Resources</p>
                <div className="flex flex-wrap gap-2">
                  {phase.resources.map((r) => {
                    const watchable = catalog.find((v) => v.url === r.url)
                    if (watchable) {
                      return (
                        <button
                          key={r.url}
                          type="button"
                          onClick={() => onWatch(watchable.id)}
                          className="text-xs px-3 py-1.5 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors"
                        >
                          {r.name} · Watch
                        </button>
                      )
                    }
                    return (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 bg-cream rounded-full text-ink hover:bg-coral/10 hover:text-coral transition-colors"
                      >
                        {r.name} ↗
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
