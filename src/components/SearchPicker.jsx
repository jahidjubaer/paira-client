import { useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'

// Type to search, then pick one result. `fetcher(query)` returns a list of items.
const SearchPicker = ({ label, placeholder, fetcher, renderItem, value, onChange }) => {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    let active = true
    const timer = setTimeout(() => {
      fetcher(query.trim())
        .then((list) => active && setItems(list))
        .catch(() => active && setItems([]))
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, open, fetcher])

  if (value) {
    return (
      <div>
        <span className="mb-1 block text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-primary bg-primary/5 px-4 py-2.5">
          <div className="min-w-0 flex-1">{renderItem(value)}</div>
          <button type="button" onClick={() => onChange(null)} className="btn btn-ghost btn-xs btn-circle" aria-label="Clear">
            <FaXmark />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{label}</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="input w-full"
        />
      </label>
      {open && items.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-1 shadow-xl">
          {items.map((item) => (
            <li key={item._id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(item)
                  setQuery('')
                  setOpen(false)
                }}
                className="w-full rounded-xl px-3 py-2 text-left hover:bg-base-200"
              >
                {renderItem(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchPicker
