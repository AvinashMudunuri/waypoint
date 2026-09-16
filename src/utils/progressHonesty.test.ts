import assert from 'node:assert/strict'
import { test } from 'node:test'
import { phases } from '../data/curriculum.ts'
import { dePhases } from '../data/curriculum.de.ts'
import {
  appendHangulRecent,
  currentPhaseFromTasks,
  decideNextAction,
  hangulRecentStats,
  leftoverCopy,
  leftoverToReady,
  localDateKey,
  resolveSession,
  HANGUL_READY_SAMPLE,
  SESSION_SIZE,
  phaseTasksComplete,
  skillMilestoneIndex,
} from './progressHonesty.ts'

test('hangul ready requires sample and percent, not one lucky hit', () => {
  assert.deepEqual(hangulRecentStats([]), { sample: 0, percent: 0, ready: false })
  assert.equal(hangulRecentStats([true]).ready, false)
  const tenGood = Array.from({ length: HANGUL_READY_SAMPLE }, () => true)
  assert.equal(hangulRecentStats(tenGood).ready, true)
  const sevenGood = [...Array.from({ length: 7 }, () => true), false, false, false]
  assert.equal(hangulRecentStats(sevenGood).percent, 70)
  assert.equal(hangulRecentStats(sevenGood).ready, false)
})

test('appendHangulRecent keeps a window of 20', () => {
  let recent: boolean[] = []
  for (let i = 0; i < 25; i++) recent = appendHangulRecent(recent, i % 2 === 0)
  assert.equal(recent.length, 20)
})

test('current phase retreats to the first incomplete phase', () => {
  const hangulDone = Object.fromEntries(phases[0].tasks.map((t) => [t.id, true]))
  assert.equal(currentPhaseFromTasks(hangulDone), 'foundation')
  const almost = { ...hangulDone, h1: false }
  assert.equal(currentPhaseFromTasks(almost), 'hangul')
})

test('German path uses sounds as first phase', () => {
  assert.equal(currentPhaseFromTasks({}, dePhases), 'sounds')
  const soundsDone = Object.fromEntries(dePhases[0].tasks.map((t) => [t.id, true]))
  assert.equal(currentPhaseFromTasks(soundsDone, dePhases), 'foundation')
})

test('German curriculum matches Korean phase and task count', () => {
  assert.equal(dePhases.length, phases.length)
  const koTasks = phases.reduce((n, p) => n + p.tasks.length, 0)
  const deTasks = dePhases.reduce((n, p) => n + p.tasks.length, 0)
  assert.equal(deTasks, koTasks)
  assert.ok(dePhases.every((p) => p.tasks.length >= 5 && p.exitCriteria.length > 0))
})

test('phase complete is all checkboxes, not phase id', () => {
  const hangul = phases[0]
  assert.equal(phaseTasksComplete(hangul, {}), false)
  const all = Object.fromEntries(hangul.tasks.map((t) => [t.id, true]))
  assert.equal(phaseTasksComplete(hangul, all), true)
})

test('milestones are skill-gated; fluency is never auto', () => {
  const none = skillMilestoneIndex({ completedTasks: {}, hangulReady: false })
  assert.equal(none.current, 0)
  assert.equal(none.reached[4], false)

  const hangulOnly = skillMilestoneIndex({ completedTasks: {}, hangulReady: true })
  assert.equal(hangulOnly.current, 1)

  const allTasks = Object.fromEntries(phases.flatMap((p) => p.tasks.map((t) => [t.id, true])))
  const maxed = skillMilestoneIndex({ completedTasks: allTasks, hangulReady: true })
  assert.deepEqual(maxed.reached, [true, true, true, true, false])
  assert.equal(maxed.current, 4)
})

test('next action prefers quiz before playlist until the script counts', () => {
  const firstVisit = decideNextAction({
    completedTasks: {},
    hangulRecent: [],
    playlistPercent: 0,
    playlistKnown: false,
    routineDone: 0,
    phraseCount: 0,
  })
  assert.equal(firstVisit.learnMode, 'practice')
  assert.match(firstVisit.title, /Hear Hangul/)

  const stillNotReady = decideNextAction({
    completedTasks: {},
    hangulRecent: [true],
    playlistPercent: 0,
    playlistKnown: false,
    routineDone: 0,
    phraseCount: 0,
  })
  assert.equal(stillNotReady.learnMode, 'practice')

  const afterSession = decideNextAction({
    completedTasks: {},
    hangulRecent: Array.from({ length: SESSION_SIZE }, () => true),
    playlistPercent: 0,
    playlistKnown: false,
    routineDone: 0,
    phraseCount: 0,
    sessionClosed: true,
  })
  assert.equal(afterSession.learnMode, 'watch')
  assert.match(afterSession.title, /tomorrow/)

  const readyThenWatch = decideNextAction({
    completedTasks: {},
    hangulRecent: Array.from({ length: 10 }, () => true),
    playlistPercent: 0,
    playlistKnown: false,
    routineDone: 0,
    phraseCount: 0,
  })
  assert.equal(readyThenWatch.learnMode, 'watch')

  const hangulDone = Object.fromEntries(phases[0].tasks.map((t) => [t.id, true]))
  const nextPhase = decideNextAction({
    completedTasks: hangulDone,
    hangulRecent: Array.from({ length: 10 }, () => true),
    playlistPercent: 100,
    playlistKnown: true,
    routineDone: 2,
    phraseCount: 0,
  })
  assert.equal(nextPhase.tab, 'path')
  assert.equal(nextPhase.pathMode, 'phases')
})

test('session resets on a new local day and leftover is unfinished work', () => {
  const today = localDateKey(new Date('2026-09-15T12:00:00'))
  const same = resolveSession(
    { sessionDate: today, sessionAnswers: 3, sessionClosed: false },
    new Date('2026-09-15T18:00:00'),
  )
  assert.deepEqual(same, { date: today, answers: 3, closed: false })

  const nextDay = resolveSession(
    { sessionDate: today, sessionAnswers: 5, sessionClosed: true },
    new Date('2026-09-16T09:00:00'),
  )
  assert.equal(nextDay.answers, 0)
  assert.equal(nextDay.closed, false)

  const fiveDone = leftoverToReady(Array.from({ length: SESSION_SIZE }, () => true))
  assert.equal(fiveDone.remainingAnswers, HANGUL_READY_SAMPLE - SESSION_SIZE)
  assert.equal(fiveDone.ready, false)
  assert.match(leftoverCopy(Array.from({ length: SESSION_SIZE }, () => true), 'Hangul'), /5 left/)
})
