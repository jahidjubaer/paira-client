import { memberTypes } from './policies.js'

// memberTypeName('active') -> { bn: 'সক্রিয় সদস্য', en: 'Active Member' }
const byId = Object.fromEntries(memberTypes.map((m) => [m.id, m.name]))

const memberTypeName = (id) => byId[id] ?? id

export default memberTypeName
