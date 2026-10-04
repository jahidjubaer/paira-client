import { useEffect, useRef, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

const supported = () => typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia

// Camera scanner for QR codes / book barcodes using the browser's built-in BarcodeDetector
// (Chrome on Android, Edge, Chrome desktop). `formats` e.g. ['qr_code'] or ['ean_13'].
const ScanDialog = ({ open, onClose, onResult, formats = ['qr_code'], title }) => {
  const { t } = useLanguage()
  const dialog = useRef(null)
  const video = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    if (!open || !supported()) return
    let stream
    let timer
    let stopped = false

    const start = async () => {
      try {
        const detector = new window.BarcodeDetector({ formats })
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (stopped) return
        video.current.srcObject = stream
        await video.current.play()
        const tick = async () => {
          if (stopped) return
          try {
            const codes = await detector.detect(video.current)
            if (codes.length) {
              onResult(codes[0].rawValue)
              return
            }
          } catch {
            // frame not ready yet
          }
          timer = setTimeout(tick, 250)
        }
        tick()
      } catch {
        setError(t('card.cameraError'))
      }
    }
    start()

    return () => {
      stopped = true
      clearTimeout(timer)
      stream?.getTracks().forEach((track) => track.stop())
    }
    // formats is a constant per use; restart only when opened/closed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <dialog
      ref={dialog}
      className="modal"
      onClose={() => {
        setError('')
        onClose()
      }}
    >
      <div className="modal-box max-w-md rounded-[2rem]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold">{title ?? t('card.scanTitle')}</h3>
          <button onClick={() => dialog.current?.close()} className="btn btn-circle btn-ghost btn-sm" aria-label={t('gallery.close')}>
            <FaXmark />
          </button>
        </div>
        {!supported() ? (
          <p className="mt-4 rounded-2xl bg-warning/15 p-4 text-sm">{t('card.scanUnsupported')}</p>
        ) : error ? (
          <p className="mt-4 rounded-2xl bg-error/10 p-4 text-sm text-error">{error}</p>
        ) : (
          <div className="relative mt-4 overflow-hidden rounded-2xl bg-black">
            <video ref={video} muted playsInline className="aspect-square w-full object-cover" />
            <div className="pointer-events-none absolute inset-10 rounded-2xl border-4 border-secondary/80" />
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  )
}

export default ScanDialog
