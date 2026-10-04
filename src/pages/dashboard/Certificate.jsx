import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaPrint } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

// Printable A4-landscape certificate for an event participant or winner.
// Name and achievement come from the URL and can be edited before printing.
const Certificate = () => {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { t, pick, date } = useLanguage()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then(({ data }) => setEvent(data.event))
      .catch((err) => toast.error(apiError(err, t)))
  }, [id, t])

  const name = params.get('name') ?? ''
  const achievement = params.get('achievement') ?? ''
  const setField = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  if (!event) return <Loader />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <Link to={`/dashboard/events/${id}/registrations`} className="btn btn-ghost btn-sm rounded-full">
          <FaArrowLeft /> {t('reg.manage')}
        </Link>
        <label className="block flex-1">
          <span className="mb-1 block text-sm">{t('cert.nameLabel')}</span>
          <input value={name} onChange={(e) => setField('name', e.target.value)} maxLength={100} className="input input-sm w-full" />
        </label>
        <label className="block flex-1">
          <span className="mb-1 block text-sm">{t('cert.achievementLabel')}</span>
          <input value={achievement} onChange={(e) => setField('achievement', e.target.value)} maxLength={60} className="input input-sm w-full" />
        </label>
        <button onClick={() => window.print()} className="btn btn-primary btn-sm rounded-full"><FaPrint /> {t('cert.print')}</button>
      </div>
      <p className="text-sm text-base-content/60 print:hidden">{t('cert.hint')}</p>

      <div className="print-area">
        <div className="certificate relative aspect-[297/210] w-full overflow-hidden rounded-xl bg-[#fdf6e6] p-[4%] text-[#173d33] shadow-xl">
          <div className="absolute inset-[2.5%] rounded-lg border-[3px] border-[#1f5a48]" />
          <div className="absolute inset-[3.5%] rounded-md border border-[#e9a23b]" />
          <GiDove className="pointer-events-none absolute right-[6%] bottom-[8%] size-[22%] text-[#1f5a48] opacity-[0.07]" />

          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-full bg-[#1f5a48] text-[#fdf6e6]"><GiDove className="size-6" /></span>
              <div className="text-left leading-tight">
                <p className="font-display text-xl font-bold">{t('site.name')}</p>
                <p className="text-xs">{t('site.tagline')}</p>
              </div>
            </div>

            <h1 className="mt-[3%] font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-none font-extrabold text-[#1f5a48]">{t('cert.title')}</h1>
            <p className="mt-1 text-sm tracking-widest text-[#b4432f] uppercase">{t('cert.subtitle')}</p>

            <p className="mt-[3%] text-base">{t('cert.presented')}</p>
            <p className="mt-2 min-w-[50%] border-b-2 border-dotted border-[#1f5a48]/40 px-6 pb-1 font-display text-[clamp(1.5rem,4vw,2.75rem)] font-bold">
              {name || ' '}
            </p>

            <p className="mt-[2.5%] max-w-[75%] text-base leading-relaxed">
              {achievement ? (
                <>
                  <strong className="text-[#b4432f]">{achievement}</strong> — {pick(event.title)}
                </>
              ) : (
                <>
                  {t('cert.participation')} <strong>{pick(event.title)}</strong>
                </>
              )}
              <br />
              <span className="text-sm opacity-75">{date(event.startsAt)}</span>
            </p>

            <div className="mt-auto flex w-full justify-between px-[8%] text-sm">
              {[t('cert.signPresident'), t('cert.signSecretary')].map((role) => (
                <div key={role} className="w-[30%] border-t border-[#173d33]/60 pt-1">{role}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Certificate
