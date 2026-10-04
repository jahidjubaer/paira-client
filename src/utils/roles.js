// Mirrors server/utils/roles.js — which staff role manages which dashboard area ("admin" = everything)
const AREA_ROLES = {
  library: ['librarian'],
  content: ['editor'],
}

export const STAFF_ROLES = ['librarian', 'editor', 'admin']

export const canAccess = (role, area) => role === 'admin' || Boolean(AREA_ROLES[area]?.includes(role))
