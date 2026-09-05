import type { Milestone, Phase } from '../types.ts'

export const dePhases: Phase[] = [
  {
    id: 'sounds',
    number: 1,
    title: 'Sounds & survival',
    subtitle: 'Umlauts, ß, and the first phrases — not a fake alphabet week',
    duration: '3–10 days',
    exitCriteria: 'You can say ä/ö/ü/ß and introduce yourself without reading romanization tricks',
    tasks: [
      { id: 's1', label: 'Watch Easy German — basic phrases', description: 'Play the playlist in Learn → Watch' },
      { id: 's2', label: 'Quiz umlauts and ß until 10 at 80%+', description: 'Sounds chart in Learn' },
      { id: 's3', label: 'Record yourself saying name, city, job', description: 'Sie and du once each' },
      { id: 's4', label: 'Read a menu or station sign aloud', description: 'Real German in the wild' },
      { id: 's5', label: 'Five 15-min listen days', description: 'Easy German or a slow podcast' },
    ],
    resources: [
      {
        name: 'Easy German — Basic phrases',
        url: 'https://www.youtube.com/playlist?list=PLvc5KsjNL0bV9hxQ91Vpkau35O5E5hnY4',
        type: 'youtube',
      },
      { name: 'DW — Nico’s Weg A1', url: 'https://learngerman.dw.com/en/nicos-weg/c-47997689', type: 'website' },
    ],
  },
  {
    id: 'foundation',
    number: 2,
    title: 'Core foundation',
    subtitle: 'Articles, present tense, first 1,000 words',
    duration: '8–12 weeks',
    exitCriteria: 'Order food, ask directions, and small-talk in present tense — slow is fine',
    tasks: [
      { id: 'f1', label: 'Finish Nico’s Weg A1 episodes you assigned', description: 'DW, not a random app streak' },
      { id: 'f2', label: 'Anki: 500 frequent words', description: '10–15 min/day' },
      { id: 'f3', label: 'Anki: 1,000 words', description: 'Keep the same deck' },
      { id: 'f4', label: 'Book first italki / tandem session', description: 'Week 3–4, not “when ready”' },
      { id: 'f5', label: 'Four speaking sessions', description: '30 min, 2×/week' },
    ],
    resources: [
      { name: 'DW Nico’s Weg A1', url: 'https://learngerman.dw.com/en/nicos-weg/c-47997689', type: 'website' },
      { name: 'italki — German tutors', url: 'https://www.italki.com/teachers/german', type: 'website' },
    ],
  },
  {
    id: 'media',
    number: 3,
    title: 'Media immersion',
    subtitle: 'Shows and podcasts you already like',
    duration: 'Months 2–6',
    exitCriteria: 'Catch stock phrases; follow a show you have seen before with German audio',
    tasks: [
      { id: 'm1', label: 'Re-watch a familiar series with German audio', description: 'German subs first' },
      { id: 'm2', label: 'Mine 50 phrases', description: 'Log → Phrases' },
      { id: 'm3', label: 'One new show: German audio + German subs', description: 'No English subs' },
      { id: 'm4', label: 'Eight speaking sessions', description: 'Keep the calendar' },
      { id: 'm5', label: 'Write 5 sentences a day for 2 weeks', description: 'About your actual day' },
    ],
    resources: [
      { name: 'Easy German', url: 'https://www.easygerman.org/', type: 'website' },
      { name: 'dict.cc', url: 'https://www.dict.cc/', type: 'website' },
    ],
  },
  {
    id: 'conversation',
    number: 4,
    title: 'Real conversation',
    subtitle: 'Speak about the week — work, food, plans',
    duration: 'Ongoing',
    exitCriteria: '15-minute conversation, slow but real. The app will not mark fluency.',
    tasks: [
      { id: 'c1', label: 'Weekly tutor or exchange (2×)', description: 'Human, not a chatbot grade' },
      { id: 'c2', label: 'Watch one episode without subs', description: 'A show you already know' },
      { id: 'c3', label: 'Join a language exchange', description: 'Tandem, HelloTalk, or local' },
      { id: 'c4', label: 'Read a graded reader or kids’ news', description: 'Nachtschicht / Nachrichtenleicht' },
    ],
    resources: [
      { name: 'HelloTalk', url: 'https://www.hellotalk.com/', type: 'app' },
      { name: 'Nachrichtenleicht', url: 'https://www.nachrichtenleicht.de/', type: 'website' },
    ],
  },
]

export const deMilestones: Milestone[] = [
  { id: 'm1', label: 'Sounds in the wild', timeline: 'Week 1–2', description: 'Read umlauts and ß; say who you are' },
  { id: 'm2', label: 'Survival German', timeline: '2–4 months', description: 'Food, directions, introductions' },
  { id: 'm3', label: 'Simple conversations', timeline: '6–10 months', description: 'Talk about your week' },
  { id: 'm4', label: 'Media without English', timeline: '1.5–2 years', description: 'Follow a familiar show' },
  { id: 'm5', label: 'Comfortable fluency', timeline: '2–4 years', description: 'Never auto-checked in this app' },
]

export const deRoutineLabels: Record<string, { day: string; activity: string }> = {
  'mon-study': { day: 'Monday', activity: 'Nico’s Weg or grammar + Anki (30 min)' },
  'tue-speak': { day: 'Tuesday', activity: 'Tutor or exchange (30 min)' },
  'wed-study': { day: 'Wednesday', activity: 'Nico’s Weg or grammar + Anki (30 min)' },
  'thu-speak': { day: 'Thursday', activity: 'Tutor or exchange (30 min)' },
  'fri-study': { day: 'Friday', activity: 'Nico’s Weg or grammar + Anki (30 min)' },
  'sat-review': { day: 'Saturday', activity: 'Re-read one lesson; write 5 sentences' },
  'sun-drama': { day: 'Sunday', activity: 'Show or podcast + mine phrases' },
}
