// Loads a page's code only when it is opened, e.g. lazyPage(() => import('../pages/Books.jsx')).
// Pass props for pages shared by several routes (archive/podcast).
const RELOAD_KEY = 'paira-chunk-reload'

const lazyPage = (load, props) => async () => {
  let mod
  try {
    mod = await load()
    sessionStorage.removeItem(RELOAD_KEY)
  } catch (err) {
    // After a new deploy, an open tab may ask for page files that no longer exist:
    // reload once to get the new version instead of showing an error.
    if (!sessionStorage.getItem(RELOAD_KEY)) {
      sessionStorage.setItem(RELOAD_KEY, '1')
      window.location.reload()
      return new Promise(() => {}) // keep the old page until the reload happens
    }
    throw err
  }
  const Page = mod.default
  if (!props) return { Component: Page }
  const { key, ...rest } = props // key can't be spread into JSX
  return { element: <Page key={key} {...rest} /> }
}

export default lazyPage
