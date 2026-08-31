import { catalog } from '../data/videos.ts'
import { phases } from '../data/curriculum.ts'
import type { HangulStats, Phase, Tab, VideoWatch } from '../types.ts'
import { playlistWatchSummary } from './youtube.ts'

export const HANGUL_RECENT_WINDOW = 20
export const HANGUL_READY_SAMPLE = 10
export const HANGUL_READY_PERCENT = 80

export type LearnMode = 'practice' | 'watch'
export type LogMode = 'routine' | 'phrases'
export type PathMode = 'phases' | 'goals'

export interface NextAction {
  tab: Tab
  learnMode?: LearnMode
  logMode?: LogMode
  pathMode?: PathMode
  title: string
  detail: string
  cta: string
}

export function appendHangulRecent(recent: boolean[] | undefined, correct: boolean): boolean[] {
  return [...(recent ?? []), correct].slice(-HANGUL_RECENT_WINDOW)
}

export function hangulRecentStats(stats: Pick<HangulStats, 'recent'> | boolean[]): {
  sample: number
  percent: number
  ready: boolean
} {
  const recent = Array.isArray(stats) ? stats : (stats.recent ?? [])
  const sample = recent.length
  const percent = sample === 0 ? 0 : Math.round((recent.filter(Boolean).length / sample) * 100)
  return {
    sample,
    percent,
    ready: sample >= HANGUL_READY_SAMPLE && percent >= HANGUL_READY_PERCENT,
  }
}

export function phaseTasksComplete(phase: Phase, completedTasks: Record<string, boolean>): boolean {
  return phase.tasks.length > 0 && phase.tasks.every((t) => completedTasks[t.id])
}

export function firstIncompleteTask(
  completedTasks: Record<string, boolean>,
): { phase: Phase; taskId: string; label: string } | null {
  for (const phase of phases) {
    const task = phase.tasks.find((t) => !completedTasks[t.id])
    if (task) return { phase, taskId: task.id, label: task.label }
  }
  return null
}

export function hangulPlaylistPercent(
  playlistVideos: Record<string, string[]>,
  videoProgress: Record<string, VideoWatch>,
): { percent: number; known: boolean } {
  const item = catalog.find((v) => v.id === 'billy-hangul')
  if (!item) return { percent: 0, known: false }
  const ids = playlistVideos[item.youtubeId] ?? []
  if (ids.length === 0) return { percent: 0, known: false }
  return { percent: playlistWatchSummary(ids, videoProgress).percent, known: true }
}

/** First unmet skill gate. m5 is never auto-certified. */
export function skillMilestoneIndex(input: {
  completedTasks: Record<string, boolean>
  hangulReady: boolean
}): { reached: boolean[]; current: number } {
  const hangulPhase = phases.find((p) => p.id === 'hangul')
  const foundation = phases.find((p) => p.id === 'foundation')
  const drama = phases.find((p) => p.id === 'drama')
  const conversation = phases.find((p) => p.id === 'conversation')

  const reached = [
    input.hangulReady || !!(hangulPhase && phaseTasksComplete(hangulPhase, input.completedTasks)),
    !!(foundation && phaseTasksComplete(foundation, input.completedTasks)),
    !!(drama && phaseTasksComplete(drama, input.completedTasks)),
    !!(conversation && input.completedTasks.c4) ||
      !!(conversation && phaseTasksComplete(conversation, input.completedTasks)),
    false,
  ]

  const current = reached.findIndex((ok) => !ok)
  return { reached, current: current === -1 ? reached.length - 1 : current }
}

export function decideNextAction(input: {
  completedTasks: Record<string, boolean>
  hangulRecent: boolean[]
  playlistPercent: number
  playlistKnown: boolean
  routineDone: number
  phraseCount: number
}): NextAction {
  const hangul = hangulRecentStats(input.hangulRecent)
  const playlistDone = input.playlistKnown && input.playlistPercent >= 100
  const first = firstIncompleteTask(input.completedTasks)

  if (first?.phase.id === 'hangul' && !playlistDone) {
    return {
      tab: 'learn',
      learnMode: 'watch',
      title: 'Watch the Hangul playlist',
      detail: input.playlistKnown
        ? `${input.playlistPercent}% of the playlist is at 80%+. Finish the rest here — not on a random YouTube tab.`
        : 'Phase 1 starts with Billy Korean’s Hangul series. Play it in the app so progress counts.',
      cta: 'Open player',
    }
  }

  if (first?.phase.id === 'hangul' && !hangul.ready) {
    const need = Math.max(0, HANGUL_READY_SAMPLE - hangul.sample)
    return {
      tab: 'learn',
      learnMode: 'practice',
      title: 'Quiz Hangul until it sticks',
      detail:
        hangul.sample === 0
          ? `Need ${HANGUL_READY_SAMPLE} recent answers at ${HANGUL_READY_PERCENT}%+. One lucky tap is not literacy.`
          : need > 0
            ? `Last ${hangul.sample}: ${hangul.percent}%. ${need} more answers before this counts.`
            : `Last ${hangul.sample}: ${hangul.percent}%. Hold ${HANGUL_READY_PERCENT}%+ on the last ${HANGUL_READY_SAMPLE}.`,
      cta: 'Start quiz',
    }
  }

  if (first) {
    if (first.taskId === 'd2') {
      return {
        tab: 'log',
        logMode: 'phrases',
        title: first.label,
        detail: `${input.phraseCount} phrases saved. Mine while you watch — Viki stays in its own app.`,
        cta: 'Open phrase log',
      }
    }
    return {
      tab: 'path',
      pathMode: 'phases',
      title: first.label,
      detail: `Next unchecked task in Phase ${first.phase.number}: ${first.phase.title}.`,
      cta: 'Open path',
    }
  }

  if (input.routineDone < 7) {
    return {
      tab: 'log',
      logMode: 'routine',
      title: 'Finish this week’s routine',
      detail: `${input.routineDone}/7 boxes. Speaking days are the ones people skip.`,
      cta: 'Open log',
    }
  }

  return {
    tab: 'path',
    pathMode: 'phases',
    title: 'Path is clear',
    detail: 'Every listed task is checked. Review the path or add a YouTube study video.',
    cta: 'Review path',
  }
}
