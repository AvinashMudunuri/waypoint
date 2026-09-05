import type { HangulStats, VideoWatch, Watchable } from '../types'
import type { LanguagePack } from '../data/pack'
import type { LearnMode } from '../utils/progressHonesty'
import { GermanSoundsView } from './GermanSoundsView'
import { HangulView } from './HangulView'
import { Segmented } from './Segmented'
import { WatchView } from './WatchView'

interface LearnViewProps {
  mode: LearnMode
  onMode: (mode: LearnMode) => void
  startQuiz: boolean
  hangulStats: HangulStats
  onHangulAnswer: (correct: boolean) => void
  videoProgress: Record<string, VideoWatch>
  playlistVideos: Record<string, string[]>
  customWatch: Watchable[]
  watchFocusId: string | null
  onProgress: (videoId: string, patch: Omit<VideoWatch, 'updatedAt'>) => void
  onPlaylistIds: (playlistId: string, videoIds: string[]) => void
  onAddCustom: (item: Watchable) => void
  pack: LanguagePack
}

export function LearnView({
  mode,
  onMode,
  startQuiz,
  hangulStats,
  onHangulAnswer,
  videoProgress,
  playlistVideos,
  customWatch,
  watchFocusId,
  onProgress,
  onPlaylistIds,
  onAddCustom,
  pack,
}: LearnViewProps) {
  return (
    <div className="space-y-5">
      <Segmented
        label="Learn"
        value={mode}
        onChange={onMode}
        options={[
          { id: 'practice', label: pack.scriptLabel },
          { id: 'watch', label: pack.watchLabel },
        ]}
      />
      {mode === 'watch' ? (
        <WatchView
          key={`${pack.code}-${watchFocusId ?? 'watch'}`}
          catalog={pack.catalog}
          videoProgress={videoProgress}
          playlistVideos={playlistVideos}
          customWatch={customWatch}
          initialId={watchFocusId}
          onProgress={onProgress}
          onPlaylistIds={onPlaylistIds}
          onAddCustom={onAddCustom}
        />
      ) : pack.code === 'de' ? (
        <GermanSoundsView
          key={startQuiz ? 'quiz' : 'chart'}
          stats={hangulStats}
          onAnswer={onHangulAnswer}
          startInQuiz={startQuiz}
        />
      ) : (
        <HangulView
          key={startQuiz ? 'quiz' : 'chart'}
          stats={hangulStats}
          onAnswer={onHangulAnswer}
          startInQuiz={startQuiz}
        />
      )}
    </div>
  )
}
