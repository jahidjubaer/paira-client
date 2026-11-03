import { useContext } from 'react'
import { SiteContext } from './siteContext.js'

// { site, rules, setSite, setRules } — see data/site.js for the shape
const useSite = () => useContext(SiteContext)

export default useSite
