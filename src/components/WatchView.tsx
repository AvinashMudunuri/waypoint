import { useMemo, useState, type FormEvent } from 'react'
import { catalog } from '../data/videos'
import type { VideoWatch, Watchable } from '../types'
import { YoutubePlayer } from './YoutubePlayer'
import { formatClock, parseYoutubeUrl, playlistWatchSummary, watchPercent } from '../utils/youtube'

interface WatchViewProps {
  videoProgress: Record<string, VideoWatch>
  playlistVideos: Record<string, string[]>
  customWatch: Watchable[]
  initialId?: string | null
  onProgress: (videoId: string, patch: Omit<VideoWatch, 'updatedAt'>) => void
  onPlaylistIds: (playlistId: string, videoIds: string[]) => void
  onAddCustom: (item: Watchable) => void
}

export function WatchView({
  videoProgress,
  playlistVideos,
  customWatch,
  initialId,
  onProgress,
  onPlaylistIds,
  onAddCustom,
}: WatchViewProps) {
  const items = useMemo(() => [...catalog, ...customWatch], [customWatch])
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [paste, setPaste] = useState('')
  const [pasteError, setPasteError] = useState('')
  const activeId = pickedId ?? initialId ?? items[0]?.id ?? ''

  const active = items.find((i) => i.id === activeId) ?? items[0]

  const handlePaste = (e: FormEvent) => {
    e.preventDefault()
    const parsed = parseYoutubeUrl(paste)
    if (!parsed) {
      setPasteError('Paste a YouTube video or playlist URL. Viki and Netflix cannot play here.')
      return
    }
    const youtubeId = parsed.kind === 'playlist' ? parsed.playlistId : parsed.videoId
    const item: Watchable = {
      id: `${parsed.kind}:${youtubeId}`,
      title: parsed.kind === 'playlist' ? 'Saved playlist' : 'Saved video',
      subtitle: 'Added by you',
      kind: parsed.kind,
      youtubeId,
      url: paste.trim(),
    }
    onAddCustom(item)
    setPickedId(item.id)
    setPaste('')
    setPasteError('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Watch</h2>
        <p className="text-sm text-ink-muted mt-1">
          Play study videos here so we can record how far you got. Licensed K-dramas stay on Viki
          or your usual app — we cannot embed those.
        </p>
      </div>

      {active && (
        <div className="space-y-3">
          <YoutubePlayer
            item={active}
            videoProgress={videoProgress}
            onProgress={onProgress}
            onPlaylistIds={onPlaylistIds}
          />
          <WatchStatus item={active} videoProgress={videoProgress} playlistVideos={playlistVideos} />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Library</p>
        {items.map((item) => {
          const summary = itemSummary(item, videoProgress, playlistVideos)
          const selected = item.id === active?.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPickedId(item.id)}
              className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                selected ? 'border-coral bg-coral/5' : 'border-cream-dark bg-white hover:bg-cream'
              }`}
            >
              <p className="text-sm font-semibold">{item.title}</p>
              {item.subtitle && <p className="text-xs text-ink-muted mt-0.5">{item.subtitle}</p>}
              <div className="mt-2 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                <div className="h-full bg-coral rounded-full" style={{ width: `${summary.percent}%` }} />
              </div>
              <p className="text-[11px] text-ink-muted mt-1">{summary.label}</p>
            </button>
          )
        })}
      </div>

      <form onSubmit={handlePaste} className="bg-white rounded-2xl border border-cream-dark p-4 space-y-3">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Add YouTube URL</p>
        <input
          type="url"
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          className="w-full px-4 py-3 bg-cream rounded-xl text-sm border-0 focus:ring-2 focus:ring-coral/30 outline-none"
        />
        {pasteError && <p className="text-xs text-coral">{pasteError}</p>}
        <button
          type="submit"
          className="w-full py-2.5 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-ink/90"
        >
          Track this video
        </button>
      </form>
    </div>
  )
}

function itemSummary(
  item: Watchable,
  videoProgress: Record<string, VideoWatch>,
  playlistVideos: Record<string, string[]>,
): { percent: number; label: string } {
  if (item.kind === 'playlist') {
    const ids = playlistVideos[item.youtubeId] ?? []
    if (ids.length === 0) return { percent: 0, label: 'Not started · play to discover videos' }
    const s = playlistWatchSummary(ids, videoProgress)
    return { percent: s.percent, label: `${s.done}/${s.total} videos at 80%+` }
  }
  const v = videoProgress[item.youtubeId]
  if (!v) return { percent: 0, label: 'Not started' }
  const percent = v.completed ? 100 : watchPercent(v.seconds, v.duration)
  return {
    percent,
    label: v.completed
      ? 'Complete'
      : `${formatClock(v.seconds)} / ${formatClock(v.duration)} · resume here`,
  }
}

function WatchStatus({
  item,
  videoProgress,
  playlistVideos,
}: {
  item: Watchable
  videoProgress: Record<string, VideoWatch>
  playlistVideos: Record<string, string[]>
}) {
  const summary = itemSummary(item, videoProgress, playlistVideos)
  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-4">
      <p className="font-display font-semibold">{item.title}</p>
      <p className="text-sm text-ink-muted mt-1">{summary.label}</p>
      {item.taskId === 'h1' && (
        <p className="text-xs text-ink-muted mt-2">
          Finish every video in this playlist (80%+) and Phase 1 task “Watch GO! Billy Korean Hangul
          playlist” checks off automatically.
        </p>
      )}
    </div>
  )
}
