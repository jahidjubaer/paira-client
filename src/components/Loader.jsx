import { useLocation } from 'react-router'
import BookCover from './BookCover.jsx'

// `full`: page-level wait where the layout isn't known yet (dots). Otherwise grey rows shaped like a list.
const Loader = ({ full = false }) => {
  if (full) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <span className="loading loading-dots loading-lg text-primary" />
      </div>
    )
  }
  return (
    <div className="space-y-3 py-4" aria-busy="true">
      <div className="skeleton h-8 w-48 rounded-xl" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl bg-base-100 p-4">
          <div className="skeleton size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Book page while it loads. The cover from the list card (passed as link state) shows at once,
// so the card's cover can grow into it.
export const BookSkeleton = () => {
  const preview = useLocation().state?.book
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
      <div className="skeleton h-8 w-40 rounded-full" />
      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="mx-auto w-full max-w-xs" style={{ viewTransitionName: 'book-cover' }}>
          {preview ? <BookCover book={preview} /> : <div className="skeleton aspect-[2/3] w-full rounded-2xl" />}
        </div>
        <div className="space-y-4">
          <div className="skeleton h-4 w-24" />
          {preview ? <h1 className="text-4xl leading-tight font-extrabold sm:text-5xl">{preview.title}</h1> : <div className="skeleton h-12 w-3/4" />}
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-11 w-64 rounded-full" />
          <div className="skeleton h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// Pages that start with a dark banner (event, archive/podcast item)
export const BannerSkeleton = () => (
  <div aria-busy="true">
    <div className="bg-neutral">
      <div className="mx-auto max-w-5xl space-y-4 px-4 pt-14 pb-16">
        <div className="skeleton h-6 w-28 rounded-full bg-neutral-content/10" />
        <div className="skeleton h-12 w-3/4 bg-neutral-content/10" />
        <div className="skeleton h-5 w-1/2 bg-neutral-content/10" />
      </div>
    </div>
    <div className="mx-auto max-w-5xl space-y-3 px-4 py-10">
      {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-4" style={{ width: `${95 - i * 12}%` }} />)}
    </div>
  </div>
)

// Photo album while it loads
export const GridSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10" aria-busy="true">
    <div className="skeleton h-10 w-1/2" />
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}
    </div>
  </div>
)

export default Loader
