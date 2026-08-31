import type { DramaPhrase } from '../types'
import type { LogMode } from '../utils/progressHonesty'
import { DramaView } from './DramaView'
import { RoutineView } from './RoutineView'
import { Segmented } from './Segmented'

interface LogViewProps {
  mode: LogMode
  onMode: (mode: LogMode) => void
  routineChecks: Record<string, boolean>
  onToggleRoutine: (key: string) => void
  onResetWeek: () => void
  phrases: DramaPhrase[]
  onAddPhrase: (phrase: Omit<DramaPhrase, 'id' | 'createdAt'>) => void
  onRemovePhrase: (id: string) => void
}

export function LogView({
  mode,
  onMode,
  routineChecks,
  onToggleRoutine,
  onResetWeek,
  phrases,
  onAddPhrase,
  onRemovePhrase,
}: LogViewProps) {
  return (
    <div className="space-y-5">
      <Segmented
        label="Log"
        value={mode}
        onChange={onMode}
        options={[
          { id: 'routine', label: 'Routine' },
          { id: 'phrases', label: 'Phrases' },
        ]}
      />
      {mode === 'phrases' ? (
        <DramaView phrases={phrases} onAdd={onAddPhrase} onRemove={onRemovePhrase} />
      ) : (
        <RoutineView
          routineChecks={routineChecks}
          onToggle={onToggleRoutine}
          onResetWeek={onResetWeek}
          onOpenPhrases={() => onMode('phrases')}
        />
      )}
    </div>
  )
}
