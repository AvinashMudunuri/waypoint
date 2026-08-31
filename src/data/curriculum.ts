import type { Milestone, Phase, WeeklyRoutine } from '../types'

export const phases: Phase[] = [
  {
    id: 'hangul',
    number: 1,
    title: 'Hangul',
    subtitle: 'Learn the Korean alphabet in one week',
    duration: '3–7 days',
    exitCriteria: 'You can read Hangul slowly without romanization',
    tasks: [
      { id: 'h1', label: 'Watch GO! Billy Korean Hangul playlist', description: 'Complete all Hangul videos' },
      { id: 'h2', label: 'Practice reading drama titles', description: 'Read 10 K-drama titles in Hangul' },
      { id: 'h3', label: 'Write your name in Hangul', description: 'Transliterate and write by hand' },
      { id: 'h4', label: 'Read a menu or song lyrics', description: 'Find real Korean text and read it aloud' },
      { id: 'h5', label: 'Daily 15-min reading drill', description: '5 days of focused Hangul practice' },
    ],
    resources: [
      { name: 'GO! Billy Korean — Hangul', url: 'https://www.youtube.com/playlist?list=PLbFrQnW0BNMVrHEJCOYWbLnXFzj4bl5z0', type: 'youtube' },
      { name: 'Hangul Day (free course)', url: 'https://www.howtostudykorean.com/unit0/', type: 'website' },
    ],
  },
  {
    id: 'foundation',
    number: 2,
    title: 'Core Foundation',
    subtitle: 'Grammar basics and your first 1,000 words',
    duration: '6–10 weeks',
    exitCriteria: 'Introduce yourself, order food, handle basic small talk in polite form (-요)',
    tasks: [
      { id: 'f1', label: 'Complete TTMIK Level 1 (lessons 1–10)', description: '~2 weeks at 3 lessons/week' },
      { id: 'f2', label: 'Complete TTMIK Level 2 (lessons 1–10)', description: 'Build on Level 1 patterns' },
      { id: 'f3', label: 'Anki: 500 most common words', description: '10–15 min/day, track progress' },
      { id: 'f4', label: 'Anki: reach 1,000 words', description: 'Covers ~85% of spoken Korean' },
      { id: 'f5', label: 'Book first iTalki trial lesson', description: 'Schedule for week 3–4' },
      { id: 'f6', label: 'Complete 4 speaking sessions', description: '2×/week, 30 min each' },
    ],
    resources: [
      { name: 'Talk To Me In Korean — Level 1', url: 'https://talktomeinkorean.com/curriculum/beginner-level-1/', type: 'website' },
      { name: 'Anki — 1,000 Core Korean Words', url: 'https://ankiweb.net/shared/info/1129289387', type: 'app' },
      { name: 'Papago Translator', url: 'https://papago.naver.com/', type: 'app' },
      { name: 'iTalki — Find a tutor', url: 'https://www.italki.com/teachers/korean', type: 'website' },
    ],
  },
  {
    id: 'drama',
    number: 3,
    title: 'Drama Immersion',
    subtitle: 'Turn your K-drama habit into study time',
    duration: 'Months 2–6',
    exitCriteria: 'Catch common phrases without looking; follow simple dialogue in shows you\'ve seen',
    tasks: [
      { id: 'd1', label: 'Re-watch a familiar drama with Korean subs', description: 'Pick one you know well' },
      { id: 'd2', label: 'Mine 50 phrases to your journal', description: 'Use the Drama tab in this app' },
      { id: 'd3', label: 'Complete TTMIK Level 3', description: 'Intermediate grammar patterns' },
      { id: 'd4', label: 'Watch new drama: Korean audio + Korean subs', description: 'No English subtitles' },
      { id: 'd5', label: '8+ speaking sessions completed', description: 'Build conversation stamina' },
      { id: 'd6', label: 'Write 5 sentences daily for 2 weeks', description: 'Journal in Korean about your day' },
    ],
    resources: [
      { name: 'Viki — Korean dramas with subs', url: 'https://www.viki.com/', type: 'website' },
      { name: 'Naver Dictionary', url: 'https://dict.naver.com/', type: 'website' },
      { name: 'TTMIK Level 3', url: 'https://talktomeinkorean.com/curriculum/beginner-level-3/', type: 'website' },
    ],
  },
  {
    id: 'conversation',
    number: 4,
    title: 'Real Conversation',
    subtitle: 'Speak confidently about everyday life',
    duration: 'Ongoing',
    exitCriteria: '15-minute conversation about your week, food, work, hobbies — slow but real',
    tasks: [
      { id: 'c1', label: 'Weekly tutor sessions (2×/week)', description: 'Maintain speaking habit' },
      { id: 'c2', label: 'Complete TTMIK Level 4–5', description: 'Advanced beginner grammar' },
      { id: 'c3', label: 'Join a Korean language exchange', description: 'HelloTalk, Tandem, or local meetup' },
      { id: 'c4', label: 'Watch drama without any subtitles', description: 'Start with shows you\'ve seen 2+ times' },
      { id: 'c5', label: 'Read a Korean children\'s book', description: 'Graded readers or webtoons for learners' },
    ],
    resources: [
      { name: 'Preply — Korean tutors', url: 'https://preply.com/en/online/korean-tutors', type: 'website' },
      { name: 'HelloTalk', url: 'https://www.hellotalk.com/', type: 'app' },
      { name: 'TTMIK Level 4', url: 'https://talktomeinkorean.com/curriculum/beginner-level-4/', type: 'website' },
    ],
  },
]

export const milestones: Milestone[] = [
  { id: 'm1', label: 'Read Hangul', timeline: 'Week 1', description: 'Decode any Hangul text, even if slowly' },
  { id: 'm2', label: 'Survival Korean', timeline: '2–3 months', description: 'Order food, ask directions, introduce yourself' },
  { id: 'm3', label: 'Simple conversations', timeline: '6–9 months', description: 'Talk about your day, hobbies, and opinions' },
  { id: 'm4', label: 'Drama without English subs', timeline: '1.5–2 years', description: 'Follow plot and dialogue in new shows' },
  { id: 'm5', label: 'Comfortable fluency', timeline: '2–3 years', description: 'Natural conversation on most everyday topics' },
]

export const weeklyRoutine: WeeklyRoutine = {
  studyDays: ['Monday', 'Wednesday', 'Friday'],
  speakingDays: ['Tuesday', 'Thursday'],
  studyActivity: 'TTMIK lesson + Anki (30 min)',
  speakingActivity: 'Tutor session or language exchange (30 min)',
  dramaNote: 'K-drama with Korean subs — mine phrases as you watch',
}

export const routineDayKeys = [
  'mon-study',
  'tue-speak',
  'wed-study',
  'thu-speak',
  'fri-study',
  'sat-review',
  'sun-drama',
] as const

export const routineDayLabels: Record<string, { day: string; activity: string }> = {
  'mon-study': { day: 'Monday', activity: 'TTMIK lesson + Anki (30 min)' },
  'tue-speak': { day: 'Tuesday', activity: 'Tutor or language exchange (30 min)' },
  'wed-study': { day: 'Wednesday', activity: 'TTMIK lesson + Anki (30 min)' },
  'thu-speak': { day: 'Thursday', activity: 'Tutor or language exchange (30 min)' },
  'fri-study': { day: 'Friday', activity: 'TTMIK lesson + Anki (30 min)' },
  'sat-review': { day: 'Saturday', activity: 'Re-read one TTMIK lesson; write 5 sentences' },
  'sun-drama': { day: 'Sunday', activity: 'K-drama with Korean subs + mine phrases' },
}
