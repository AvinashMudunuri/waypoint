import { useState } from 'react'
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
import type { Tab } from './types'

export default function App() {
  const [tab, setTab] = useState<Tab>('today')
  const [learnMode, setLearnMode] = useState<LearnMode>('practice')
  const [startQuiz, setStartQuiz] = useState(false)
  const [logMode, setLogMode] = useState<LogMode>('routine')
  const [pathMode, setPathMode] = useState<PathMode>('phases')
  const [watchFocusId, setWatchFocusId] = useState<string | null>(null)

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

  const go = (nextTab: Tab, opts?: { learn?: LearnMode; quiz?: boolean; log?: LogMode; path?: PathMode; watchId?: string }) => {
    if (opts?.learn) setLearnMode(opts.learn)
    if (opts?.quiz !== undefined) setStartQuiz(opts.quiz)
    if (opts?.log) setLogMode(opts.log)
    if (opts?.path) setPathMode(opts.path)
    if (opts?.watchId) setWatchFocusId(opts.watchId)
    setTab(nextTab)
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

  const renderView = () => {
    switch (tab) {
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
            mode={learnMode}
            onMode={(m) => {
              setLearnMode(m)
              if (m === 'practice') setStartQuiz(false)
            }}
            startQuiz={startQuiz}
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
            mode={logMode}
            onMode={setLogMode}
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
            mode={pathMode}
            onMode={setPathMode}
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
    <Layout activeTab={tab} onTabChange={setTab}>
      <InstallPrompt />
      {renderView()}
    </Layout>
  )
}
