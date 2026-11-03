import { Link } from 'react-router'

// Friendly "nothing here" box: icon on a soft blob with a few sparkles, a line of text and an optional action.
// action: { label, to } for a link or { label, onClick } for a button
const EmptyState = ({ icon: Icon, text, action, className = '' }) => (
  <div className={`flex flex-col items-center rounded-[2rem] bg-base-200 px-6 py-14 text-center ${className}`}>
    <div className="relative grid size-28 place-items-center">
      <svg viewBox="0 0 112 112" className="absolute inset-0 size-full text-primary" aria-hidden="true">
        <path fill="currentColor" opacity="0.1" d="M58 8c22 2 44 18 46 42s-12 46-36 52S14 98 9 74 22 6 58 8z" />
        <g fill="var(--color-secondary)">
          <circle cx="94" cy="20" r="4" />
          <circle cx="16" cy="30" r="2.5" />
          <circle cx="100" cy="86" r="2" />
        </g>
        <path fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" d="M20 92l6-6M23 86l6 6" opacity="0.6" />
      </svg>
      <Icon className="relative size-11 text-primary/70" />
    </div>
    <p className="mt-4 max-w-md text-lg text-base-content/70">{text}</p>
    {action &&
      (action.to ? (
        <Link to={action.to} className="btn btn-primary btn-sm mt-5 rounded-full">{action.label}</Link>
      ) : (
        <button onClick={action.onClick} className="btn btn-primary btn-sm mt-5 rounded-full">{action.label}</button>
      ))}
  </div>
)

export default EmptyState
