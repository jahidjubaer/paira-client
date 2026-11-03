// Committee members from /api/people (Dashboard → Committee & people)

export const BODIES = ['executive', 'core', 'advisory', 'subcommittee']

// Still serving: no end year, or the term ends this year or later
export const isCurrent = (p, year = new Date().getFullYear()) => !p.termTo || p.termTo >= year

// "2024–2026", or "2025 –" while still serving
export const termLabel = (p, num) => (p.termTo ? `${num(p.termFrom)}–${num(p.termTo)}` : `${num(p.termFrom)} –`)

// Past members grouped by term, newest term first: [{ label, people }]
export const pastTerms = (people, num) => {
  const groups = new Map()
  for (const p of [...people].sort((a, b) => b.termTo - a.termTo || b.termFrom - a.termFrom)) {
    const label = termLabel(p, num)
    groups.set(label, [...(groups.get(label) ?? []), p])
  }
  return [...groups].map(([label, list]) => ({ label, people: list }))
}
