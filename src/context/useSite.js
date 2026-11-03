import { useContext } from 'react'
import { SiteContext } from './siteContext.js'

// { site, setSite } — contact, hours, social, payment, announcement (see data/site.js)
const useSite = () => useContext(SiteContext)

export default useSite
