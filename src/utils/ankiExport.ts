import type { DramaPhrase } from '../types'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** Anki-compatible tab-separated import file */
export function exportPhrasesToAnki(phrases: DramaPhrase[]) {
  if (phrases.length === 0) return

  const lines = [
    '#separator:tab',
    '#html:true',
    '#deck:Waypoint Korean Phrases',
    '#notetype:Basic',
    '#columns:Front Back Tags',
    '',
    ...phrases.map((p) => {
      const front = escapeHtml(p.korean)
      const back = escapeHtml(p.english)
      const tag = p.show.replace(/\s+/g, '_')
      const note = p.notes ? `<br><small>${escapeHtml(p.notes)}</small>` : ''
      return `${front}\t${back}${note}\t${tag}`
    }),
  ]

  const date = new Date().toISOString().slice(0, 10)
  downloadFile(lines.join('\n'), `waypoint-korean-phrases-${date}.txt`, 'text/plain;charset=utf-8')
}

/** Simple CSV for spreadsheets or other flashcard apps */
export function exportPhrasesToCsv(phrases: DramaPhrase[]) {
  if (phrases.length === 0) return

  const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`
  const lines = [
    'Korean,English,Show,Notes',
    ...phrases.map((p) =>
      [p.korean, p.english, p.show, p.notes ?? ''].map(escapeCsv).join(','),
    ),
  ]

  const date = new Date().toISOString().slice(0, 10)
  downloadFile(lines.join('\n'), `waypoint-korean-phrases-${date}.csv`, 'text/csv;charset=utf-8')
}
