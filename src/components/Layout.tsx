import type { ReactNode } from 'react'
import type { Tab } from '../types'

interface LayoutProps {
  children: ReactNode
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

function IconToday() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLearn() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V7.5A1.5 1.5 0 0 1 5.5 6H12v13H5.5A1.5 1.5 0 0 1 4 17.5V19Zm8-13h6.5A1.5 1.5 0 0 1 20 7.5V19h-8V6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLog() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7h10M7 12h10M7 17h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconPath() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 5v2.5M12 16.5V19M5 12h2.5M16.5 12H19"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

const tabs: { id: Tab; label: string; icon: typeof IconToday }[] = [
  { id: 'today', label: 'Today', icon: IconToday },
  { id: 'learn', label: 'Learn', icon: IconLearn },
  { id: 'log', label: 'Log', icon: IconLog },
  { id: 'path', label: 'Path', icon: IconPath },
]

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream-dark bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-ink tracking-tight">
              Waypoint
            </h1>
            <p className="text-xs text-ink-muted">Korean · Honest milestones</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-t border-cream-dark" aria-label="Primary">
        <div className="max-w-3xl mx-auto flex">
          {tabs.map((tab) => {
            const current = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={current ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
                  current ? 'text-coral font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
