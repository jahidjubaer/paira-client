// Firebase web settings (public values, from Firebase console → Project settings → Your apps)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// The Google button only shows once Firebase is configured
export const googleEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId)

let loading
// Firebase is big, so it loads only on the login/register pages. Start early so the
// popup still opens straight from the click (browsers block popups opened later).
export const loadFirebase = () => (loading ??= import('./firebase.js'))
