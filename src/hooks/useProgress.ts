import { useCallback, useEffect, useState } from 'react'
import type { AppProgress, DramaPhrase, VideoWatch, Watchable } from '../types'
import { catalog } from '../data/videos'
import { phases } from '../data/curriculum'
import { appendHangulRecent, currentPhaseFromTasks } from '../utils/progressHonesty'
import { isWatchComplete, playlistWatchSummary } from '../utils/youtube'

const STORAGE_KEY = 'waypoint-progress'
const LEGACY_STORAGE_KEY = 'korean-path-progress'

const defaultProgress = (): AppProgress => ({
  completedTasks: {},
  currentPhaseId: 'hangul',
  dramaPhrases: [],
  routineChecks: {},
  startDate: new Date().toISOString(),
  hangulStats: { correct: 0, total: 0, streak: 0, recent: [] },
  videoProgress: {},
  playlistVideos: {},
  customWatch: [],
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
      return {
        ...defaultProgress(),
        ...parsed,
        hangulStats: {
          ...defaultProgress().hangulStats,
          ...parsed.hangulStats,
          recent: parsed.hangulStats?.recent ?? [],
        },
        videoProgress: parsed.videoProgress ?? {},
        playlistVideos: parsed.playlistVideos ?? {},
        customWatch: parsed.customWatch ?? [],
        currentPhaseId: currentPhaseFromTasks(parsed.completedTasks ?? {}),
      }
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

      updated.currentPhaseId = currentPhaseFromTasks(completed)

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

  const recordVideoProgress = useCallback((videoId: string, patch: Omit<VideoWatch, 'updatedAt'>) => {
    setProgress((prev) => {
      const prevVid = prev.videoProgress[videoId]
      const completed = patch.completed || isWatchComplete(patch.seconds, patch.duration)
      const nextVid: VideoWatch = {
        seconds: patch.seconds,
        duration: patch.duration,
        completed,
        title: patch.title ?? prevVid?.title,
        updatedAt: new Date().toISOString(),
      }
      const videoProgress = { ...prev.videoProgress, [videoId]: nextVid }
      const updated: AppProgress = { ...prev, videoProgress }
      completeLinkedWatchTasks(updated)
      return updated
    })
  }, [])

  const rememberPlaylist = useCallback((playlistId: string, videoIds: string[]) => {
    if (videoIds.length === 0) return
    setProgress((prev) => {
      const existing = prev.playlistVideos[playlistId]
      if (existing && existing.length === videoIds.length && existing.every((id, i) => id === videoIds[i])) {
        return prev
      }
      const updated: AppProgress = {
        ...prev,
        playlistVideos: { ...prev.playlistVideos, [playlistId]: videoIds },
      }
      completeLinkedWatchTasks(updated)
      return updated
    })
  }, [])

  const addCustomWatch = useCallback((item: Watchable) => {
    setProgress((prev) => {
      if (prev.customWatch.some((w) => w.id === item.id)) return prev
      return { ...prev, customWatch: [...prev.customWatch, item] }
    })
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
          recent: appendHangulRecent(prev.hangulStats.recent, correct),
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
    recordVideoProgress,
    rememberPlaylist,
    addCustomWatch,
  }
}

function completeLinkedWatchTasks(updated: AppProgress) {
  for (const item of catalog) {
    if (!item.taskId || item.kind !== 'playlist') continue
    const ids = updated.playlistVideos[item.youtubeId] ?? []
    if (ids.length === 0) continue
    const summary = playlistWatchSummary(ids, updated.videoProgress)
    if (summary.percent < 100) continue
    if (updated.completedTasks[item.taskId]) continue
    updated.completedTasks = { ...updated.completedTasks, [item.taskId]: true }
    updated.currentPhaseId = currentPhaseFromTasks(updated.completedTasks)
  }
}
