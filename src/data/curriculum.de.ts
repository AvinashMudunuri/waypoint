import type { Milestone, Phase, WeeklyRoutine } from '../types.ts'

/** Same four-phase shape as Korean. Grammar is DW Nico’s Weg, not an in-app course. */
export const dePhases: Phase[] = [
  {
    id: 'sounds',
    number: 1,
    title: 'Sounds & first days',
    subtitle: 'Umlauts, ß, Sie/du — not a fake “learn the alphabet” week',
    duration: '3–10 days',
    exitCriteria: 'You can read umlauts and ß aloud and introduce yourself in Sie and du',
    tasks: [
      { id: 's1', label: 'Watch Easy German — basic phrases', description: 'Finish the playlist in Learn → Watch (80% = done)' },
      { id: 's2', label: 'Quiz sounds until 10 answers at 80%+', description: 'Learn → Sounds. One lucky tap does not count' },
      { id: 's3', label: 'Say name, city, and job in Sie and du', description: 'Record yourself; listen back' },
      { id: 's4', label: 'Read a menu, ticket machine, or station sign aloud', description: 'Real German in the wild, not a textbook line' },
      { id: 's5', label: 'Five 15-min listen days', description: 'Easy German or Slow German — no English audio' },
    ],
    resources: [
      {
        name: 'Easy German — Basic phrases',
        url: 'https://www.youtube.com/playlist?list=PLvc5KsjNL0bV9hxQ91Vpkau35O5E5hnY4',
        type: 'youtube',
      },
      { name: 'DW — Nico’s Weg A1', url: 'https://learngerman.dw.com/en/nicos-weg/c-36519789', type: 'website' },
      { name: 'Easy German — how to start', url: 'https://www.easygerman.org/', type: 'website' },
    ],
  },
  {
    id: 'foundation',
    number: 2,
    title: 'Core foundation',
    subtitle: 'Articles, present tense, cases in context, first 1,000 words',
    duration: '8–12 weeks',
    exitCriteria: 'Introduce yourself, order food, ask directions, and small-talk in present tense — slow is fine',
    tasks: [
      { id: 'f1', label: 'Complete Nico’s Weg A1', description: 'All A1 units + the A1 test on DW. ~3 lessons/week' },
      { id: 'f2', label: 'Complete Nico’s Weg A2', description: 'Same habit. Do not skip cases; they show up here' },
      { id: 'f3', label: 'Anki: 500 most common words', description: '10–15 min/day. Include der/die/das on the card' },
      { id: 'f4', label: 'Anki: reach 1,000 words', description: 'Same deck. Gender stays on the card' },
      { id: 'f5', label: 'Book first italki or tandem session', description: 'Schedule for week 3–4, not “when ready”' },
      { id: 'f6', label: 'Complete 4 speaking sessions', description: '2×/week, 30 min. Human, not a chatbot score' },
    ],
    resources: [
      { name: 'Nico’s Weg A1', url: 'https://learngerman.dw.com/en/nicos-weg/c-36519789', type: 'website' },
      { name: 'DW video courses (A2 · Nico’s Weg)', url: 'https://learngerman.dw.com/en/learn-german-with-videos/s-68307454', type: 'website' },
      { name: 'Anki — shared German decks', url: 'https://ankiweb.net/shared/decks/german', type: 'app' },
      { name: 'dict.cc', url: 'https://www.dict.cc/', type: 'website' },
      { name: 'italki — German tutors', url: 'https://www.italki.com/teachers/german', type: 'website' },
    ],
  },
  {
    id: 'media',
    number: 3,
    title: 'Media immersion',
    subtitle: 'Turn shows and podcasts you already like into study',
    duration: 'Months 2–6',
    exitCriteria: 'Catch stock phrases; follow a show you have seen before with German audio + German subs',
    tasks: [
      { id: 'm1', label: 'Re-watch a familiar series with German audio', description: 'German subs first. Dark, Babylon Berlin, or a kids’ show you know' },
      { id: 'm2', label: 'Mine 50 phrases to your journal', description: 'Log → Phrases in this app' },
      { id: 'm3', label: 'Start Nico’s Weg B1 (or a B1 grammar book)', description: 'Keep one structured source while you immerse' },
      { id: 'm4', label: 'New show: German audio + German subs', description: 'No English subs' },
      { id: 'm5', label: '8+ speaking sessions completed', description: 'Build conversation stamina' },
      { id: 'm6', label: 'Write 5 sentences daily for 2 weeks', description: 'About your actual day — present + one past form' },
    ],
    resources: [
      { name: 'Easy German (street interviews)', url: 'https://www.easygerman.org/', type: 'website' },
      {
        name: 'Easy German — vlogs & documentaries',
        url: 'https://www.youtube.com/playlist?list=PLk1fjOl39-50RITUTsTOLTnBoTRlxwroe',
        type: 'youtube',
      },
      { name: 'DW video courses (B1 · Nico’s Weg)', url: 'https://learngerman.dw.com/en/learn-german-with-videos/s-68307454', type: 'website' },
      { name: 'Slow German (podcast)', url: 'https://slowgerman.com/', type: 'website' },
      { name: 'Linguee', url: 'https://www.linguee.com/english-german', type: 'website' },
    ],
  },
  {
    id: 'conversation',
    number: 4,
    title: 'Real conversation',
    subtitle: 'Speak about the week — work, food, plans',
    duration: 'Ongoing',
    exitCriteria: '15-minute conversation about your week, food, work, hobbies — slow but real',
    tasks: [
      { id: 'c1', label: 'Weekly tutor or exchange (2×/week)', description: 'Maintain the speaking habit' },
      { id: 'c2', label: 'Finish Nico’s Weg B1 or equivalent', description: 'Or a B1 course you will actually complete' },
      { id: 'c3', label: 'Join a German language exchange', description: 'Tandem, HelloTalk, or a local Stammtisch' },
      { id: 'c4', label: 'Watch one episode without any subtitles', description: 'A show you have already seen twice' },
      { id: 'c5', label: 'Read graded news or a short reader', description: 'Nachrichtenleicht or a Goethe A2/B1 reader' },
    ],
    resources: [
      { name: 'Preply — German tutors', url: 'https://preply.com/en/online/german-tutors', type: 'website' },
      { name: 'HelloTalk', url: 'https://www.hellotalk.com/', type: 'app' },
      { name: 'Tandem', url: 'https://www.tandem.net/', type: 'app' },
      { name: 'Nachrichtenleicht', url: 'https://www.nachrichtenleicht.de/', type: 'website' },
    ],
  },
]

