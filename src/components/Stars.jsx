import { FaRegStar, FaStar, FaStarHalfStroke } from 'react-icons/fa6'

// Read-only stars (supports halves) or, with onChange, a 1–5 picker
const Stars = ({ value = 0, onChange, size = 'size-4', label = 'Rating' }) => {
  if (onChange) {
    return (
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n}`}
            onClick={() => onChange(value === n ? 0 : n)}
            className="text-warning transition hover:scale-110"
          >
            {n <= value ? <FaStar className="size-6" /> : <FaRegStar className="size-6" />}
          </button>
        ))}
      </div>
    )
  }
  return (
    <span className="inline-flex gap-0.5 text-warning" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        value >= n ? <FaStar key={n} className={size} /> : value >= n - 0.5 ? <FaStarHalfStroke key={n} className={size} /> : <FaRegStar key={n} className={size} />,
      )}
    </span>
  )
}

export default Stars
