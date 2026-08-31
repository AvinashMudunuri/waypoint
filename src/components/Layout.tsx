import type { ReactNode } from 'react'
import type { Tab } from '../types'

interface LayoutProps {
  children: ReactNode
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '⌂' },
  { id: 'learn', label: 'Learn', icon: '가' },
  { id: 'log', label: 'Log', icon: '☰' },
  { id: 'path', label: 'Path', icon: '◈' },
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
                <span className="text-lg leading-none" aria-hidden>{tab.icon}</span>
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
