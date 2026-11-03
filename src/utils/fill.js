// fill('Keep it for {days} days', { days: '১৪' }) → 'Keep it for ১৪ days'
const fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match))

export default fill
