export interface Task {
  id: string
  label: string
  description?: string
}

export interface Phase {
  id: string
  number: number
  title: string
  subtitle: string
  duration: string
  exitCriteria: string
  tasks: Task[]
  resources: Resource[]
}

export interface Resource {
  name: string
  url: string
  type: 'youtube' | 'website' | 'app'
}

export interface Milestone {
  id: string
  label: string
  timeline: string
  description: string
}

export interface DramaPhrase {
  id: string
  korean: string
  english: string
  show: string
  notes?: string
  createdAt: string
}

export interface WeeklyRoutine {
  studyDays: string[]
  speakingDays: string[]
  studyActivity: string
  speakingActivity: string
  dramaNote: string
}

export interface VideoWatch {
  seconds: number
  duration: number
  completed: boolean
  title?: string
  updatedAt: string
}

export interface Watchable {
  id: string
  title: string
  subtitle?: string
  kind: 'video' | 'playlist'
  youtubeId: string
  startVideoId?: string
  url: string
  taskId?: string
  phaseId?: string
}

export interface AppProgress {
  completedTasks: Record<string, boolean>
  currentPhaseId: string
  dramaPhrases: DramaPhrase[]
  routineChecks: Record<string, boolean>
  startDate: string
  hangulStats: HangulStats
  videoProgress: Record<string, VideoWatch>
  playlistVideos: Record<string, string[]>
  customWatch: Watchable[]
}

export interface HangulStats {
  correct: number
  total: number
  streak: number
  recent: boolean[]
}

export type Tab = 'today' | 'learn' | 'log' | 'path'
