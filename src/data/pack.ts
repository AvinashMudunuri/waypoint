import type { Milestone, Phase, Watchable } from '../types.ts'
import { milestones as koMilestones, phases as koPhases, routineDayLabels as koRoutine } from './curriculum.ts'
import { catalog as koCatalog } from './videos.ts'
import { deCatalog } from './videos.de.ts'
import {
  deMilestones,
  dePhases,
  deRoutineLabels,
} from './curriculum.de.ts'

export type LanguageCode = 'ko' | 'de'

export const LANGUAGE_KEY = 'waypoint-language'

export function progressKey(lang: LanguageCode): string {
  return lang === 'ko' ? 'waypoint-progress' : `waypoint-progress-${lang}`
}

export interface LanguagePack {
  code: LanguageCode
  name: string
  subtitle: string
  scriptLabel: string
  watchLabel: string
  quizStatLabel: string
  playlistStatLabel: string
  phraseTitle: string
  phraseHint: string
  phrasePlaceholder: string
  showPlaceholder: string
  ankiDeck: string
  speechLang: string
  watchPhaseId: string
  phraseTaskId: string
  featuredWatchId: string
  phases: Phase[]
  milestones: Milestone[]
  catalog: Watchable[]
  routineLabels: Record<string, { day: string; activity: string }>
}

export const packs: Record<LanguageCode, LanguagePack> = {
  ko: {
    code: 'ko',
    name: 'Korean',
    subtitle: 'Korean · Honest milestones',
    scriptLabel: 'Hangul',
    watchLabel: 'Watch',
    quizStatLabel: 'Hangul quiz',
    playlistStatLabel: 'Hangul playlist',
    phraseTitle: 'Drama Phrase Miner',
    phraseHint: 'Lines you typed. Hear them on this device. Export to Anki when you want.',
    phrasePlaceholder: 'Korean phrase (e.g. 진짜?)',
    showPlaceholder: 'Show name (e.g. Crash Landing on You)',
    ankiDeck: 'Waypoint Korean Phrases',
    speechLang: 'ko-KR',
    watchPhaseId: 'hangul',
    phraseTaskId: 'd2',
    featuredWatchId: 'billy-hangul',
    phases: koPhases,
    milestones: koMilestones,
    catalog: koCatalog,
    routineLabels: koRoutine,
  },
  de: {
    code: 'de',
    name: 'German',
    subtitle: 'German · Honest milestones',
    scriptLabel: 'Sounds',
    watchLabel: 'Watch',
    quizStatLabel: 'Sounds quiz',
    playlistStatLabel: 'Easy German playlist',
    phraseTitle: 'Media Phrase Miner',
    phraseHint: 'Lines from shows or podcasts. Hear them here. Export to Anki when you want.',
    phrasePlaceholder: 'German phrase (e.g. Echt jetzt?)',
    showPlaceholder: 'Show or podcast (e.g. Easy German)',
    ankiDeck: 'Waypoint German Phrases',
    speechLang: 'de-DE',
    watchPhaseId: 'sounds',
    phraseTaskId: 'm2',
    featuredWatchId: 'easy-german-phrases',
    phases: dePhases,
    milestones: deMilestones,
    catalog: deCatalog,
    routineLabels: deRoutineLabels,
  },
}

export function loadLanguage(): LanguageCode | null {
  try {
    const raw = localStorage.getItem(LANGUAGE_KEY)
    if (raw === 'ko' || raw === 'de') return raw
  } catch {
    /* ignore */
  }
  return null
}

export function saveLanguage(lang: LanguageCode): void {
  localStorage.setItem(LANGUAGE_KEY, lang)
}
