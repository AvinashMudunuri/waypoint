import { useEffect, useState, type FormEvent } from 'react'
import type { DramaPhrase } from '../types'
import type { LanguagePack } from '../data/pack'
import { SpeakButton } from './SpeakButton'
import { exportPhrasesToAnki, exportPhrasesToCsv } from '../utils/ankiExport'
import { isSpeechAvailable, warmSpeechVoices } from '../utils/speech'

interface DramaViewProps {
  phrases: DramaPhrase[]
  onAdd: (phrase: Omit<DramaPhrase, 'id' | 'createdAt'>) => void
  onRemove: (id: string) => void
  pack: LanguagePack
}

export function DramaView({ phrases, onAdd, onRemove, pack }: DramaViewProps) {
  const [korean, setKorean] = useState('')
  const [english, setEnglish] = useState('')
  const [show, setShow] = useState('')
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [exportMsg, setExportMsg] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const canSpeak = isSpeechAvailable()

  useEffect(() => {
    warmSpeechVoices()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!korean.trim() || !english.trim()) return
    onAdd({ korean: korean.trim(), english: english.trim(), show: show.trim() || 'Unknown', notes: notes.trim() || undefined })
    setKorean('')
    setEnglish('')
    setShow('')
    setNotes('')
    setExpanded(false)
  }

  const handleExport = (format: 'anki' | 'csv') => {
    if (format === 'anki') exportPhrasesToAnki(phrases, pack)
    else exportPhrasesToCsv(phrases, pack)
    setExportMsg(`Exported ${phrases.length} phrase${phrases.length !== 1 ? 's' : ''} as ${format === 'anki' ? 'Anki' : 'CSV'}`)
    setTimeout(() => setExportMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">{pack.phraseTitle}</h2>
        <p className="text-sm text-ink-muted mt-1">{pack.phraseHint}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-dark p-5 space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder={pack.phrasePlaceholder}
            value={korean}
            onChange={(e) => setKorean(e.target.value)}
            className="w-full px-4 py-3 bg-cream rounded-xl text-sm border-0 focus:ring-2 focus:ring-coral/30 outline-none"
            required
          />
          <input
            type="text"
            placeholder="English meaning (e.g. Really?)"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            className="w-full px-4 py-3 bg-cream rounded-xl text-sm border-0 focus:ring-2 focus:ring-coral/30 outline-none"
            required
          />
          {expanded && (
            <>
              <input
                type="text"
                placeholder={pack.showPlaceholder}
                value={show}
                onChange={(e) => setShow(e.target.value)}
                className="w-full px-4 py-3 bg-cream rounded-xl text-sm border-0 focus:ring-2 focus:ring-coral/30 outline-none"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-cream rounded-xl text-sm border-0 focus:ring-2 focus:ring-coral/30 outline-none"
              />
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90 transition-colors"
          >
            Save phrase
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-3 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </form>

      {phrases.length > 0 && (
        <div className="bg-white rounded-2xl border border-cream-dark p-4 space-y-3">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Export to flashcards</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('anki')}
              className="flex-1 py-2.5 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              Export for Anki
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex-1 py-2.5 border border-cream-dark rounded-xl text-sm font-semibold hover:bg-cream transition-colors"
            >
              Export CSV
            </button>
          </div>
          {exportMsg && <p className="text-xs text-sage font-semibold text-center">{exportMsg}</p>}
          <p className="text-[10px] text-ink-muted">
            Anki: File → Import → select the downloaded .txt file. Deck name: "Waypoint Korean Phrases"
          </p>
        </div>
      )}

      {phrases.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          <p className="text-4xl mb-3">▶</p>
          <p className="text-sm">No phrases yet. Start watching with Korean subtitles!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            {phrases.length} phrase{phrases.length !== 1 ? 's' : ''} collected
          </p>
          {phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white rounded-2xl border border-cream-dark p-4 flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-ink">{phrase.korean}</p>
                  {canSpeak && (
                    <SpeakButton
                      text={phrase.korean}
                      lang={pack.speechLang}
                      label={`Pronounce ${phrase.korean}`}
                      className="w-8 h-8"
                      playing={playingId === phrase.id}
                      onPlaying={(on) => setPlayingId(on ? phrase.id : null)}
                    />
                  )}
                </div>
                <p className="text-sm text-ink-muted">{phrase.english}</p>
                <p className="text-xs text-ink-muted mt-1">
                  {phrase.show}
                  {phrase.notes && ` · ${phrase.notes}`}
                </p>
              </div>
              <button
                onClick={() => onRemove(phrase.id)}
                className="text-ink-muted hover:text-coral text-sm shrink-0"
                aria-label="Remove phrase"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
