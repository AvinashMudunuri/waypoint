let loading: Promise<void> | null = null

export function loadYoutubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.YT?.Player) return Promise.resolve()
  if (loading) return loading

  loading = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-yt-iframe-api]')
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.ytIframeApi = '1'
      script.onerror = () => reject(new Error('YouTube API failed to load'))
      document.head.appendChild(script)
    }
  })

  return loading
}
