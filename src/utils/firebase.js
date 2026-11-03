import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { firebaseConfig } from './googleSignIn.js'

const auth = getAuth(initializeApp(firebaseConfig))
const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

// Opens the Google popup and returns a Firebase ID token for our server.
// Firebase's own session is dropped right away — the site uses its own login token.
export const googleIdToken = async () => {
  const { user } = await signInWithPopup(auth, provider)
  const token = await user.getIdToken()
  await signOut(auth)
  return token
}
