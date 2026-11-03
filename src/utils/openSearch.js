// Opens the site-wide search box (SearchDialog listens for this event)
const openSearch = () => window.dispatchEvent(new Event('paira:search'))

export default openSearch
