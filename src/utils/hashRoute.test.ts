import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defaultRoute, parseHash, toHash } from './hashRoute.ts'

test('parseHash maps learn/log/path modes', () => {
  assert.deepEqual(parseHash('#/learn/watch').learnMode, 'watch')
  assert.equal(parseHash('#/learn/quiz').quiz, true)
  assert.equal(parseHash('#/log/phrases').logMode, 'phrases')
  assert.equal(parseHash('#/path/goals').pathMode, 'goals')
  assert.equal(parseHash('').tab, 'today')
  assert.equal(parseHash('#/nope').tab, 'today')
})

test('toHash round-trips', () => {
  const samples = ['#/today', '#/learn', '#/learn/quiz', '#/learn/watch', '#/log', '#/log/phrases', '#/path', '#/path/goals']
  for (const hash of samples) {
    assert.equal(toHash(parseHash(hash)), hash)
  }
  assert.equal(toHash(defaultRoute()), '#/today')
})
