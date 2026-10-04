const DAY = 24 * 60 * 60 * 1000

// Whole days from today until the date (negative = in the past)
const daysUntil = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(0, 0, 0, 0)
  return Math.round((end - today) / DAY)
}

export default daysUntil
