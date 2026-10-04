import { GiDove } from 'react-icons/gi'
import usePageTitle from '../utils/usePageTitle.js'

const PageHeader = ({ eyebrow, title, subtitle }) => {
  usePageTitle(title)
  return (
    <section className="relative overflow-hidden bg-neutral text-neutral-content">
      <div className="pointer-events-none absolute -top-32 -left-20 size-96 rounded-full bg-primary/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-40 size-80 rounded-full bg-secondary/20 blur-3xl" />
      <GiDove className="pointer-events-none absolute right-6 bottom-4 size-40 text-neutral-content/5 sm:right-16 sm:size-56" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {eyebrow && <p className="text-sm font-semibold tracking-widest text-secondary uppercase">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-extrabold sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-neutral-content/75">{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageHeader
