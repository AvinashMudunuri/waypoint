import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('waypoint-install-dismissed') === 'true'
      || localStorage.getItem('korean-path-install-dismissed') === 'true'
  })
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isInstalled || dismissed || !deferredPrompt) return null

  const handleInstall = async () => {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('waypoint-install-dismissed', 'true')
  }

  return (
    <div className="bg-ink text-white rounded-2xl p-4 flex items-center gap-3 mb-4">
      <span className="text-2xl shrink-0">📲</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Install Waypoint</p>
        <p className="text-xs text-white/70">Add to your home screen for quick access</p>
      </div>
      <button
        onClick={handleInstall}
        className="px-3 py-1.5 bg-coral rounded-lg text-xs font-semibold shrink-0 hover:bg-coral/90"
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        className="text-white/50 hover:text-white text-sm shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
