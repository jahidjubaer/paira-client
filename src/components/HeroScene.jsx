import { useEffect, useRef, useState } from 'react'
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { startLakeSound } from '../utils/lakeSound.js'

// Home hero background: Niladri Lake — a book opens on the shore, its light wakes the lake and words rise from its pages.
// Drawn on a 1600×900 stage in three depth planes (far hills, the lake, the near shore) that drift apart as the
// visitor scrolls or moves the mouse (computers only). Still parts are drawn once; every moving part is its own small
// layer that only changes transform/opacity, so it animates on the graphics card without repainting (index.css, scene-*).
// It starts at night; as the book opens the night lifts and the sun rises into a bright day. Tapping the book sends
// out a burst of words.
// Resting styles are the finished picture, so reduced-motion visitors see the lit scene without movement.

const W = 1600
const H = 900
const pct = (n, of) => `${(n / of) * 100}%`
const BOOK_BOX = [930, 715, 380, 150]
const GLOW_BOX = { left: pct(600, W), top: pct(250, H), width: pct(1040, W), height: pct(1040, H) }

// Positions a layer over the drawing box [x, y, w, h]; its SVG keeps the drawing's own coordinates
const boxStyle = ([x, y, w, h]) => ({ left: pct(x, W), top: pct(y, H), width: pct(w, W), height: pct(h, H) })
const Layer = ({ box, className = '', style, children }) => (
  <div className={className} style={{ ...boxStyle(box), ...style }}>
    <svg viewBox={box.join(' ')}>{children}</svg>
  </div>
)

// Words rise from the pages and dissolve into the light: through three points; the middle one is where
// each rests without motion. Eight words, 1.3 s apart, on a 10.4 s loop, so one leaves the book steadily.
const wordPaths = [
  { x1: 1080, y1: 620, x2: 960, y2: 420, x3: 880, y3: 170 },
  { x1: 1160, y1: 610, x2: 1290, y2: 400, x3: 1400, y3: 150 },
  { x1: 1110, y1: 600, x2: 1140, y2: 250, x3: 1080, y3: 90 },
  { x1: 1150, y1: 620, x2: 1400, y2: 500, x3: 1500, y3: 260 },
  { x1: 1090, y1: 615, x2: 880, y2: 540, x3: 820, y3: 300 },
  { x1: 1130, y1: 600, x2: 1230, y2: 320, x3: 1250, y3: 90 },
  { x1: 1100, y1: 620, x2: 1010, y2: 300, x3: 960, y3: 120 },
  { x1: 1140, y1: 615, x2: 1360, y2: 220, x3: 1430, y3: 110 },
]

// Small lights rising from the pages: start position, sideways drift, delay
const motes = [
  [1100, 720, -50, 4.2], [1140, 710, 40, 4.9], [1120, 700, -15, 5.6], [1075, 730, -90, 6.3],
  [1165, 725, 80, 7.0], [1115, 715, 25, 7.7], [1135, 705, -40, 8.4], [1085, 710, 60, 9.1],
]

const stars = [[120, 80], [300, 150], [470, 60], [640, 200], [820, 90], [960, 170], [1140, 70], [1310, 140], [1480, 60], [1540, 220], [220, 260], [760, 280], [40, 190], [560, 120], [1050, 240], [1240, 40], [1400, 300], [880, 30]]

// Tree line along the far shore: rounded crowns of varying height (fixed, so every visit looks the same)
const treeLine = (() => {
  let d = 'M-100 552 '
  for (let x = -100; x < 1700; x += 28) {
    const h = 14 + Math.abs(Math.sin(x * 0.031) * 16) + Math.abs(Math.sin(x * 0.17) * 7)
    d += `C${x + 2} ${548 - h} ${x + 26} ${548 - h} ${x + 28} 548 `
  }
  return `${d}L1700 556 L-100 556 Z`
})()

