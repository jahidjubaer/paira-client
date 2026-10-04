const Loader = ({ full = false }) => (
  <div className={`grid place-items-center ${full ? 'min-h-[60vh]' : 'py-16'}`}>
    <span className="loading loading-dots loading-lg text-primary" />
  </div>
)

export default Loader
