import { subCommittees } from './organization.js'

// Ids must match COMMITTEES in server/models/Volunteer.js (same order as subCommittees)
const ids = ['library', 'education', 'culture', 'welfare', 'it-media', 'fundraising']

export const committees = ids.map((id, i) => ({ id, name: subCommittees[i].name, tasks: subCommittees[i].tasks }))

const byId = Object.fromEntries(committees.map((c) => [c.id, c.name]))

export const committeeName = (id) => byId[id] ?? id
