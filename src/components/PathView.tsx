import type { Milestone, Phase, Watchable } from '../types'
import type { PathMode } from '../utils/progressHonesty'
import { MilestonesView } from './MilestonesView'
import { PhasesView } from './PhasesView'
import { Segmented } from './Segmented'

interface PathViewProps {
  mode: PathMode
  onMode: (mode: PathMode) => void
  phases: Phase[]
  currentPhaseId: string
  completedTasks: Record<string, boolean>
  phaseProgress: (id: string) => number
  onToggleTask: (taskId: string) => void
  onWatch: (catalogId: string) => void
  milestones: Milestone[]
  daysSinceStart: number
  overallPercent: number
  reached: boolean[]
  currentMilestone: number
  catalog: Watchable[]
}

export function PathView({
  mode,
  onMode,
  phases,
  currentPhaseId,
  completedTasks,
  phaseProgress,
  onToggleTask,
  onWatch,
  milestones,
  daysSinceStart,
  overallPercent,
  reached,
  currentMilestone,
  catalog,
}: PathViewProps) {
  return (
    <div className="space-y-5">
      <Segmented
        label="Path"
        value={mode}
        onChange={onMode}
        options={[
          { id: 'phases', label: 'Phases' },
          { id: 'goals', label: 'Goals' },
        ]}
      />
      {mode === 'goals' ? (
        <MilestonesView
          milestones={milestones}
          daysSinceStart={daysSinceStart}
          overallPercent={overallPercent}
          reached={reached}
          currentIndex={currentMilestone}
        />
      ) : (
        <PhasesView
          phases={phases}
          currentPhaseId={currentPhaseId}
          completedTasks={completedTasks}
          phaseProgress={phaseProgress}
          onToggleTask={onToggleTask}
          onWatch={onWatch}
          catalog={catalog}
        />
      )}
    </div>
  )
}
