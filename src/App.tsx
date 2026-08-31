import { useCallback, useEffect, useState } from 'react'
import { milestones, phases } from './data/curriculum'
import { InstallPrompt } from './components/InstallPrompt'
import { HomeView } from './components/HomeView'
import { Layout } from './components/Layout'
import { LearnView } from './components/LearnView'
import { LogView } from './components/LogView'
import { PathView } from './components/PathView'
import { useProgress } from './hooks/useProgress'
import {
  decideNextAction,
  hangulPlaylistPercent,
  hangulRecentStats,
  skillMilestoneIndex,
  type LearnMode,
  type LogMode,
  type PathMode,
} from './utils/progressHonesty'
import { defaultRoute, parseHash, routesEqual, toHash, type RouteState } from './utils/hashRoute'
import type { Tab } from './types'

function routeFromLocation(): RouteState {
  return parseHash(window.location.hash)
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(routeFromLocation)
  const [watchFocusId, setWatchFocusId] = useState<string | null>(null)

  const applyRoute = useCallback((next: RouteState) => {
    setRoute((prev) => (routesEqual(prev, next) ? prev : next))
  }, [])

  useEffect(() => {
    const onHash = () => applyRoute(routeFromLocation())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [applyRoute])

  useEffect(() => {
    const hash = toHash(route)
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [route])

  const {
    progress,
    toggleTask,
    toggleRoutine,
    addPhrase,
    removePhrase,
    resetWeek,
    phaseProgress,
    currentPhase,
    overallProgress,
    daysSinceStart,
    routineDoneThisWeek,
    recordHangulAnswer,
    recordVideoProgress,
    rememberPlaylist,
    addCustomWatch,
  } = useProgress()

  const playlist = hangulPlaylistPercent(progress.playlistVideos, progress.videoProgress)
  const hangul = hangulRecentStats(progress.hangulStats)
  const next = decideNextAction({
    completedTasks: progress.completedTasks,
    hangulRecent: progress.hangulStats.recent ?? [],
    playlistPercent: playlist.percent,
    playlistKnown: playlist.known,
    routineDone: routineDoneThisWeek,
    phraseCount: progress.dramaPhrases.length,
  })
  const milestonesState = skillMilestoneIndex({
    completedTasks: progress.completedTasks,
    hangulReady: hangul.ready,
  })

  const go = (
    nextTab: Tab,
    opts?: { learn?: LearnMode; quiz?: boolean; log?: LogMode; path?: PathMode; watchId?: string },
  ) => {
    applyRoute({
      tab: nextTab,
      learnMode: opts?.learn ?? 'practice',
      quiz: opts?.quiz ?? false,
      logMode: opts?.log ?? 'routine',
      pathMode: opts?.path ?? 'phases',
    })
    if (opts?.watchId) setWatchFocusId(opts.watchId)
  }

  const doNext = () => {
    go(next.tab, {
      learn: next.learnMode,
      quiz: next.learnMode === 'practice',
      log: next.logMode,
      path: next.pathMode,
      watchId: next.learnMode === 'watch' ? 'billy-hangul' : undefined,
    })
  }

  const onTabChange = (tab: Tab) => {
    applyRoute({ ...defaultRoute(), tab })
  }

  const renderView = () => {
    switch (route.tab) {
      case 'today':
        return (
          <HomeView
            currentPhase={currentPhase}
            phasePercent={phaseProgress(currentPhase.id)}
            daysSinceStart={daysSinceStart}
            hangulLabel={
              hangul.sample === 0
                ? 'not started'
                : hangul.ready
                  ? `last ${hangul.sample}: ${hangul.percent}%`
                  : `last ${hangul.sample}: ${hangul.percent}% (need 10 at 80%+)`
            }
            playlistLabel={playlist.known ? `${playlist.percent}%` : 'not started'}
            next={next}
            onDoNext={doNext}
          />
        )
      case 'learn':
        return (
          <LearnView
            mode={route.learnMode}
            onMode={(m) => applyRoute({ ...route, learnMode: m, quiz: false })}
            startQuiz={route.quiz}
            hangulStats={progress.hangulStats}
            onHangulAnswer={recordHangulAnswer}
            videoProgress={progress.videoProgress}
            playlistVideos={progress.playlistVideos}
            customWatch={progress.customWatch}
            watchFocusId={watchFocusId}
            onProgress={recordVideoProgress}
            onPlaylistIds={rememberPlaylist}
            onAddCustom={addCustomWatch}
          />
        )
      case 'log':
        return (
          <LogView
            mode={route.logMode}
            onMode={(m) => applyRoute({ ...route, logMode: m })}
            routineChecks={progress.routineChecks}
            onToggleRoutine={toggleRoutine}
            onResetWeek={resetWeek}
            phrases={progress.dramaPhrases}
            onAddPhrase={addPhrase}
            onRemovePhrase={removePhrase}
          />
        )
      case 'path':
        return (
          <PathView
            mode={route.pathMode}
            onMode={(m) => applyRoute({ ...route, pathMode: m })}
            phases={phases}
            currentPhaseId={progress.currentPhaseId}
            completedTasks={progress.completedTasks}
            phaseProgress={phaseProgress}
            onToggleTask={toggleTask}
            onWatch={(id) => go('learn', { learn: 'watch', watchId: id })}
            milestones={milestones}
            daysSinceStart={daysSinceStart}
            overallPercent={overallProgress}
            reached={milestonesState.reached}
            currentMilestone={milestonesState.current}
          />
        )
    }
  }

  return (
    <Layout activeTab={route.tab} onTabChange={onTabChange}>
      <InstallPrompt />
      {renderView()}
    </Layout>
  )
}
