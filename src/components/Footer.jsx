import { Link } from 'react-router'
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaLocationDot, FaPhone, FaWhatsapp, FaYoutube } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import Logo from './Logo.jsx'
import { mainLinks, moreLinks } from './navLinks.js'
import { contactInfo, socialLinks } from '../data/site.js'

const socials = [
  { href: socialLinks.facebook, label: 'Facebook', icon: FaFacebook },
  { href: socialLinks.youtube, label: 'YouTube', icon: FaYoutube },
  { href: socialLinks.instagram, label: 'Instagram', icon: FaInstagram },
  { href: socialLinks.linkedin, label: 'LinkedIn', icon: FaLinkedin },
  { href: socialLinks.whatsapp, label: 'WhatsApp', icon: FaWhatsapp },
]

const year = new Date().getFullYear()

const Footer = () => {
  const { t, pick } = useLanguage()

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <Logo light />
          <p className="max-w-md opacity-80">{t('footer.about')}</p>
          <p className="italic text-secondary">"{t('site.slogan')}"</p>
        </div>

        <div>
          <h3 className="footer-title">{t('footer.quickLinks')}</h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {[...mainLinks.slice(1), ...moreLinks].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link link-hover opacity-80">{t(`nav.${link.key}`)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-title">{t('footer.contact')}</h3>
          <ul className="space-y-3 opacity-80">
            <li className="flex items-center gap-2"><FaLocationDot /> {pick(contactInfo.address)}</li>
            <li className="flex items-center gap-2"><FaPhone /> {contactInfo.phone}</li>
            <li className="flex items-center gap-2"><FaEnvelope /> {contactInfo.email}</li>
          </ul>
          <h3 className="footer-title mt-6">{t('footer.follow')}</h3>
          <div className="flex gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} aria-label={label} className="btn btn-circle btn-sm btn-ghost">
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-content/10 py-4 text-center text-sm opacity-70">
        © {year} {t('site.name')} — {t('footer.rights')}
      </div>
    </footer>
  )
}

export default Footer
