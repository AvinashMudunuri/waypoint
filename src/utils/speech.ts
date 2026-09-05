let voicesWarmed = false
let currentUtterance: SpeechSynthesisUtterance | null = null

export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function warmSpeechVoices(): void {
  if (!isSpeechAvailable() || voicesWarmed) return
  voicesWarmed = true
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}

function voiceFor(lang: string): SpeechSynthesisVoice | undefined {
  const prefix = lang.slice(0, 2).toLowerCase()
  return window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith(prefix))
}

export function speakKorean(
  text: string,
  handlers?: { onStart?: () => void; onEnd?: () => void; lang?: string },
): void {
  const trimmed = text.trim()
  if (!trimmed || !isSpeechAvailable()) {
    handlers?.onEnd?.()
    return
  }

  const lang = handlers?.lang ?? 'ko-KR'
  window.speechSynthesis.cancel()
  currentUtterance = new SpeechSynthesisUtterance(trimmed)
  currentUtterance.lang = lang
  currentUtterance.rate = 0.85
  const voice = voiceFor(lang)
  if (voice) currentUtterance.voice = voice

  currentUtterance.onstart = () => handlers?.onStart?.()
  const finish = () => {
    currentUtterance = null
    handlers?.onEnd?.()
  }
  currentUtterance.onend = finish
  currentUtterance.onerror = finish

  window.speechSynthesis.speak(currentUtterance)
  window.speechSynthesis.resume()
}