// Grass tufts along the near shore, and a few wild flowers away from the book
const grass = (() => {
  let d = ''
  for (let x = -80; x < 1700; x += 22) {
    if (x > 920 && x < 1320) continue
    const y = 760 + Math.sin(x * 0.02) * 9 + (x % 3) * 4
    d += `M${x} ${y + 14} q-3 -10 -8 -16 M${x + 4} ${y + 14} q1 -12 4 -20 M${x + 8} ${y + 14} q4 -9 10 -13 `
  }
  return d
})()
const flowers = [
  [180, 820, '#f6d36b'], [240, 850, '#fff4e0'], [420, 835, '#f3a5b8'], [520, 870, '#f6d36b'], [690, 815, '#fff4e0'],
  [790, 860, '#f3a5b8'], [1360, 830, '#f6d36b'], [1420, 868, '#fff4e0'], [860, 828, '#f6d36b'], [320, 880, '#f3a5b8'],
]

const pageLines = (side) =>
  [0, 1, 2, 3].map((i) => {
    const y = 848 + i * 11
    const d = side > 0 ? `M415 ${y} C450 ${y - 11} 490 ${y - 12} 522 ${y - 6}` : `M385 ${y} C350 ${y - 11} 310 ${y - 12} 278 ${y - 6}`
    return <path key={i} d={d} stroke="#c9b993" strokeWidth="2" fill="none" strokeLinecap="round" />
  })

const RIGHT_PAGE = 'M400 838 C440 822 490 820 530 830 L540 892 C500 884 445 886 400 900 Z'
const LEFT_PAGE = 'M400 838 C360 822 310 820 270 830 L260 892 C300 884 355 886 400 900 Z'
const FRONT_HILLS = 'M-100 505 C0 490 170 470 320 455 C400 450 440 478 480 485 C620 510 760 470 900 468 C1060 466 1160 505 1300 488 C1420 474 1520 490 1700 484 L1700 552 L-100 552 Z'

const v = (name) => ({ fill: `var(--${name})` })
const stop = (name) => ({ stopColor: `var(--${name})` })

const rand = (min, max) => min + Math.random() * (max - min)

// Scroll and mouse move the depth planes; eased, and only while something is changing. Computers only (same query
// as index.css): on phones the planes stay still, so they aren't kept as huge graphics layers or restyled while scrolling.
const useParallax = (sceneRef, stageRef) => {
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const scene = sceneRef.current
    const stage = stageRef.current
    const target = { x: 0, y: 0 }
    const now = { x: 0, y: 0 }
    let frame = 0
    const step = () => {
      frame = 0
      const rect = scene.getBoundingClientRect()
      const scrolled = Math.min(1, Math.max(0, -rect.top / rect.height))
      now.x += (target.x - now.x) * 0.08
      now.y += (target.y - now.y) * 0.08
      stage.style.setProperty('--mx', now.x.toFixed(4))
      stage.style.setProperty('--my', now.y.toFixed(4))
      stage.style.setProperty('--sy', scrolled.toFixed(4))
      if (Math.abs(target.x - now.x) > 0.001 || Math.abs(target.y - now.y) > 0.001) frame = requestAnimationFrame(step)
    }
    const kick = () => {
      frame ||= requestAnimationFrame(step)
    }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
      kick()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', kick, { passive: true })
    kick()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', kick)
    }
  }, [sceneRef, stageRef])
}

