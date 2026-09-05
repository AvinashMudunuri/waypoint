import { useCallback, useEffect, useState } from 'react'
import { germanSounds, pickRandom } from '../data/germanSounds.ts'
import { SpeakButton } from './SpeakButton.tsx'
import { isSpeechAvailable, speakKorean, warmSpeechVoices } from '../utils/speech.ts'
import { hangulRecentStats } from '../utils/progressHonesty.ts'

interface GermanSoundsViewProps {
  stats: { correct: number; total: number; streak: number; recent?: boolean[] }
  onAnswer: (correct: boolean) => void
  startInQuiz?: boolean
}

export function GermanSoundsView({ stats, onAnswer, startInQuiz = false }: GermanSoundsViewProps) {
  const [mode, setMode] = useState<'learn' | 'quiz'>(startInQuiz ? 'quiz' : 'learn')
  const [index, setIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const recent = hangulRecentStats(stats.recent ?? [])
  const canSpeak = isSpeechAvailable()
  const target = germanSounds[index]

  const build = useCallback((i: number) => {
    const t = germanSounds[i]
    const distractors = pickRandom(
      germanSounds.map((s) => s.romanization),
      3,
      t.romanization,
    )
    setOptions([t.romanization, ...distractors].sort(() => Math.random() - 0.5))
    setSelected(null)
    setFeedback(null)
  }, [])

  useEffect(() => {
    warmSpeechVoices()
    build(0)
  }, [build])

  const play = (key: string, text: string) => {
    setPlayingKey(key)
    speakKorean(text, {
      lang: 'de-DE',
      onStart: () => setPlayingKey(key),
      onEnd: () => setPlayingKey((cur) => (cur === key ? null : cur)),
    })
  }

  const handleSelect = (option: string) => {
    if (selected) return
    setSelected(option)
    const ok = option === target.romanization
    setFeedback(ok ? 'correct' : 'wrong')
    onAnswer(ok)
  }

  const next = () => {
    const i = Math.floor(Math.random() * germanSounds.length)
    setIndex(i)
    build(i)
  }

  if (mode === 'learn') {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">German sounds</h2>
            <p className="text-sm text-ink-muted mt-1">
              You already know the Latin alphabet. These are the bits English does not prepare you for.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className="px-4 py-2 bg-coral text-white rounded-xl text-sm font-semibold shrink-0 hover:bg-coral/90"
          >
            Start quiz
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {germanSounds.map((s) => (
            <button
              key={s.char}
              type="button"
              onClick={() => canSpeak && play(s.char, s.speak)}
              className={`p-3 bg-cream rounded-xl text-center hover:bg-cream-dark ${
                playingKey === s.char ? 'ring-2 ring-coral' : ''
              }`}
            >
              <p className="text-2xl font-bold">{s.char}</p>
              <p className="text-sm font-semibold text-coral mt-1">{s.romanization}</p>
              {s.hint && <p className="text-[10px] text-ink-muted mt-1">{s.hint}</p>}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Sounds quiz</h2>
          <p className="text-sm text-ink-muted mt-1">
            {recent.sample === 0 ? 'No recent answers yet' : `Last ${recent.sample}: ${recent.percent}%`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode('learn')}
          className="px-4 py-2 border border-cream-dark rounded-xl text-sm font-semibold"
        >
          Chart
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-cream-dark p-6 text-center space-y-4">
        <p className="text-sm text-ink-muted">How do you produce this?</p>
        <div className="flex items-center justify-center gap-3 py-4">
          <p className="font-display text-5xl font-bold">{target.char}</p>
          {canSpeak && (
            <SpeakButton
              text={target.speak}
              lang="de-DE"
              label={`Pronounce ${target.speak}`}
              className="w-11 h-11 bg-cream"
              playing={playingKey === target.char}
              onPlaying={(on) => setPlayingKey(on ? target.char : null)}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            let style = 'bg-cream hover:bg-cream-dark text-ink'
            if (selected) {
              if (option === target.romanization) style = 'bg-sage-light text-sage border-2 border-sage'
              else if (option === selected) style = 'bg-coral/10 text-coral border-2 border-coral'
              else style = 'bg-cream text-ink-muted opacity-50'
            }
            return (
              <button
                key={option}
                type="button"
                disabled={!!selected}
                onClick={() => handleSelect(option)}
                className={`py-4 rounded-xl text-sm font-semibold ${style}`}
              >
                {option}
              </button>
            )
          })}
        </div>
        {feedback && (
          <button
            type="button"
            onClick={next}
            className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
