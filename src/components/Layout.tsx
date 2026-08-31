import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'phases', label: 'Phases', icon: '◈' },
  { id: 'hangul', label: 'Hangul', icon: '가' },
  { id: 'routine', label: 'Routine', icon: '☰' },
  { id: 'drama', label: 'Drama', icon: '▶' },
  { id: 'milestones', label: 'Goals', icon: '◎' },
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
          <span className="text-2xl" aria-hidden>한</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-cream-dark">
        <div className="max-w-3xl mx-auto flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[56px] flex flex-col items-center gap-0.5 py-2.5 text-[10px] transition-colors ${
                activeTab === tab.id
                  ? 'text-coral font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
