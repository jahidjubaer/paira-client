const SectionTitle = ({ title, subtitle, center = false }) => {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <h2 className="text-2xl font-bold text-primary sm:text-3xl">{title}</h2>
      <span className={`mt-2 block h-1 w-16 rounded bg-secondary ${center ? 'mx-auto' : ''}`} />
      {subtitle && <p className="mt-3 opacity-80">{subtitle}</p>}
    </div>
  )
}

export default SectionTitle
