import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatClock,
  isWatchComplete,
  parseYoutubeUrl,
  playlistWatchSummary,
  watchPercent,
} from './youtube.ts'

test('parses watch, short, playlist, and embed URLs', () => {
  assert.deepEqual(parseYoutubeUrl('https://www.youtube.com/watch?v=abc123XYZ-_'), {
    kind: 'video',
    videoId: 'abc123XYZ-_',
  })
  assert.deepEqual(parseYoutubeUrl('https://youtu.be/abc123XYZ-_'), {
    kind: 'video',
    videoId: 'abc123XYZ-_',
  })
  assert.deepEqual(
    parseYoutubeUrl('https://www.youtube.com/playlist?list=PLbFrUoo86xWv3rnR0hCL4vV8X9dAnFJ01'),
    { kind: 'playlist', playlistId: 'PLbFrUoo86xWv3rnR0hCL4vV8X9dAnFJ01' },
  )
  assert.deepEqual(
    parseYoutubeUrl('https://www.youtube.com/watch?v=abc123XYZ-_&list=PLxx'),
    { kind: 'playlist', playlistId: 'PLxx', videoId: 'abc123XYZ-_' },
  )
  assert.equal(parseYoutubeUrl('https://viki.com/show/1'), null)
})

test('80% watched counts as complete', () => {
  assert.equal(isWatchComplete(80, 100), true)
  assert.equal(isWatchComplete(79, 100), false)
  assert.equal(watchPercent(40, 80), 50)
})

test('playlist summary uses completed flags and ratio', () => {
  const summary = playlistWatchSummary(['a', 'b', 'c'], {
    a: { completed: true },
    b: { seconds: 90, duration: 100 },
    c: { seconds: 10, duration: 100 },
  })
  assert.deepEqual(summary, { done: 2, total: 3, percent: 67 })
})

test('formatClock', () => {
  assert.equal(formatClock(125), '2:05')
})
