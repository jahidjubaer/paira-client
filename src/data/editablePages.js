// Built-in text for the Policies, Organization and Home pages in the shape Dashboard → Page content saves,
// and how saved text is combined with the parts that stay fixed (membership type and sub-committee names).
import * as policies from './policies.js'
import * as organization from './organization.js'
import { committees } from './committees.js'
import bn from '../i18n/bn.js'
import en from '../i18n/en.js'

export const builtInPolicies = { ...policies }

export const builtInOrganization = {
  ...organization,
  // Sub-committees by id (same order as data/committees.js)
  subCommittees: committees.map(({ id, name, tasks }) => ({ id, name, tasks })),
}

// Saved entries only carry texts; names come from the built-in list with the same id
const mergeById = (builtIn, saved) => builtIn.map((item) => ({ ...item, ...saved?.find((s) => s.id === item.id) }))

export const withPolicyNames = (content) => ({ ...content, memberTypes: mergeById(policies.memberTypes, content.memberTypes) })

export const withCommitteeNames = (content) => ({ ...content, subCommittees: mergeById(builtInOrganization.subCommittees, content.subCommittees) })

// Home page: hero texts from the language files, every section shown in its usual order
export const HOME_SECTIONS = ['featured', 'ticker', 'numbers', 'features', 'events', 'books', 'weekly', 'clubs', 'voices', 'photos', 'cta']

const both = (key) => ({ bn: bn.home[key], en: en.home[key] })

export const builtInHome = {
  hero: {
    eyebrow: both('heroEyebrow'),
    title1: both('heroTitle1'),
    title2: both('heroTitle2'),
    text: both('heroText'),
    image: '',
    cardSmall: both('floatWeekly'),
    cardTitle: both('floatWeeklyTitle'),
    buttons: [
      { label: both('becomeMember'), link: '/register' },
      { label: both('browseBooks'), link: '/books' },
    ],
  },
  sections: HOME_SECTIONS.map((id) => ({ id, show: true })),
  featured: null,
}

// Sections added to the site after the admin saved show up at the end; unknown ones are dropped
export const withHomeSections = (content) => {
  const saved = (content.sections ?? []).filter((s) => HOME_SECTIONS.includes(s.id))
  const missing = HOME_SECTIONS.filter((id) => !saved.some((s) => s.id === id)).map((id) => ({ id, show: true }))
  return { ...content, sections: [...saved, ...missing] }
}
