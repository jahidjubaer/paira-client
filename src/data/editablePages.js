// Built-in text for the Policies and Organization pages in the shape Dashboard → Page content saves,
// and how saved text is combined with the parts that stay fixed (membership type and sub-committee names).
import * as policies from './policies.js'
import * as organization from './organization.js'
import { committees } from './committees.js'

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