export const deMilestones: Milestone[] = [
  { id: 'm1', label: 'Sounds in the wild', timeline: 'Week 1–2', description: 'Read umlauts and ß; say who you are in Sie and du' },
  { id: 'm2', label: 'Survival German', timeline: '2–4 months', description: 'Food, directions, introductions — after A1 work, not a streak' },
  { id: 'm3', label: 'Simple conversations', timeline: '6–10 months', description: 'Talk about your week in present + simple past' },
  { id: 'm4', label: 'Media without English', timeline: '1.5–2 years', description: 'Follow a familiar show with German audio' },
  { id: 'm5', label: 'Comfortable fluency', timeline: '2–4 years', description: 'The app will never auto-check this' },
]

export const deWeeklyRoutine: WeeklyRoutine = {
  studyDays: ['Monday', 'Wednesday', 'Friday'],
  speakingDays: ['Tuesday', 'Thursday'],
  studyActivity: 'Nico’s Weg + Anki (30 min)',
  speakingActivity: 'Tutor or language exchange (30 min)',
  dramaNote: 'German audio + German subs — mine phrases as you watch',
}

export const deRoutineLabels: Record<string, { day: string; activity: string }> = {
  'mon-study': { day: 'Monday', activity: 'Nico’s Weg lesson + Anki (30 min)' },
  'tue-speak': { day: 'Tuesday', activity: 'Tutor or language exchange (30 min)' },
  'wed-study': { day: 'Wednesday', activity: 'Nico’s Weg lesson + Anki (30 min)' },
  'thu-speak': { day: 'Thursday', activity: 'Tutor or language exchange (30 min)' },
  'fri-study': { day: 'Friday', activity: 'Nico’s Weg lesson + Anki (30 min)' },
  'sat-review': { day: 'Saturday', activity: 'Re-read one Nico’s Weg lesson; write 5 sentences' },
  'sun-drama': { day: 'Sunday', activity: 'German show or podcast + mine phrases' },
}
