import { useState } from 'react'
import { phases, milestones } from './data/curriculum'
import { catalog } from './data/videos'
import { useProgress } from './hooks/useProgress'
import { playlistWatchSummary } from './utils/youtube'
import { Layout } from './components/Layout'
import { InstallPrompt } from './components/InstallPrompt'
import { HomeView } from './components/HomeView'
import { PhasesView } from './components/PhasesView'
import { HangulView } from './components/HangulView'
import { RoutineView } from './components/RoutineView'
import { DramaView } from './components/DramaView'
import { WatchView } from './components/WatchView'
import { MilestonesView } from './components/MilestonesView'
import type { Tab, VideoWatch } from './types'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
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

  const openWatch = (id?: string) => {
    if (id) setWatchFocusId(id)
    setTab('watch')
  }

  const renderView = () => {
    switch (tab) {
      case 'home':
        return (
          <HomeView
            currentPhase={currentPhase}
            phasePercent={phaseProgress(currentPhase.id)}
            overallPercent={overallProgress}
            daysSinceStart={daysSinceStart}
            phraseCount={progress.dramaPhrases.length}
            routineDone={routineDoneThisWeek}
            hangulAccuracy={
              progress.hangulStats.total > 0
                ? Math.round((progress.hangulStats.correct / progress.hangulStats.total) * 100)
                : 0
            }
            watchPercent={watchHomePercent(
              progress.playlistVideos,
              progress.videoProgress,
            )}
            onNavigate={setTab}
            onWatch={() => openWatch('billy-hangul')}
          />
        )
      case 'phases':
        return (
          <PhasesView
            phases={phases}
            currentPhaseId={progress.currentPhaseId}
            completedTasks={progress.completedTasks}
            phaseProgress={phaseProgress}
            onToggleTask={toggleTask}
            onWatch={(id) => openWatch(id)}
          />
        )
      case 'watch':
        return (
          <WatchView
            key={watchFocusId ?? 'watch'}
            videoProgress={progress.videoProgress}
            playlistVideos={progress.playlistVideos}
            customWatch={progress.customWatch}
            initialId={watchFocusId}
            onProgress={recordVideoProgress}
            onPlaylistIds={rememberPlaylist}
            onAddCustom={addCustomWatch}
          />
        )
      case 'hangul':
        return (
          <HangulView
            stats={progress.hangulStats}
            onAnswer={recordHangulAnswer}
          />
        )
      case 'routine':
        return (
          <RoutineView
            routineChecks={progress.routineChecks}
            onToggle={toggleRoutine}
            onResetWeek={resetWeek}
          />
        )
      case 'drama':
        return (
          <DramaView
            phrases={progress.dramaPhrases}
            onAdd={addPhrase}
            onRemove={removePhrase}
          />
        )
      case 'milestones':
        return (
          <MilestonesView
            milestones={milestones}
            daysSinceStart={daysSinceStart}
            overallPercent={overallProgress}
          />
        )
    }
  }

  return (
    <Layout activeTab={tab} onTabChange={(t) => setTab(t as Tab)}>
      <InstallPrompt />
      {renderView()}
    </Layout>
  )
}

function watchHomePercent(
  playlistVideos: Record<string, string[]>,
  videoProgress: Record<string, VideoWatch>,
): number {
  const hangul = catalog.find((v) => v.id === 'billy-hangul')
  if (!hangul) return 0
  const ids = playlistVideos[hangul.youtubeId] ?? []
  return playlistWatchSummary(ids, videoProgress).percent
}
