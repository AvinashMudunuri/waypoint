import type { Tab } from '../types.ts'
import type { LearnMode, LogMode, PathMode } from './progressHonesty.ts'

export interface RouteState {
  tab: Tab
  learnMode: LearnMode
  quiz: boolean
  logMode: LogMode
  pathMode: PathMode
}

export const defaultRoute = (): RouteState => ({
  tab: 'today',
  learnMode: 'practice',
  quiz: false,
  logMode: 'routine',
  pathMode: 'phases',
})

export function parseHash(hash: string): RouteState {
  const raw = hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  const parts = raw.split('/').filter(Boolean)
  const route = defaultRoute()
  const tab = parts[0]
  if (tab === 'today' || tab === 'learn' || tab === 'log' || tab === 'path') {
    route.tab = tab
  }
  if (route.tab === 'learn') {
    if (parts[1] === 'watch') route.learnMode = 'watch'
    else if (parts[1] === 'quiz') {
      route.learnMode = 'practice'
      route.quiz = true
    } else route.learnMode = 'practice'
  }
  if (route.tab === 'log' && (parts[1] === 'phrases' || parts[1] === 'routine')) {
    route.logMode = parts[1]
  }
  if (route.tab === 'path' && (parts[1] === 'goals' || parts[1] === 'phases')) {
    route.pathMode = parts[1]
  }
  return route
}

export function toHash(route: RouteState): string {
  if (route.tab === 'learn') {
    if (route.learnMode === 'watch') return '#/learn/watch'
    if (route.quiz) return '#/learn/quiz'
    return '#/learn'
  }
  if (route.tab === 'log') {
    return route.logMode === 'phrases' ? '#/log/phrases' : '#/log'
  }
  if (route.tab === 'path') {
    return route.pathMode === 'goals' ? '#/path/goals' : '#/path'
  }
  return '#/today'
}

export function routesEqual(a: RouteState, b: RouteState): boolean {
  return (
    a.tab === b.tab &&
    a.learnMode === b.learnMode &&
    a.quiz === b.quiz &&
    a.logMode === b.logMode &&
    a.pathMode === b.pathMode
  )
}
