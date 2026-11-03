// Soft lake ambience made in the browser — lapping water, birdsong and a slow chime. No audio file to download.
// Browsers only allow sound after the visitor has touched the page, so until then it waits silently and
// starts on their first tap, click or key press. Returns { stop, blocked, resume, chime }.
const CHIME_NOTES = [523.25, 587.33, 659.25, 783.99, 880] // C major pentatonic
const rand = (min, max) => min + Math.random() * (max - min)

// Brown noise that loops without a click: the tail is cross-faded into the head
const waterBuffer = (ctx) => {
  const length = ctx.sampleRate * 6
  const fade = ctx.sampleRate
  const raw = new Float32Array(length + fade)
  let last = 0
  for (let i = 0; i < raw.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    raw[i] = last * 3.5
  }
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = i < fade ? raw[i] * (i / fade) + raw[length + i] * (1 - i / fade) : raw[i]
  }
  return buffer
}

export const startLakeSound = () => {
  const ctx = new AudioContext()
  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(0.7, now + 2)
  master.connect(ctx.destination)

  // Water: low-passed noise with a slow swell, like small waves on the shore
  const water = ctx.createBufferSource()
  water.buffer = waterBuffer(ctx)
  water.loop = true
  const waterFilter = ctx.createBiquadFilter()
  waterFilter.type = 'lowpass'
  waterFilter.frequency.value = 520
  const waterGain = ctx.createGain()
  waterGain.gain.value = 0.35
  const swell = ctx.createOscillator()
  swell.frequency.value = 0.13
  const swellDepth = ctx.createGain()
  swellDepth.gain.value = 0.2
  swell.connect(swellDepth).connect(waterGain.gain)
  water.connect(waterFilter).connect(waterGain).connect(master)
  water.start()
  swell.start()

  // Chime echo: a short feedback delay, darkened so the repeats stay soft
  const echo = ctx.createDelay()
  echo.delayTime.value = 0.38
  const echoFeedback = ctx.createGain()
  echoFeedback.gain.value = 0.32
  const echoTone = ctx.createBiquadFilter()
  echoTone.type = 'lowpass'
  echoTone.frequency.value = 1800
  echo.connect(echoTone).connect(echoFeedback).connect(echo)
  echoTone.connect(master)

  const chirp = (time, freq, out) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.setValueAtTime(freq, time)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.45, time + 0.05)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, time + 0.12)
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.05, time + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14)
    osc.connect(gain).connect(out)
    osc.start(time)
    osc.stop(time + 0.16)
  }

  // A bird somewhere left or right sings 2–5 quick notes
  const song = () => {
    const pan = ctx.createStereoPanner()
    pan.pan.value = rand(-0.8, 0.8)
    pan.connect(master)
    const base = rand(2200, 3600)
    const notes = Math.floor(rand(2, 6))
    for (let i = 0; i < notes; i++) chirp(ctx.currentTime + i * rand(0.13, 0.2), base * rand(0.92, 1.08), pan)
  }

  // A bell: a sine with two faint overtones and a long fade
  const chime = () => {
    const time = ctx.currentTime
    const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)]
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.09, time + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.5)
    gain.connect(master)
    gain.connect(echo)
    for (const [ratio, level] of [[1, 1], [2, 0.3], [3.01, 0.1]]) {
      const osc = ctx.createOscillator()
      const partial = ctx.createGain()
      osc.frequency.value = freq * ratio
      partial.gain.value = level
      osc.connect(partial).connect(gain)
      osc.start(time)
      osc.stop(time + 3.6)
    }
  }

  // Hidden tabs skip a beat instead of piling sounds up for when the tab comes back
  const timers = new Set()
  const every = (fn, min, max, first) => {
    const next = (delay) => {
      const id = setTimeout(() => {
        timers.delete(id)
        if (!document.hidden && ctx.state === 'running') fn()
        next(rand(min, max))
      }, delay)
      timers.add(id)
    }
    next(first)
  }
  every(song, 2000, 6000, 1200)
  every(chime, 7000, 12000, 2500)

  // Still blocked: start on the first interaction anywhere. The sound button handles its own click.
  const unlockEvents = ['pointerdown', 'pointerup', 'touchend', 'keydown']
  const unlock = (e) => {
    if (e.target.closest?.('[data-sound-toggle]')) return
    resume()
  }
  const removeUnlock = () => unlockEvents.forEach((type) => window.removeEventListener(type, unlock, true))
  const resume = () => {
    removeUnlock()
    return ctx.resume().catch(() => {})
  }
  if (ctx.state !== 'running') unlockEvents.forEach((type) => window.addEventListener(type, unlock, true))

  // Quiet while the tab is hidden
  let suspendedByTab = false
  const onVisibility = () => {
    if (document.hidden && ctx.state === 'running') {
      suspendedByTab = true
      ctx.suspend()
    } else if (!document.hidden && suspendedByTab) {
      suspendedByTab = false
      ctx.resume()
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  const stop = () => {
    timers.forEach(clearTimeout)
    removeUnlock()
    document.removeEventListener('visibilitychange', onVisibility)
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    setTimeout(() => ctx.close(), 700)
  }

  return { stop, resume, chime, blocked: () => ctx.state !== 'running' && !suspendedByTab }
}
