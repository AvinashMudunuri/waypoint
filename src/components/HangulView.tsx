import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type HangulChar,
  type QuizMode,
  type QuizSet,
  getCharSet,
  hangulConsonants,
  hangulVowels,
  pickRandom,
  spokenHangul,
} from '../data/hangul'
import { SpeakButton } from './SpeakButton'
import { isSpeechAvailable, speakKorean, warmSpeechVoices } from '../utils/speech'
import { hangulRecentStats } from '../utils/progressHonesty'

interface HangulViewProps {
  stats: { correct: number; total: number; streak: number; recent?: boolean[] }
  onAnswer: (correct: boolean) => void
  startInQuiz?: boolean
}

interface Question {
  target: HangulChar
  options: string[]
  correctAnswer: string
  prompt: string
  promptLabel: string
}

function buildQuestion(mode: QuizMode, set: QuizSet): Question {
  const chars = getCharSet(set)
  const target = chars[Math.floor(Math.random() * chars.length)]

  if (mode === 'char-to-sound') {
    const distractors = pickRandom(
      chars.map((c) => c.romanization),
      3,
      target.romanization,
    )
    const options = [target.romanization, ...distractors].sort(() => Math.random() - 0.5)
    return {
      target,
      options,
      correctAnswer: target.romanization,
      prompt: target.char,
      promptLabel: 'What sound does this make?',
    }
  }

  const distractors = pickRandom(
    chars.map((c) => c.char),
    3,
    target.char,
  )
  const options = [target.char, ...distractors].sort(() => Math.random() - 0.5)
  return {
    target,
    options,
    correctAnswer: target.char,
    prompt: target.romanization,
    promptLabel: 'Which character makes this sound?',
  }
}

