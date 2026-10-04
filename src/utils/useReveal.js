import { useEffect } from 'react'

// Fades sections in as they scroll into view.
// Marks top-level <section>s inside <main> with data-reveal and watches for new ones
// (lists that load later), so pages don't need to opt in one by one.
const useReveal = (key) => {
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main || !('IntersectionObserver' in window)) return
    document.documentElement.classList.add('reveal-ready')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    const scan = () => {
      for (const el of main.querySelectorAll('section')) {
        if (el.dataset.reveal !== undefined) continue
        // Only the outermost sections animate, not sections nested inside them
        if (el.parentElement?.closest('[data-reveal]')) continue
        el.dataset.reveal = ''
        io.observe(el)
      }
    }

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(main, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [key])
}

export default useReveal
