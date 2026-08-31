export {}

declare global {
  interface Window {
    YT?: typeof YT
    onYouTubeIframeAPIReady?: () => void
  }

  namespace YT {
    class Player {
      constructor(el: string | HTMLElement, options: PlayerOptions)
      destroy(): void
      getCurrentTime(): number
      getDuration(): number
      getPlaylist(): string[] | undefined
      getPlaylistIndex(): number
      getVideoData(): { video_id?: string; title?: string }
      seekTo(seconds: number, allowSeekAhead: boolean): void
    }

    interface PlayerOptions {
      width?: string | number
      height?: string | number
      videoId?: string
      playerVars?: Record<string, string | number>
      events?: {
        onReady?: (e: { target: Player }) => void
        onStateChange?: (e: { data: number; target: Player }) => void
      }
    }

    const PlayerState: {
      UNSTARTED: number
      ENDED: number
      PLAYING: number
      PAUSED: number
      BUFFERING: number
      CUED: number
    }
  }
}
