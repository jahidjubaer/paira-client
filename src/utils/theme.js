import { useSyncExternalStore } from 'react'

// Colour themes. `daisy` is the daisyUI theme name in index.css, `bar` the phone status-bar colour (base-100),
// `swatch` the three dots shown in the picker. The same list is mirrored in the small script in index.html.
export const themes = [
  { id: 'system', daisy: null, swatch: ['#fdfbf4', '#123a2f', '#e8b93f'] },
  { id: 'paira', daisy: 'paira', bar: '#fdfbf4', swatch: ['#fdfbf4', '#1d6b51', '#e8b93f'] },
  { id: 'night', daisy: 'paira-dark', bar: '#0f1d18', swatch: ['#0f1d18', '#5cc79c', '#eec04a'] },
  { id: 'paper', daisy: 'paira-paper', bar: '#f5ecda', swatch: ['#f5ecda', '#7a4b26', '#b8862b'] },
  { id: 'haor', daisy: 'paira-haor', bar: '#f3f8fb', swatch: ['#f3f8fb', '#1f6a96', '#2aa39a'] },
  { id: 'dusk', daisy: 'paira-dusk', bar: '#171428', swatch: ['#171428', '#a99cf2', '#eec04a'] },
]

// Text size choices: root font size, so everything sized in rem grows with it
export const textSizes = [
  { id: 'sm', size: '93.75%' },
  { id: 'md', size: '' },
  { id: 'lg', size: '112.5%' },
]

const THEME_KEY = 'paira-theme'
const TEXT_KEY = 'paira-text'
const darkQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const read = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // storage unavailable — the choice lasts for this visit only
  }
}

// Older visits saved 'light' / 'dark'
const legacy = { light: 'paira', dark: 'night' }

const savedTheme = () => {
  const value = read(THEME_KEY)
  const id = legacy[value] ?? value
  return themes.some((theme) => theme.id === id) ? id : 'system'
}

const savedText = () => {
  const value = read(TEXT_KEY)
  return textSizes.some((size) => size.id === value) ? value : 'md'
}

let state = { theme: savedTheme(), text: savedText() }
const listeners = new Set()

const resolve = (id) => {
  if (id !== 'system') return themes.find((theme) => theme.id === id)
  return themes.find((theme) => theme.id === (darkQuery?.matches ? 'night' : 'paira'))
}

const paint = () => {
  const theme = resolve(state.theme)
  const root = document.documentElement
  root.setAttribute('data-theme', theme.daisy)
  root.style.fontSize = textSizes.find((size) => size.id === state.text).size
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.bar)
}

const update = (next) => {
  state = { ...state, ...next }
  listeners.forEach((listener) => listener())
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const setTheme = (id) => {
  write(THEME_KEY, id)
  update({ theme: id })
  // Cross-fade the colours where the browser can
  if (!document.startViewTransition || reducedMotion()) return paint()
  // Marked so the phone page-slide (index.css) doesn't play for a colour change
  const root = document.documentElement
  root.classList.add('theme-switch')
  document.startViewTransition(paint).finished.finally(() => root.classList.remove('theme-switch'))
}

export const setTextSize = (id) => {
  write(TEXT_KEY, id)
  update({ text: id })
  paint()
}

// "System" follows the phone/computer when it switches between light and dark
darkQuery?.addEventListener('change', () => state.theme === 'system' && paint())

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// { theme, text } — re-renders when either changes
export const useTheme = () => useSyncExternalStore(subscribe, () => state)

// Called once at start-up so the status-bar colour and text size match the saved choice
export const initTheme = paint
