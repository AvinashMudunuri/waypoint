export interface GermanSound {
  char: string
  romanization: string
  hint?: string
  speak: string
}

export const germanSounds: GermanSound[] = [
  { char: 'ä', romanization: 'eh (bare)', hint: 'Like e in bed, not ah', speak: 'Bär' },
  { char: 'ö', romanization: 'er (fur)', hint: 'Rounded e', speak: 'schön' },
  { char: 'ü', romanization: 'ue', hint: 'Say ee and round the lips', speak: 'über' },
  { char: 'ß', romanization: 'ss', hint: 'Sharp s, never at the start of a word', speak: 'Straße' },
  { char: 'ch', romanization: 'ich / ach', hint: 'ich after e/i; ach after a/o/u', speak: 'ich' },
  { char: 'sch', romanization: 'sh', hint: 'Always sh, never sk', speak: 'schön' },
  { char: 'ei', romanization: 'eye', hint: 'mein = mine', speak: 'mein' },
  { char: 'ie', romanization: 'ee', hint: 'viel = feel', speak: 'viel' },
  { char: 'eu / äu', romanization: 'oy', hint: 'Deutsch, Häuser', speak: 'Deutsch' },
  { char: 'z', romanization: 'ts', hint: 'Zeit starts with ts', speak: 'Zeit' },
  { char: 'w', romanization: 'v', hint: 'Wein sounds like vine', speak: 'Wein' },
  { char: 'v', romanization: 'f (often)', hint: 'Vater ≈ fah-ter', speak: 'Vater' },
]

export function pickRandom<T>(list: T[], n: number, exclude: T): T[] {
  return list.filter((x) => x !== exclude).sort(() => Math.random() - 0.5).slice(0, n)
}
