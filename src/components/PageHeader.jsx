const PageHeader = ({ title, subtitle }) => {
  return (
    <section className="bg-primary py-14 text-center text-primary-content">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-lg opacity-90">{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageHeader
