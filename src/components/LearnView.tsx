import type { HangulStats, VideoWatch, Watchable } from '../types'
import type { LearnMode } from '../utils/progressHonesty'
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
}: LearnViewProps) {
  return (
    <div className="space-y-5">
      <Segmented
        label="Learn"
        value={mode}
        onChange={onMode}
        options={[
          { id: 'practice', label: 'Hangul' },
          { id: 'watch', label: 'Watch' },
        ]}
      />
      {mode === 'watch' ? (
        <WatchView
          key={watchFocusId ?? 'watch'}
          videoProgress={videoProgress}
          playlistVideos={playlistVideos}
          customWatch={customWatch}
          initialId={watchFocusId}
          onProgress={onProgress}
          onPlaylistIds={onPlaylistIds}
          onAddCustom={onAddCustom}
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
