import { useCallback, useEffect, useState } from 'react'
import { InstallPrompt } from './components/InstallPrompt'
import { HomeView } from './components/HomeView'
import { LanguageSelect } from './components/LanguageSelect'
import { Layout } from './components/Layout'
import { LearnView } from './components/LearnView'
import { LogView } from './components/LogView'
import { PathView } from './components/PathView'
import { useProgress } from './hooks/useProgress'
import { loadLanguage, packs, saveLanguage, type LanguageCode } from './data/pack'
import {
  decideNextAction,
  featuredPlaylistPercent,
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
  const [lang, setLang] = useState<LanguageCode | null>(loadLanguage)
  const [picking, setPicking] = useState(() => loadLanguage() === null || window.location.hash === '#/lang')
  const pack = packs[lang ?? 'ko']

  const [route, setRoute] = useState<RouteState>(routeFromLocation)
  const [watchFocusId, setWatchFocusId] = useState<string | null>(null)

  const applyRoute = useCallback((next: RouteState) => {
    setRoute((prev) => (routesEqual(prev, next) ? prev : next))
  }, [])

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#/lang') setPicking(true)
      applyRoute(routeFromLocation())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [applyRoute])

  useEffect(() => {
    if (picking) {
      if (window.location.hash !== '#/lang') window.history.replaceState(null, '', '#/lang')
      return
    }
    const hash = toHash(route)
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [route, picking])

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
  } = useProgress(pack)

  const playlist = featuredPlaylistPercent(
    progress.playlistVideos,
    progress.videoProgress,
    pack.featuredWatchId,
    pack.catalog,
  )
  const hangul = hangulRecentStats(progress.hangulStats)
  const next = decideNextAction({
    completedTasks: progress.completedTasks,
    hangulRecent: progress.hangulStats.recent ?? [],
    playlistPercent: playlist.percent,
    playlistKnown: playlist.known,
    routineDone: routineDoneThisWeek,
    phraseCount: progress.dramaPhrases.length,
    pack,
  })
  const milestonesState = skillMilestoneIndex({
    completedTasks: progress.completedTasks,
    hangulReady: hangul.ready,
    phases: pack.phases,
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
      watchId: next.learnMode === 'watch' ? pack.featuredWatchId : undefined,
    })
  }

  const choose = (code: LanguageCode) => {
    saveLanguage(code)
    setLang(code)
    setPicking(false)
    applyRoute(defaultRoute())
    setWatchFocusId(null)
  }

  if (picking || !lang) {
    return <LanguageSelect onChoose={choose} />
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
            quizStatLabel={pack.quizStatLabel}
            playlistStatLabel={pack.playlistStatLabel}
            next={next}
            onDoNext={doNext}
          />
        )
      case 'learn':
        return (
          <LearnView
            pack={pack}
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
            pack={pack}
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
            catalog={pack.catalog}
            mode={route.pathMode}
            onMode={(m) => applyRoute({ ...route, pathMode: m })}
            phases={pack.phases}
            currentPhaseId={progress.currentPhaseId}
            completedTasks={progress.completedTasks}
            phaseProgress={phaseProgress}
            onToggleTask={toggleTask}
            onWatch={(id) => go('learn', { learn: 'watch', watchId: id })}
            milestones={pack.milestones}
            daysSinceStart={daysSinceStart}
            overallPercent={overallProgress}
            reached={milestonesState.reached}
            currentMilestone={milestonesState.current}
          />
        )
    }
  }

  return (
    <Layout
      activeTab={route.tab}
      onTabChange={(tab) => applyRoute({ ...defaultRoute(), tab })}
      subtitle={pack.subtitle}
      onChangeLanguage={() => setPicking(true)}
    >
      <InstallPrompt />
      {renderView()}
    </Layout>
  )
}
