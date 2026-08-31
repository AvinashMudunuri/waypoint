import { useEffect, useRef } from 'react'
import type { VideoWatch, Watchable } from '../types'
import { loadYoutubeApi } from '../utils/youtubeApi'

interface YoutubePlayerProps {
  item: Watchable
  videoProgress: Record<string, VideoWatch>
  onProgress: (videoId: string, patch: Omit<VideoWatch, 'updatedAt'>) => void
  onPlaylistIds?: (playlistId: string, videoIds: string[]) => void
}

function snapshot(player: YT.Player, completed: boolean) {
  const data = player.getVideoData()
  const videoId = data.video_id
  if (!videoId) return null
  return {
    videoId,
    seconds: player.getCurrentTime() || 0,
    duration: player.getDuration() || 0,
    title: data.title,
    completed,
  }
}

export function YoutubePlayer({ item, videoProgress, onProgress, onPlaylistIds }: YoutubePlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const progressRef = useRef(videoProgress)
  const onProgressRef = useRef(onProgress)
  const onPlaylistRef = useRef(onPlaylistIds)

  useEffect(() => {
    progressRef.current = videoProgress
    onProgressRef.current = onProgress
    onPlaylistRef.current = onPlaylistIds
  })

  useEffect(() => {
    let cancelled = false
    let poll: number | undefined

    const report = (player: YT.Player, completed: boolean) => {
      const snap = snapshot(player, completed)
      if (!snap) return
      onProgressRef.current(snap.videoId, {
        seconds: snap.seconds,
        duration: snap.duration,
        completed: snap.completed,
        title: snap.title,
      })
    }

    const rememberList = (player: YT.Player) => {
      if (item.kind !== 'playlist') return
      const ids = player.getPlaylist()
      if (ids?.length) onPlaylistRef.current?.(item.youtubeId, ids)
    }

    const mount = async () => {
      await loadYoutubeApi()
      if (cancelled || !hostRef.current) return
      hostRef.current.replaceChildren()
      const mount = document.createElement('div')
      mount.style.width = '100%'
      mount.style.height = '100%'
      hostRef.current.appendChild(mount)

      const playerVars: Record<string, string | number> = {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: window.location.origin,
      }

      const options: YT.PlayerOptions = {
        width: '100%',
        height: '100%',
        playerVars,
        events: {
          onReady: (e) => {
            if (item.kind === 'playlist') {
              e.target.cuePlaylist({ list: item.youtubeId, listType: 'playlist' })
            } else {
              e.target.cueVideoById(item.youtubeId)
            }
            rememberList(e.target)
            const data = e.target.getVideoData()
            const saved = data.video_id ? progressRef.current[data.video_id] : undefined
            if (saved && saved.seconds > 3 && !saved.completed) {
              e.target.seekTo(saved.seconds, true)
            }
          },
          onStateChange: (e) => {
            rememberList(e.target)
            const playing = window.YT?.PlayerState.PLAYING
            const ended = window.YT?.PlayerState.ENDED
            const paused = window.YT?.PlayerState.PAUSED
            if (e.data === playing) {
              window.clearInterval(poll)
              poll = window.setInterval(() => report(e.target, false), 4000)
              report(e.target, false)
            } else if (e.data === ended) {
              window.clearInterval(poll)
              report(e.target, true)
            } else if (e.data === paused) {
              window.clearInterval(poll)
              report(e.target, false)
            }
          },
        },
      }

      playerRef.current = new window.YT!.Player(mount, options)
    }

    void mount()

    return () => {
      cancelled = true
      window.clearInterval(poll)
      if (playerRef.current) {
        try {
          report(playerRef.current, false)
          playerRef.current.destroy()
        } catch {
          /* player may already be gone */
        }
        playerRef.current = null
      }
    }
  }, [item.id, item.kind, item.youtubeId])

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ink">
      <div ref={hostRef} className="h-full w-full" />
    </div>
  )
}
