import { useEffect, useMemo, useState } from 'react'
import { germanSounds, pickRandom as pickGerman } from '../data/germanSounds.ts'
import { hangulConsonants, pickRandom, spokenHangul, type HangulChar } from '../data/hangul.ts'
import type { LanguagePack } from '../data/pack.ts'
import { isSpeechAvailable, speakKorean, warmSpeechVoices } from '../utils/speech.ts'
import {
  leftoverCopy,
  SESSION_SIZE,
  type SessionSnapshot,
} from '../utils/progressHonesty.ts'
import { SpeakButton } from './SpeakButton.tsx'

interface TodaySessionProps {
  pack: LanguagePack
  recent: boolean[]
  session: SessionSnapshot
  onAnswer: (correct: boolean) => void
  onWatch: () => void
}

interface SessionQuestion {
  prompt: string
  promptLabel: string
  options: string[]
  correctAnswer: string
  spoken: string
  glyph: string
}

function buildKoreanQuestion(): SessionQuestion {
  const target: HangulChar = hangulConsonants[Math.floor(Math.random() * hangulConsonants.length)]
  const distractors = pickRandom(
    hangulConsonants.map((c) => c.romanization),
    3,
    target.romanization,
  )
  return {
    prompt: target.char,
    promptLabel: 'What sound does this make?',
    options: [target.romanization, ...distractors].sort(() => Math.random() - 0.5),
    correctAnswer: target.romanization,
    spoken: spokenHangul(target),
    glyph: target.char,
  }
}

function buildGermanQuestion(): SessionQuestion {
  const target = germanSounds[Math.floor(Math.random() * germanSounds.length)]
  const distractors = pickGerman(
    germanSounds.map((s) => s.romanization),
    3,
    target.romanization,
  )
  return {
    prompt: target.char,
    promptLabel: 'What sound is this?',
    options: [target.romanization, ...distractors].sort(() => Math.random() - 0.5),
    correctAnswer: target.romanization,
    spoken: target.speak,
    glyph: target.char,
  }
}

export function TodaySession({ pack, recent, session, onAnswer, onWatch }: TodaySessionProps) {
  const canSpeak = isSpeechAvailable()
  const [heard, setHeard] = useState<string[]>([])
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [question, setQuestion] = useState<SessionQuestion>(() =>
    pack.code === 'de' ? buildGermanQuestion() : buildKoreanQuestion(),
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    warmSpeechVoices()
  }, [])

  const startOnQuiz = session.answers > 0 && !session.closed
  const [step, setStep] = useState<'hear' | 'quiz'>(startOnQuiz || !canSpeak ? 'quiz' : 'hear')

  const leftover = leftoverCopy(recent, pack.scriptLabel)
  const heardAll = pack.sessionSeeds.every((s) => heard.includes(s.glyph))

  const play = (key: string, text: string) => {
    setPlayingKey(key)
    setHeard((prev) => (prev.includes(key) ? prev : [...prev, key]))
    speakKorean(text, {
      lang: pack.speechLang,
      onStart: () => setPlayingKey(key),
      onEnd: () => setPlayingKey((cur) => (cur === key ? null : cur)),
    })
  }

  const nextQuestion = () => {
    setSelected(null)
    setFeedback(null)
    if (session.answers >= SESSION_SIZE) return
    setQuestion(pack.code === 'de' ? buildGermanQuestion() : buildKoreanQuestion())
  }

  const handleSelect = (option: string) => {
    if (selected) return
    setSelected(option)
    const ok = option === question.correctAnswer
    setFeedback(ok ? 'correct' : 'wrong')
    onAnswer(ok)
  }

  const questionNumber = useMemo(() => {
    if (feedback) return Math.min(session.answers, SESSION_SIZE)
    return Math.min(session.answers + 1, SESSION_SIZE)
  }, [feedback, session.answers])

  const showDone = session.closed && !feedback

  if (showDone) {
    return (
      <section className="bg-white rounded-2xl p-5 border border-coral/25 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-coral">Today’s five</p>
        <h3 className="font-display text-2xl font-bold">That’s enough for today</h3>
        <p className="text-sm text-ink-muted">{leftover}</p>
        <p className="text-sm text-ink-muted">
          Not a streak. You stopped on purpose so there is a reason to open this tomorrow.
        </p>
        <button
          type="button"
          onClick={onWatch}
          className="w-full py-3 border border-cream-dark rounded-xl font-semibold text-sm hover:bg-cream transition-colors"
        >
          {pack.code === 'de' ? 'Watch Easy German if you have time' : 'Watch Hangul if you have time'}
        </button>
      </section>
    )
  }

  if (step === 'hear') {
    return (
      <section className="bg-white rounded-2xl p-5 border border-coral/25 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-coral">Day one</p>
        <h3 className="font-display text-2xl font-bold">Hear {pack.scriptLabel} first</h3>
        <p className="text-sm text-ink-muted">
          Tap each one. Then five questions. The playlist can wait.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {pack.sessionSeeds.map((seed) => (
            <button
              key={seed.glyph}
              type="button"
              onClick={() => play(seed.glyph, seed.spoken)}
              className={`p-3 rounded-xl text-center transition-colors ${
                playingKey === seed.glyph
                  ? 'ring-2 ring-coral bg-coral/5'
                  : heard.includes(seed.glyph)
                    ? 'bg-sage-light/60'
                    : 'bg-cream hover:bg-cream-dark'
              }`}
              aria-label={`Hear ${seed.glyph}, ${seed.romanization}`}
              aria-pressed={playingKey === seed.glyph}
            >
              <p className="text-3xl font-bold">{seed.glyph}</p>
              <p className="text-xs font-semibold text-coral mt-1">{seed.romanization}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStep('quiz')}
          disabled={canSpeak && !heardAll}
          className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {heardAll || !canSpeak ? 'Five questions' : 'Hear all three first'}
        </button>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl p-5 border border-coral/25 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">
            Today’s five · {questionNumber}/{SESSION_SIZE}
          </p>
          <h3 className="font-display text-xl font-bold mt-1">{question.promptLabel}</h3>
        </div>
        {canSpeak && (
          <SpeakButton
            text={question.spoken}
            lang={pack.speechLang}
            label={`Pronounce ${question.glyph}`}
            className="w-11 h-11 bg-cream shrink-0"
            playing={playingKey === question.glyph}
            onPlaying={(on) => setPlayingKey(on ? question.glyph : null)}
          />
        )}
      </div>

      <p className="font-display text-6xl font-bold text-center py-2">{question.prompt}</p>

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
              type="button"
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
            {feedback === 'correct' ? 'Correct!' : `Not quite — it’s ${question.correctAnswer}`}
          </p>
          <button
            type="button"
            onClick={nextQuestion}
            className="w-full py-3 bg-coral text-white rounded-xl font-semibold text-sm hover:bg-coral/90"
          >
            {session.answers >= SESSION_SIZE ? 'That’s enough' : 'Next →'}
          </button>
        </div>
      )}
    </section>
  )
}
