import { useEffect, useRef, useState } from 'react'

// Phone bottom sheet that sits above the tab bar: close with a swipe down on the handle, a tap outside or Esc
const BottomSheet = ({ open, onClose, label, children }) => {
  const panel = useRef(null)
  const drag = useRef(null)
  const [dragY, setDragY] = useState(0)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  })

  // Only re-runs when the sheet opens or closes, so focus isn't pulled back on every render
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const onPointerDown = (e) => {
    drag.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => drag.current !== null && setDragY(Math.max(0, e.clientY - drag.current))
  const onPointerUp = () => {
    if (dragY > 90) onClose()
    drag.current = null
    setDragY(0)
  }

  return (
    <div className={`fixed inset-0 z-[35] lg:hidden ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-[var(--tabbar,0px)] mx-auto flex max-h-[80dvh] max-w-lg flex-col rounded-t-3xl bg-base-100 shadow-2xl outline-none ${
          dragY ? '' : 'transition-transform duration-300 ease-out'
        }`}
        style={{ transform: open ? `translateY(${dragY}px)` : 'translateY(110%)' }}
      >
        {/* Drag handle */}
        <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} className="flex cursor-grab touch-none justify-center pt-3 pb-2">
          <span className="h-1.5 w-12 rounded-full bg-base-content/20" />
        </div>

        <div className="space-y-6 overflow-y-auto overscroll-contain px-5 pb-6">{children}</div>
      </div>
    </div>
  )
}

export default BottomSheet
