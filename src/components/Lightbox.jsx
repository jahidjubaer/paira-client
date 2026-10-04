import { useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

// Full-screen photo viewer. `index` is the open photo (null = closed).
const Lightbox = ({ photos, index, onChange }) => {
  const { t, pick, num } = useLanguage()
  const dialog = useRef(null)
  const touchX = useRef(null)
  const open = index !== null && photos[index]

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const go = (step) => onChange((index + step + photos.length) % photos.length)

  const handleKey = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  const photo = open ? photos[index] : null
  const caption = photo && pick(photo.caption)

  return (
    <dialog
      ref={dialog}
      onClose={() => onChange(null)}
      onKeyDown={handleKey}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touchX.current ?? 0)
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-neutral/95 p-0 text-neutral-content backdrop:bg-black/60"
    >
      {photo && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-neutral-content/70">{num(index + 1)} / {num(photos.length)}</span>
            <button onClick={() => onChange(null)} className="btn btn-circle btn-ghost text-neutral-content" aria-label={t('gallery.close')}>
              <FaXmark className="size-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
            <img src={photo.imageUrl} alt={caption || ''} className="max-h-full max-w-full rounded-2xl object-contain" />
            {photos.length > 1 && (
              <>
                <button onClick={() => go(-1)} className="btn btn-circle absolute left-4 border-0 bg-neutral-content/10 text-neutral-content hover:bg-neutral-content/20" aria-label={t('gallery.prev')}>
                  <FaChevronLeft />
                </button>
                <button onClick={() => go(1)} className="btn btn-circle absolute right-4 border-0 bg-neutral-content/10 text-neutral-content hover:bg-neutral-content/20" aria-label={t('gallery.next')}>
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          <div className="min-h-20 p-6 text-center">
            {caption && <p className="text-lg">{caption}</p>}
            {photo.credit && <p className="mt-1 text-sm text-neutral-content/60">{t('gallery.by')}: {photo.credit}</p>}
          </div>
        </div>
      )}
    </dialog>
  )
}

export default Lightbox
