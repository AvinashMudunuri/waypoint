import { useCallback, useMemo, useState } from 'react'
import {
  type HangulChar,
  type QuizMode,
  type QuizSet,
  getCharSet,
  hangulConsonants,
  hangulVowels,
  pickRandom,
} from '../data/hangul'

interface HangulViewProps {
  stats: { correct: number; total: number; streak: number }
  onAnswer: (correct: boolean) => void
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

export function HangulView({ stats, onAnswer }: HangulViewProps) {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn')
  const [quizMode, setQuizMode] = useState<QuizMode>('char-to-sound')
  const [quizSet, setQuizSet] = useState<QuizSet>('consonants')
  const [question, setQuestion] = useState<Question>(() => buildQuestion('char-to-sound', 'consonants'))
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion(quizMode, quizSet))
    setSelected(null)
    setFeedback(null)
  }, [quizMode, quizSet])

  const handleSelect = (option: string) => {
    if (selected) return
    setSelected(option)
    const isCorrect = option === question.correctAnswer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    onAnswer(isCorrect)
  }

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
              Learn the alphabet in a week. Study the chart, then test yourself.
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
                <div key={c.char} className="p-3 bg-cream rounded-xl text-center">
                  <p className="text-3xl font-bold text-ink">{c.char}</p>
                  <p className="text-sm font-semibold text-coral mt-1">{c.romanization}</p>
                  {c.hint && <p className="text-[10px] text-ink-muted mt-1 leading-tight">{c.hint}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-sage-light/50 rounded-2xl p-5 border border-sage/20">
          <h3 className="font-display font-semibold text-sage mb-2">How Hangul works</h3>
          <p className="text-sm text-ink-muted">
            Letters are grouped into syllable blocks. Each block has a consonant + vowel
            (e.g. ㄱ + ㅏ = 가 "ga"). Once you know the 14 consonants and 10 vowels,
            you can read any Korean word.
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
            {stats.correct}/{stats.total} correct · {accuracy}% · streak {stats.streak}
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
        <p className="font-display text-6xl font-bold text-ink py-4">{question.prompt}</p>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => {
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
