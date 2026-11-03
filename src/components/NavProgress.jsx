import { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'

// Thin bar at the top while the next page's code is loading (hidden for fast loads)
const NavProgress = () => {
  const loading = useNavigation().state === 'loading'
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setSlow(true), 150)
    return () => {
      clearTimeout(timer)
      setSlow(false)
    }
  }, [loading])

  if (!loading || !slow) return null
  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden" role="progressbar" aria-label="Loading">
      <div className="h-full w-1/3 animate-nav-progress rounded-full bg-secondary" />
    </div>
  )
}

export default NavProgress
