// Section heading: small eyebrow label, large title, optional subtitle and action on the right
const SectionTitle = ({ eyebrow, title, subtitle, action, center = false, light = false }) => {
  return (
    <div className={`mb-10 flex flex-wrap items-end gap-4 ${center ? 'justify-center text-center' : 'justify-between'}`}>
      <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className={`text-sm font-semibold tracking-widest uppercase ${light ? 'text-secondary' : 'text-accent'}`}>{eyebrow}</p>
        )}
        <h2 className="mt-2 text-3xl leading-tight font-bold sm:text-5xl">{title}</h2>
        {subtitle && <p className={`mt-3 text-lg ${light ? 'text-neutral-content/75' : 'text-base-content/70'}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default SectionTitle
