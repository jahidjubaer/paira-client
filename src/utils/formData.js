// Turns form fields like "title.bn" / "title.en" into { title: { bn, en } }
export const nestedFormData = (form) => {
  const result = {}
  for (const [key, value] of new FormData(form)) {
    const [field, sub] = key.split('.')
    if (sub) result[field] = { ...result[field], [sub]: value }
    else result[field] = value
  }
  return result
}

// Date -> value for <input type="datetime-local"> in the user's local time
export const toLocalInput = (value) => {
  if (!value) return ''
  const d = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// <input type="datetime-local"> value (local time) -> ISO string, or null when empty
export const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null)
