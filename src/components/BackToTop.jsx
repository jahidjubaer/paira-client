import { FaArrowUp } from 'react-icons/fa6'
import useScrolled from '../utils/useScrolled.js'

const BackToTop = () => {
  const show = useScrolled(700)
  return (
    <button
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
      className={`btn btn-circle btn-primary fixed right-5 bottom-[calc(var(--tabbar,0px)+1.25rem)] lg:bottom-5 z-40 shadow-xl transition duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <FaArrowUp />
    </button>
  )
}

export default BackToTop
