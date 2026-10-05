import { Link } from 'react-router'
import { FaArrowRight, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaLocationDot, FaPhone, FaWhatsapp, FaYoutube } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import Logo from './Logo.jsx'
import { mainLinks, moreLinks } from './navLinks.js'
import { contactInfo, openingHours, socialLinks } from '../data/site.js'

const socials = [
  { href: socialLinks.facebook, label: 'Facebook', icon: FaFacebook },
  { href: socialLinks.youtube, label: 'YouTube', icon: FaYoutube },
  { href: socialLinks.instagram, label: 'Instagram', icon: FaInstagram },
  { href: socialLinks.linkedin, label: 'LinkedIn', icon: FaLinkedin },
  { href: socialLinks.whatsapp, label: 'WhatsApp', icon: FaWhatsapp },
]

const year = new Date().getFullYear()

const Footer = () => {
  const { t, pick, num } = useLanguage()

  return (
    <footer className="grain relative overflow-hidden bg-neutral text-neutral-content">
      <div className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16">
        {/* Top: slogan + CTA */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-neutral-content/10 pb-12 md:flex-row md:items-end">
          <p className="max-w-2xl font-display text-3xl leading-tight font-bold sm:text-4xl">“{t('site.slogan')}”</p>
          <Link to="/register" className="btn btn-secondary rounded-full px-6">
            {t('nav.register')} <FaArrowRight />
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-5">
            <Logo light />
            <p className="max-w-sm text-neutral-content/70">{t('footer.about')}</p>
            <div className="flex gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} aria-label={label} className="grid size-10 place-items-center rounded-full bg-neutral-content/10 transition hover:bg-secondary hover:text-secondary-content">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-bold">{t('footer.quickLinks')}</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[...mainLinks.slice(1), ...moreLinks].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-neutral-content/70 transition hover:text-secondary">{t(`nav.${link.key}`)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-bold">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-neutral-content/70">
              <li className="flex items-center gap-3"><FaLocationDot className="text-secondary" /> {pick(contactInfo.address)}</li>
              <li className="flex items-center gap-3"><FaPhone className="text-secondary" /> {contactInfo.phone}</li>
              <li className="flex items-center gap-3"><FaEnvelope className="text-secondary" /> {contactInfo.email}</li>
            </ul>
            <h3 className="mt-6 mb-2 font-display text-lg font-bold">{t('home.hoursTitle')}</h3>
            <ul className="space-y-1 text-sm text-neutral-content/70">
              {openingHours.map((h) => (
                <li key={h.days.en}><span className="font-medium text-neutral-content">{pick(h.days)}:</span> {pick(h.time)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <p aria-hidden="true" className="pointer-events-none -mb-4 font-display text-[22vw] leading-none font-extrabold text-neutral-content/[0.04] select-none sm:-mb-8 lg:text-[16rem]">
          {t('site.name')}
        </p>
      </div>

      <div className="relative border-t border-neutral-content/10 py-5 text-center text-sm text-neutral-content/60">
        © {num(year)} {t('site.name')} — {t('footer.rights')}
      </div>
    </footer>
  )
}

export default Footer