const HeroScene = ({ className = '' }) => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const stageRef = useRef(null)
  const [bursts, setBursts] = useState([])
  const [tapped, setTapped] = useState(false)
  const burstCount = useRef(0)
  const words = t('home.sceneWords')

  useParallax(ref, stageRef)

  // Scrolled out of view: pause everything
  useEffect(() => {
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => el.toggleAttribute('data-offscreen', !entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Tap the book: six words fly out at once, the light flares, and the sound (if on) rings a chime
  const tapBook = () => {
    const id = ++burstCount.current
    const burst = Array.from({ length: 6 }, (_, i) => ({
      word: words[Math.floor(Math.random() * words.length)],
      x1: 1120 + (i - 2.5) * 30,
      y1: 640,
      x3: 1120 + (i - 2.5) * 150 + rand(-40, 40),
      y3: rand(80, 320),
    }))
    setBursts((list) => [...list, { id, burst }])
    setTimeout(() => setBursts((list) => list.filter((b) => b.id !== id)), 3000)
    setTapped(true)
    window.dispatchEvent(new Event('paira:book'))
  }

  return (
    <div ref={ref} className={`hero-scene ${className}`} role="img" aria-label={t('home.sceneLabel')}>
      <div ref={stageRef} className="scene-stage">
        {/* Far: sky, the rising sun, clouds, three hill ranges, the tree line and mist on the far shore */}
        <div className="scene-plane" style={{ '--depth': 0.2 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ inset: 0 }}>
            <defs>
              <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={stop('sky-1')} />
                <stop offset="0.55" style={stop('sky-2')} />
                <stop offset="1" style={stop('sky-3')} />
              </linearGradient>
              <radialGradient id="scene-halo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#fff1c9" stopOpacity="0.8" />
                <stop offset="1" stopColor="#fff1c9" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="-100" y="-260" width="1800" height="820" fill="url(#scene-sky)" />
          </svg>
          {/* The sun climbs from behind the hills, so its layer sits between the sky and the hills */}
          <Layer box={[1070, 30, 320, 320]} className="scene-sun">
            <circle cx="1230" cy="190" r="160" fill="url(#scene-halo)" />
            <circle cx="1230" cy="190" r="44" fill="#ffe7a3" />
          </Layer>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ inset: 0 }}>
            <defs>
              <linearGradient id="scene-mist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={stop('mist')} stopOpacity="0" />
                <stop offset="0.7" style={stop('mist')} stopOpacity="0.55" />
                <stop offset="1" style={stop('mist')} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M-100 430 C100 360 260 340 420 380 C560 410 700 330 860 320 C1020 310 1140 380 1300 350 C1440 325 1560 360 1700 340 L1700 552 L-100 552 Z" style={v('hill-far')} />
            <path d="M-100 480 C0 440 150 400 280 395 C330 393 380 405 420 420 C560 455 640 380 800 360 C960 340 1060 420 1200 395 C1320 375 1440 420 1700 400 L1700 552 L-100 552 Z" style={v('hill-back')} />
            <path d={FRONT_HILLS} style={v('hill-front')} />
            <path d={treeLine} style={v('trees')} />
            <rect x="-100" y="500" width="1800" height="70" fill="url(#scene-mist)" />
          </svg>
          <Layer box={[-100, 40, 1800, 240]} className="scene-clouds">
            <g style={v('cloud')} opacity="0.75">
              <path d="M140 140 q20 -40 70 -30 q30 -40 90 -15 q50 -10 60 30 q30 5 25 30 h-280 q-15 -15 35 -15 Z" />
              <path d="M820 100 q15 -30 55 -22 q25 -32 75 -10 q40 -6 45 24 q25 5 20 25 h-225 q-10 -12 30 -17 Z" />
              <path d="M1260 200 q12 -25 45 -18 q22 -26 62 -8 q34 -5 38 20 q20 4 16 20 h-185 q-8 -10 24 -14 Z" />
            </g>
          </Layer>
        </div>

        {/* Lake: water, the hills mirrored in it, a sheen, ripples, a small boat */}
        <div className="scene-plane" style={{ '--depth': 0.5 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ inset: 0 }}>
            <defs>
              <linearGradient id="scene-lake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={stop('lake-1')} />
                <stop offset="0.5" style={stop('lake-2')} />
                <stop offset="1" style={stop('lake-3')} />
              </linearGradient>
            </defs>
            <rect x="-100" y="548" width="1800" height="240" fill="url(#scene-lake)" />
            <path transform="matrix(1 0 0 -1 0 1100)" d={FRONT_HILLS} style={v('hill-front')} opacity="0.3" />
            <rect x="-100" y="556" width="1800" height="10" fill="#ffffff" opacity="0.18" />
          </svg>
          <Layer box={[0, 570, W, 180]} className="scene-ripples">
            <path d="M80 590 h70 M300 620 h50 M560 585 h90 M760 640 h60 M160 680 h80 M520 700 h70 M900 600 h40 M1290 630 h50 M1400 590 h80 M1480 690 h60" stroke="#e8fbf8" strokeLinecap="round" strokeWidth="3" opacity="0.45" />
          </Layer>
          <Layer box={[0, 570, W, 180]} className="scene-ripples scene-ripples-slow">
            <path d="M40 640 h50 M420 660 h60 M680 600 h45 M260 730 h55 M960 690 h40 M1340 720 h50 M1530 610 h40" stroke="#e8fbf8" strokeLinecap="round" strokeWidth="2.5" opacity="0.3" />
          </Layer>
          <Layer box={[540, 600, 140, 70]} className="scene-boat">
            <path d="M548 640 Q610 664 672 640 L662 652 Q610 670 558 652 Z" fill="#5b3a26" />
            <path d="M560 641 Q610 657 660 641" stroke="#8a5a3a" strokeWidth="3" fill="none" />
            <path d="M600 640 L604 606 L608 640" fill="#3d2a1e" />
            <ellipse cx="610" cy="662" rx="64" ry="4" fill="#0b3a40" opacity="0.25" />
          </Layer>
        </div>

        {/* Near shore: grass, flowers, stones, reeds and a hijol tree */}
        <div className="scene-plane" style={{ '--depth': 1 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ inset: 0 }}>
            <defs>
              <linearGradient id="scene-shore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={stop('shore-1')} />
                <stop offset="1" style={stop('shore-2')} />
              </linearGradient>
            </defs>
            <path d="M-100 774 C0 770 200 745 420 760 C640 775 860 750 1000 738 C1060 734 1090 740 1120 742 C1300 752 1450 735 1700 745 L1700 1000 L-100 1000 Z" fill="url(#scene-shore)" />
            <path d={grass} style={{ stroke: 'var(--shore-1)' }} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
            {flowers.map(([x, y, color]) => <circle key={x} cx={x} cy={y} r="4" fill={color} opacity="0.85" />)}
            <ellipse cx="1120" cy="864" rx="210" ry="13" fill="#0b1a12" opacity="0.3" />
            <g fill="#8b8f84">
              <ellipse cx="900" cy="852" rx="22" ry="10" />
              <ellipse cx="925" cy="858" rx="12" ry="6" fill="#a3a79b" />
              <ellipse cx="1335" cy="850" rx="18" ry="8" />
            </g>
            {/* Hijol tree at the right edge, framing the book */}
            <path d="M1600 900 C1598 820 1590 760 1606 690 C1612 660 1630 640 1640 620 L1660 624 C1646 660 1630 700 1632 760 C1634 820 1640 860 1650 900 Z" fill="#3b2a20" />
            <g style={v('tree-crown')}>
              {[[1600, 540, 58], [1540, 580, 44], [1660, 575, 52], [1570, 500, 40], [1630, 490, 44], [1500, 620, 34], [1690, 630, 40], [1600, 610, 46]].map(([cx, cy, r]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
              ))}
            </g>
            <g fill="#ffffff" opacity="0.1">
              {[[1585, 520, 30], [1530, 565, 22], [1645, 555, 26], [1615, 470, 20]].map(([cx, cy, r]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
              ))}
            </g>
          </svg>
          <Layer box={[0, 720, 130, 180]} className="scene-reeds">
            <path d="M40 880 C38 830 46 780 54 730 M62 885 C64 830 60 790 74 750 M84 890 C86 840 96 800 110 766 M24 895 C22 850 18 820 10 790" stroke="#2b4d31" strokeWidth="4" strokeLinecap="round" fill="none" />
          </Layer>
          <Layer box={[1440, 725, 130, 175]} className="scene-reeds scene-reeds-late">
            <path d="M1520 880 C1522 830 1514 780 1506 734 M1498 888 C1496 832 1502 794 1488 756 M1476 894 C1474 844 1464 806 1450 772 M1540 895 C1542 850 1546 820 1554 794" stroke="#2b4d31" strokeWidth="4" strokeLinecap="round" fill="none" />
          </Layer>
          <Layer box={[1370, 760, 50, 120]} className="scene-reeds">
            <path d="M1380 870 C1378 830 1384 800 1392 770 M1398 875 C1400 836 1396 806 1410 780" stroke="#2b4d31" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </Layer>
        </div>

        {/* Night before the book opens: a dark veil with moon and stars over the day scene; it lifts as the light spreads */}
        <div className="scene-night scene-night-veil" />
        <div className="scene-night">
          <svg viewBox={`0 0 ${W} ${H}`}>
            <circle cx="330" cy="150" r="90" fill="url(#scene-halo)" opacity="0.5" />
            <path d="M330 120 A30 30 0 1 0 330 180 A38 38 0 0 1 330 120 Z" fill="#fdf3d8" />
            <g fill="#fdf6e6">
              {stars.map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.2" />)}
            </g>
          </svg>
        </div>

        {/* The book and its light, on the near plane */}
        <div className="scene-plane" style={{ '--depth': 1 }}>
          <div className="scene-glow" style={GLOW_BOX} />
          <Layer box={[870, 120, 500, 650]} className="scene-beams">
            <defs>
              <linearGradient id="scene-beam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
                <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="url(#scene-beam)">
              <path d="M1110 760 L880 200 L950 190 L1116 760 Z" opacity="0.35" />
              <path d="M1114 760 L1050 130 L1105 128 L1122 760 Z" opacity="0.45" />
              <path d="M1120 760 L1170 130 L1225 136 L1128 760 Z" opacity="0.4" />
              <path d="M1126 760 L1300 210 L1365 225 L1132 760 Z" opacity="0.3" />
            </g>
          </Layer>
          <Layer box={[990, 645, 260, 95]} className="scene-shimmer">
            <g fill="#fff6d6">
              <ellipse cx="1120" cy="732" rx="120" ry="6" opacity="0.7" />
              <ellipse cx="1108" cy="706" rx="80" ry="5" opacity="0.55" />
              <ellipse cx="1132" cy="680" rx="52" ry="4" opacity="0.45" />
              <ellipse cx="1116" cy="656" rx="34" ry="3" opacity="0.35" />
            </g>
          </Layer>

          {/* The book: its own small layer, so turning pages only redraws the book */}
          <Layer box={BOOK_BOX}>
            <g transform="translate(600 -341) scale(1.3)">
              <path d="M258 896 C300 890 355 892 400 906 C445 892 500 890 542 896 L540 912 C500 906 445 908 400 922 C355 908 300 906 260 912 Z" fill="#1f5244" />
              <path d="M262 892 C300 886 355 888 400 902 C445 888 500 886 538 892 L536 902 C498 896 445 898 400 912 C355 898 302 896 264 902 Z" fill="#e8dcc0" />
              <path d={RIGHT_PAGE} fill="#fffaf0" />
              <g>{pageLines(1)}</g>
              <g className="scene-unfold" style={{ animationDelay: '1.9s' }}>
                <path d={LEFT_PAGE} fill="#fffaf0" />
                {pageLines(-1)}
              </g>
              <path className="scene-fold" style={{ animationDelay: '3s' }} d={RIGHT_PAGE} fill="#f6efdd" />
              <g className="scene-unfold" style={{ animationDelay: '3.5s' }}>
                <path d={LEFT_PAGE} fill="#f6efdd" />
                {pageLines(-1)}
              </g>
              <path d="M400 838 L400 900" stroke="#d8c9a4" strokeWidth="2" />
              <g className="scene-fold" style={{ animationDelay: '1.2s' }}>
                <path d="M400 836 C442 818 494 816 534 826 L544 894 C502 886 446 888 400 902 Z" fill="#245e4f" />
                <path d="M440 838 C470 830 500 829 520 833" stroke="#e7b75b" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            </g>
          </Layer>

          {motes.map(([x, y, dx, delay]) => (
            <div key={delay} className="scene-mote" style={{ left: pct(x - 3.5, W), top: pct(y - 3.5, H), animationDelay: `${delay}s`, '--dx': dx }} />
          ))}
          {words.map((word, i) => {
            const { x1, y1, x2, y2, x3, y3 } = wordPaths[i % wordPaths.length]
            return (
              <span key={i} className="scene-word" aria-hidden="true" style={{ animationDelay: `${3.6 + i * 1.3}s`, '--x1': x1, '--y1': y1, '--x2': x2, '--y2': y2, '--x3': x3, '--y3': y3 }}>
                {word}
              </span>
            )
          })}

          {/* Tap the book */}
          {bursts.map(({ id }) => <div key={id} className="scene-flash" style={GLOW_BOX} />)}
          {bursts.flatMap(({ id, burst }) =>
            burst.map(({ word, x1, y1, x3, y3 }, i) => (
              <span key={`${id}-${i}`} className="scene-burst" aria-hidden="true" style={{ animationDelay: `${i * 0.08}s`, '--x1': x1, '--y1': y1, '--x3': x3, '--y3': y3 }}>
                {word}
              </span>
            )),
          )}
          <button type="button" onClick={tapBook} className="scene-book" style={boxStyle(BOOK_BOX)} aria-label={t('home.tapBook')} title={t('home.tapBook')} />
          {!tapped && (
            <span className="scene-hint" aria-hidden="true" style={{ left: pct(1120, W), top: pct(690, H) }}>
              {t('home.tapBook')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Lake sound: on unless the visitor turned it off before. Browsers keep pages silent until the visitor
// touches them, so the sound is only built on their first tap, click or key press (or right away if they
// already interacted, e.g. came here from another page). A click on this button before that starts it.
const SOUND_KEY = 'paira-lake-sound'
const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'keydown']

export const LakeSoundToggle = ({ className = '' }) => {
  const { t } = useLanguage()
  const [on, setOn] = useState(() => localStorage.getItem(SOUND_KEY) !== 'off')
  const sound = useRef(null)

  useEffect(() => {
    if (!on) return
    const start = (e) => {
      if (e?.target.closest?.('[data-sound-toggle]')) return
      GESTURES.forEach((type) => window.removeEventListener(type, start, true))
      sound.current ??= startLakeSound()
    }
    // Tapping the book rings a chime
    const chime = () => sound.current?.chime()
    if (navigator.userActivation?.hasBeenActive) start()
    else GESTURES.forEach((type) => window.addEventListener(type, start, true))
    window.addEventListener('paira:book', chime)
    return () => {
      GESTURES.forEach((type) => window.removeEventListener(type, start, true))
      window.removeEventListener('paira:book', chime)
      sound.current?.stop()
      sound.current = null
    }
  }, [on])

  const toggle = () => {
    if (on && !sound.current) {
      sound.current = startLakeSound()
      return
    }
    if (on && sound.current.blocked()) {
      sound.current.resume()
      return
    }
    localStorage.setItem(SOUND_KEY, on ? 'off' : 'on')
    setOn(!on)
  }

  const label = on ? t('home.soundOff') : t('home.soundOn')
  return (
    <button type="button" data-sound-toggle onClick={toggle} aria-pressed={on} aria-label={label} title={label} className={className}>
      {on ? <FaVolumeHigh /> : <FaVolumeXmark />}
    </button>
  )
}

export default HeroScene
