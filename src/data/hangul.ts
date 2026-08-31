export interface HangulChar {
  char: string
  romanization: string
  category: 'consonant' | 'vowel' | 'syllable'
  hint?: string
}

export const hangulConsonants: HangulChar[] = [
  { char: 'ㄱ', romanization: 'g/k', category: 'consonant', hint: 'like "g" in game' },
  { char: 'ㄴ', romanization: 'n', category: 'consonant', hint: 'like "n" in no' },
  { char: 'ㄷ', romanization: 'd/t', category: 'consonant', hint: 'like "d" in dog' },
  { char: 'ㄹ', romanization: 'r/l', category: 'consonant', hint: 'between r and l' },
  { char: 'ㅁ', romanization: 'm', category: 'consonant', hint: 'like "m" in mom' },
  { char: 'ㅂ', romanization: 'b/p', category: 'consonant', hint: 'like "b" in boy' },
  { char: 'ㅅ', romanization: 's', category: 'consonant', hint: 'like "s" in sun' },
  { char: 'ㅇ', romanization: 'ng', category: 'consonant', hint: 'silent at start, "ng" at end' },
  { char: 'ㅈ', romanization: 'j', category: 'consonant', hint: 'like "j" in jar' },
  { char: 'ㅊ', romanization: 'ch', category: 'consonant', hint: 'like "ch" in church' },
  { char: 'ㅋ', romanization: 'k', category: 'consonant', hint: 'aspirated "k"' },
  { char: 'ㅌ', romanization: 't', category: 'consonant', hint: 'aspirated "t"' },
  { char: 'ㅍ', romanization: 'p', category: 'consonant', hint: 'aspirated "p"' },
  { char: 'ㅎ', romanization: 'h', category: 'consonant', hint: 'like "h" in hat' },
]

/** Isolated jamo often fail in TTS. Speak a real syllable instead. */
const VOWEL_SPOKEN: Record<string, string> = {
  ㅏ: '아',
  ㅑ: '야',
  ㅓ: '어',
  ㅕ: '여',
  ㅗ: '오',
  ㅛ: '요',
  ㅜ: '우',
  ㅠ: '유',
  ㅡ: '으',
  ㅣ: '이',
}

const CONSONANT_SPOKEN: Record<string, string> = {
  ㄱ: '그',
  ㄴ: '느',
  ㄷ: '드',
  ㄹ: '르',
  ㅁ: '므',
  ㅂ: '브',
  ㅅ: '스',
  ㅇ: '응',
  ㅈ: '즈',
  ㅊ: '츠',
  ㅋ: '크',
  ㅌ: '트',
  ㅍ: '프',
  ㅎ: '흐',
}

export function spokenHangul(entry: HangulChar): string {
  if (entry.category === 'vowel') return VOWEL_SPOKEN[entry.char] ?? entry.char
  if (entry.category === 'consonant') return CONSONANT_SPOKEN[entry.char] ?? entry.char
  return entry.char
}

export const hangulVowels: HangulChar[] = [
  { char: 'ㅏ', romanization: 'a', category: 'vowel', hint: 'like "a" in father' },
  { char: 'ㅑ', romanization: 'ya', category: 'vowel', hint: 'like "ya" in yard' },
  { char: 'ㅓ', romanization: 'eo', category: 'vowel', hint: 'like "u" in sun' },
  { char: 'ㅕ', romanization: 'yeo', category: 'vowel', hint: 'like "yu" in yurt' },
  { char: 'ㅗ', romanization: 'o', category: 'vowel', hint: 'like "o" in go' },
  { char: 'ㅛ', romanization: 'yo', category: 'vowel', hint: 'like "yo" in yolk' },
  { char: 'ㅜ', romanization: 'u', category: 'vowel', hint: 'like "oo" in moon' },
  { char: 'ㅠ', romanization: 'yu', category: 'vowel', hint: 'like "you"' },
  { char: 'ㅡ', romanization: 'eu', category: 'vowel', hint: 'say "oo" with lips unrounded' },
  { char: 'ㅣ', romanization: 'i', category: 'vowel', hint: 'like "ee" in see' },
]

export const hangulSyllables: HangulChar[] = [
  { char: '가', romanization: 'ga', category: 'syllable' },
  { char: '나', romanization: 'na', category: 'syllable' },
  { char: '다', romanization: 'da', category: 'syllable' },
  { char: '라', romanization: 'ra', category: 'syllable' },
  { char: '마', romanization: 'ma', category: 'syllable' },
  { char: '바', romanization: 'ba', category: 'syllable' },
  { char: '사', romanization: 'sa', category: 'syllable' },
  { char: '아', romanization: 'a', category: 'syllable' },
  { char: '자', romanization: 'ja', category: 'syllable' },
  { char: '차', romanization: 'cha', category: 'syllable' },
  { char: '카', romanization: 'ka', category: 'syllable' },
  { char: '타', romanization: 'ta', category: 'syllable' },
  { char: '파', romanization: 'pa', category: 'syllable' },
  { char: '하', romanization: 'ha', category: 'syllable' },
  { char: '고', romanization: 'go', category: 'syllable' },
  { char: '노', romanization: 'no', category: 'syllable' },
  { char: '도', romanization: 'do', category: 'syllable' },
  { char: '보', romanization: 'bo', category: 'syllable' },
  { char: '소', romanization: 'so', category: 'syllable' },
  { char: '오', romanization: 'o', category: 'syllable' },
  { char: '조', romanization: 'jo', category: 'syllable' },
  { char: '호', romanization: 'ho', category: 'syllable' },
  { char: '구', romanization: 'gu', category: 'syllable' },
  { char: '누', romanization: 'nu', category: 'syllable' },
  { char: '두', romanization: 'du', category: 'syllable' },
  { char: '무', romanization: 'mu', category: 'syllable' },
  { char: '부', romanization: 'bu', category: 'syllable' },
  { char: '수', romanization: 'su', category: 'syllable' },
  { char: '우', romanization: 'u', category: 'syllable' },
  { char: '주', romanization: 'ju', category: 'syllable' },
  { char: '후', romanization: 'hu', category: 'syllable' },
]

export const allHangulChars = [...hangulConsonants, ...hangulVowels, ...hangulSyllables]

export type QuizMode = 'char-to-sound' | 'sound-to-char'
export type QuizSet = 'consonants' | 'vowels' | 'syllables' | 'all'

export function getCharSet(set: QuizSet): HangulChar[] {
  switch (set) {
    case 'consonants': return hangulConsonants
    case 'vowels': return hangulVowels
    case 'syllables': return hangulSyllables
    case 'all': return allHangulChars
  }
}

export function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const pool = exclude ? arr.filter((x) => x !== exclude) : [...arr]
  const shuffled = pool.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
