import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from 'react-icons/fa6'

const icons = { facebook: FaFacebook, youtube: FaYoutube, instagram: FaInstagram, linkedin: FaLinkedin, whatsapp: FaWhatsapp }
const labels = { facebook: 'Facebook', youtube: 'YouTube', instagram: 'Instagram', linkedin: 'LinkedIn', whatsapp: 'WhatsApp' }

// Social links set in Site settings; ones without a link are left out
export const socialLinks = (social) =>
  Object.keys(icons)
    .filter((key) => social?.[key])
    .map((key) => ({ href: social[key], label: labels[key], icon: icons[key] }))