export function HangulView({ stats, onAnswer, startInQuiz = false }: HangulViewProps) {
  const [mode, setMode] = useState<'learn' | 'quiz'>(startInQuiz ? 'quiz' : 'learn')
  const [quizMode, setQuizMode] = useState<QuizMode>('char-to-sound')
  const [quizSet, setQuizSet] = useState<QuizSet>('consonants')
  const [question, setQuestion] = useState<Question>(() => buildQuestion('char-to-sound', 'consonants'))
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [playingKey, setPlayingKey] = useState<string | null>(null)

  const recent = hangulRecentStats(stats.recent ?? [])
  const canSpeak = isSpeechAvailable()

  const play = (key: string, text: string) => {
    setPlayingKey(key)
    speakKorean(text, {
      onStart: () => setPlayingKey(key),
      onEnd: () => setPlayingKey((cur) => (cur === key ? null : cur)),
    })
  }

  useEffect(() => {
    warmSpeechVoices()
  }, [])

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion(quizMode, quizSet))
    setSelected(null)
    setFeedback(null)
  }, [quizMode, quizSet])

  const handleSelect = useCallback((option: string) => {
    if (selected) return
    setSelected(option)
    const isCorrect = option === question.correctAnswer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    onAnswer(isCorrect)
  }, [selected, question, onAnswer])

  const handleModeChange = (newMode: QuizMode) => {
    setQuizMode(newMode)
    setQuestion(buildQuestion(newMode, quizSet))
    setSelected(null)
    setFeedback(null)
  }

  const handleSetChange = (newSet: QuizSet) => {
    setQuizSet(newSet)
    setQuestion(buildQuestion(quizMode, newSet))
    setSelected(null)
    setFeedback(null)
  }

  useEffect(() => {
    if (mode !== 'quiz') return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const n = Number(e.key)
      if (n >= 1 && n <= 4 && question.options[n - 1]) {
        e.preventDefault()
        handleSelect(question.options[n - 1])
        return
      }
      if ((e.key === 'Enter' || e.key === ' ') && feedback) {
        e.preventDefault()
        nextQuestion()
        return
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        play(question.target.char, spokenHangul(question.target))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, question, feedback, nextQuestion, handleSelect])

  const chartSections = useMemo(
    () => [
      { title: 'Consonants (자음)', chars: hangulConsonants },
      { title: 'Vowels (모음)', chars: hangulVowels },
    ],
    [],
  )

  if (mode === 'learn') {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Hangul Practice</h2>
            <p className="text-sm text-ink-muted mt-1">
              Tap the speaker. On iPhone the silent/ringer switch often mutes this voice
              even when media (YouTube) still plays — use headphones, or turn the ringer on.
            </p>
          </div>
          <button
            onClick={() => setMode('quiz')}
            className="px-4 py-2 bg-coral text-white rounded-xl text-sm font-semibold shrink-0 hover:bg-coral/90"
          >
            Start quiz
          </button>
        </div>

        {chartSections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-cream-dark p-5">
            <h3 className="font-display font-semibold mb-3">{section.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {section.chars.map((c) => (
                <button
                  key={c.char}
                  type="button"
                  onClick={() => canSpeak && play(c.char, spokenHangul(c))}
                  className={`p-3 bg-cream rounded-xl text-center hover:bg-cream-dark transition-colors ${
                    playingKey === c.char ? 'ring-2 ring-coral bg-coral/5' : ''
                  }`}
                  aria-label={
                    canSpeak
                      ? `Pronounce ${c.char}, ${c.romanization}`
                      : `${c.char}, ${c.romanization}`
                  }
                  aria-pressed={playingKey === c.char}
                >
                  <p className="text-3xl font-bold text-ink">{c.char}</p>
                  <p className="text-sm font-semibold text-coral mt-1">{c.romanization}</p>
                  {canSpeak && (
                    <span className="mt-1 inline-flex justify-center text-coral" aria-hidden>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.74 2.5-2.26 2.5-4.02z" />
                      </svg>
                    </span>
                  )}
                  {c.hint && <p className="text-[10px] text-ink-muted mt-1 leading-tight">{c.hint}</p>}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-sage-light/50 rounded-2xl p-5 border border-sage/20">
          <h3 className="font-display font-semibold text-sage mb-2">How Hangul works</h3>
          <p className="text-sm text-ink-muted">
            A block is onset + vowel (+ optional batchim). About 40 pieces, not thousands
            of characters. ㄱ + ㅏ = 가.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Hangul Quiz</h2>
          <p className="text-sm text-ink-muted mt-1">
            {recent.sample === 0
              ? 'No recent answers yet'
              : `Last ${recent.sample}: ${recent.percent}% · streak ${stats.streak}`}
            {recent.sample > 0 && recent.sample < 10 && ' · need 10 to count'}
          </p>
        </div>
        <button
          onClick={() => setMode('learn')}
          className="px-4 py-2 border border-cream-dark rounded-xl text-sm font-semibold shrink-0 hover:bg-cream"
        >
          Chart
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['char-to-sound', 'sound-to-char'] as QuizMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              quizMode === m ? 'bg-coral text-white' : 'bg-cream text-ink-muted hover:text-ink'
            }`}
          >
            {m === 'char-to-sound' ? 'Char → Sound' : 'Sound → Char'}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['consonants', 'vowels', 'syllables', 'all'] as QuizSet[]).map((s) => (
          <button
            key={s}
            onClick={() => handleSetChange(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              quizSet === s ? 'bg-ink text-white' : 'bg-cream text-ink-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark p-6 text-center space-y-4">
        <p className="text-sm text-ink-muted">{question.promptLabel}</p>
        <div className="flex items-center justify-center gap-3 py-4">
          <p className="font-display text-6xl font-bold text-ink">{question.prompt}</p>
          {canSpeak && (
            <SpeakButton
              text={spokenHangul(question.target)}
              label={`Pronounce ${question.target.char}`}
              className="w-11 h-11 bg-cream"
              playing={playingKey === question.target.char}
              onPlaying={(on) => setPlayingKey(on ? question.target.char : null)}
            />
          )}
        </div>

        <p className="text-[11px] text-ink-muted">Keys 1–4 answer · P hear · Enter next</p>
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            let style = 'bg-cream hover:bg-cream-dark text-ink'
            if (selected) {
              if (option === question.correctAnswer) {
                style = 'bg-sage-light text-sage border-2 border-sage'
              } else if (option === selected) {
                style = 'bg-coral/10 text-coral border-2 border-coral'
              } else {
                style = 'bg-cream text-ink-muted opacity-50'
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={!!selected}
                className={`py-4 rounded-xl text-lg font-semibold transition-colors ${style}`}
              >
                <span className="block text-[10px] text-ink-muted font-normal">{i + 1}</span>
                {option}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="space-y-3">
            <p className={`text-sm font-semibold ${feedback === 'correct' ? 'text-sage' : 'text-coral'}`}>
              {feedback === 'correct' ? 'Correct!' : `Not quite — it's ${question.correctAnswer}`}
              {question.target.hint && feedback === 'wrong' && (
                <span className="block font-normal text-ink-muted mt-1">{question.target.hint}</span>
              )}
            </p>
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
