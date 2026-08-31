import { useCallback, useEffect, useState } from 'react'
import type { AppProgress, DramaPhrase } from '../types'
import { phases } from '../data/curriculum'

const STORAGE_KEY = 'waypoint-progress'
const LEGACY_STORAGE_KEY = 'korean-path-progress'

const defaultProgress = (): AppProgress => ({
  completedTasks: {},
  currentPhaseId: 'hangul',
  dramaPhrases: [],
  routineChecks: {},
  startDate: new Date().toISOString(),
  hangulStats: { correct: 0, total: 0, streak: 0 },
})

function loadProgress(): AppProgress {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (raw) localStorage.setItem(STORAGE_KEY, raw)
    }
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultProgress(), ...parsed, hangulStats: { ...defaultProgress().hangulStats, ...parsed.hangulStats } }
    }
  } catch {
    /* ignore corrupt data */
  }
  return defaultProgress()
}

function saveProgress(progress: AppProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<AppProgress>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const toggleTask = useCallback((taskId: string) => {
    setProgress((prev) => {
      const completed = { ...prev.completedTasks, [taskId]: !prev.completedTasks[taskId] }
      const updated = { ...prev, completedTasks: completed }

      for (const phase of phases) {
        const allDone = phase.tasks.every((t) => completed[t.id])
        if (allDone && phase.id === prev.currentPhaseId) {
          const nextIndex = phases.findIndex((p) => p.id === phase.id) + 1
          if (nextIndex < phases.length) {
            updated.currentPhaseId = phases[nextIndex].id
          }
        }
      }

      return updated
    })
  }, [])

  const toggleRoutine = useCallback((dayKey: string) => {
    setProgress((prev) => ({
      ...prev,
      routineChecks: { ...prev.routineChecks, [dayKey]: !prev.routineChecks[dayKey] },
    }))
  }, [])

  const addPhrase = useCallback((phrase: Omit<DramaPhrase, 'id' | 'createdAt'>) => {
    setProgress((prev) => ({
      ...prev,
      dramaPhrases: [
        {
          ...phrase,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...prev.dramaPhrases,
      ],
    }))
  }, [])

  const removePhrase = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      dramaPhrases: prev.dramaPhrases.filter((p) => p.id !== id),
    }))
  }, [])

  const resetWeek = useCallback(() => {
    setProgress((prev) => ({ ...prev, routineChecks: {} }))
  }, [])

  const resetAll = useCallback(() => {
    setProgress(defaultProgress())
  }, [])

  const recordHangulAnswer = useCallback((correct: boolean) => {
    setProgress((prev) => {
      const streak = correct ? prev.hangulStats.streak + 1 : 0
      return {
        ...prev,
        hangulStats: {
          correct: prev.hangulStats.correct + (correct ? 1 : 0),
          total: prev.hangulStats.total + 1,
          streak,
        },
      }
    })
  }, [])

  const phaseProgress = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId)
    if (!phase) return 0
    const done = phase.tasks.filter((t) => progress.completedTasks[t.id]).length
    return Math.round((done / phase.tasks.length) * 100)
  }

  const currentPhase = phases.find((p) => p.id === progress.currentPhaseId) ?? phases[0]
  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0)
  const completedCount = Object.values(progress.completedTasks).filter(Boolean).length
  const overallProgress = Math.round((completedCount / totalTasks) * 100)

  const daysSinceStart = Math.floor(
    (Date.now() - new Date(progress.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  const routineDoneThisWeek = Object.values(progress.routineChecks).filter(Boolean).length

  return {
    progress,
    toggleTask,
    toggleRoutine,
    addPhrase,
    removePhrase,
    resetWeek,
    resetAll,
    phaseProgress,
    currentPhase,
    overallProgress,
    completedCount,
    totalTasks,
    daysSinceStart,
    routineDoneThisWeek,
    recordHangulAnswer,
  }
}
