let voicesWarmed = false

export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Browsers populate voices asynchronously. Call on Hangul/Drama mount. */
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

export function speakKorean(text: string): void {
  const trimmed = text.trim()
  if (!trimmed || !isSpeechAvailable()) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(trimmed)
  utterance.lang = 'ko-KR'
  utterance.rate = 0.8
  const voice = koreanVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}
