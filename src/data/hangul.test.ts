import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  hangulConsonants,
  hangulSyllables,
  hangulVowels,
  spokenHangul,
} from './hangul.ts'

test('vowels speak as ㅇ + vowel syllables', () => {
  const expected: Record<string, string> = {
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

  assert.equal(hangulVowels.length, 10)
  for (const entry of hangulVowels) {
    assert.equal(spokenHangul(entry), expected[entry.char])
  }
})

test('consonants speak as consonant + ㅡ (ㅇ as 응)', () => {
  assert.equal(spokenHangul(hangulConsonants[0]), '그')
  assert.equal(
    spokenHangul(hangulConsonants.find((c) => c.char === 'ㅇ')!),
    '응',
  )
  assert.equal(
    spokenHangul(hangulConsonants.find((c) => c.char === 'ㅎ')!),
    '흐',
  )
})

test('syllables speak as themselves', () => {
  const ga = hangulSyllables.find((c) => c.char === '가')
  assert.ok(ga)
  assert.equal(spokenHangul(ga), '가')
})
