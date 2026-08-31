export const WATCH_COMPLETE_RATIO = 0.8

export type YoutubeTarget =
  | { kind: 'video'; videoId: string }
  | { kind: 'playlist'; playlistId: string; videoId?: string }

export function parseYoutubeUrl(input: string): YoutubeTarget | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  try {
    const url = trimmed.includes('://')
      ? new URL(trimmed)
      : new URL(`https://${trimmed}`)
    const host = url.hostname.replace(/^www\./, '')

    if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'youtu.be' && host !== 'youtube-nocookie.com') {
      return null
    }

    const list = url.searchParams.get('list')
    const videoFromQuery = url.searchParams.get('v')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      if (!id) return null
      return list ? { kind: 'playlist', playlistId: list, videoId: id } : { kind: 'video', videoId: id }
    }

    if (url.pathname.startsWith('/playlist') && list) {
      return { kind: 'playlist', playlistId: list }
    }

    const embed = url.pathname.match(/^\/embed\/([^/]+)/)
    if (embed?.[1]) {
      return list
        ? { kind: 'playlist', playlistId: list, videoId: embed[1] }
        : { kind: 'video', videoId: embed[1] }
    }

    if (videoFromQuery) {
      return list
        ? { kind: 'playlist', playlistId: list, videoId: videoFromQuery }
        : { kind: 'video', videoId: videoFromQuery }
    }

    if (list) return { kind: 'playlist', playlistId: list }
  } catch {
    return null
  }

  return null
}

export function watchPercent(seconds: number, duration: number): number {
  if (duration <= 0) return 0
  return Math.min(100, Math.round((seconds / duration) * 100))
}

export function isWatchComplete(seconds: number, duration: number): boolean {
  if (duration <= 0) return false
  return seconds / duration >= WATCH_COMPLETE_RATIO
}

export function playlistWatchSummary(
  videoIds: string[],
  videos: Record<string, { completed?: boolean; seconds?: number; duration?: number }>,
): { done: number; total: number; percent: number } {
  const total = videoIds.length
  if (total === 0) return { done: 0, total: 0, percent: 0 }
  const done = videoIds.filter((id) => {
    const v = videos[id]
    if (!v) return false
    return v.completed || isWatchComplete(v.seconds ?? 0, v.duration ?? 0)
  }).length
  return { done, total, percent: Math.round((done / total) * 100) }
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toString().padStart(2, '0')}`
}
