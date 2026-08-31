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

function koreanVoice(): SpeechSynthesisVoice | undefined {
  return window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith('ko'))
}

export function speakKorean(
  text: string,
  handlers?: { onStart?: () => void; onEnd?: () => void },
): void {
  const trimmed = text.trim()
  if (!trimmed || !isSpeechAvailable()) {
    handlers?.onEnd?.()
    return
  }

  window.speechSynthesis.cancel()
  currentUtterance = new SpeechSynthesisUtterance(trimmed)
  currentUtterance.lang = 'ko-KR'
  currentUtterance.rate = 0.85
  const voice = koreanVoice()
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
