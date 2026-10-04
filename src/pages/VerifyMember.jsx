import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import Loader from '../components/Loader.jsx'
import usePageTitle from '../utils/usePageTitle.js'
import memberTypeName from '../data/memberTypeName.js'

// /member/:memberNo — opened by scanning the QR code on a member card
const VerifyMember = () => {
  const { memberNo } = useParams()
  const { t, pick, date } = useLanguage()
  const [state, setState] = useState({ status: 'loading' })
  usePageTitle(t('card.verifyTitle'))

  useEffect(() => {
    api
      .get(`/members/verify/${encodeURIComponent(memberNo)}`)
      .then(({ data }) => setState({ status: 'found', member: data.member }))
      .catch(() => setState({ status: 'missing' }))
  }, [memberNo])

  if (state.status === 'loading') return <Loader full />

  const m = state.member
  const ok = state.status === 'found' && m.valid

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <p className="text-center text-sm font-semibold tracking-widest text-accent uppercase">{t('card.verifyTitle')}</p>
      <div className={`mt-4 rounded-[2rem] p-8 text-center shadow-sm ${ok ? 'bg-success/10' : 'bg-error/10'}`}>
        {ok ? <FaCircleCheck className="mx-auto size-14 text-success" /> : <FaCircleXmark className="mx-auto size-14 text-error" />}
        <h1 className={`mt-4 text-2xl font-bold ${ok ? 'text-success' : 'text-error'}`}>
          {state.status === 'missing' ? t('card.notFound') : ok ? t('card.valid') : t('card.notValid')}
        </h1>
        {m && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="grid size-20 place-items-center overflow-hidden rounded-2xl bg-base-100 text-3xl font-bold">
              {m.photo ? <img src={m.photo} alt="" className="size-full object-cover" /> : m.name[0]}
            </div>
            <p className="text-xl font-bold">{m.name}</p>
            <p className="text-base-content/70">{pick(memberTypeName(m.memberType))}</p>
            <p className="font-mono font-semibold">{m.memberNo}</p>
            {m.since && <p className="text-sm text-base-content/60">{t('card.since')}: {date(m.since)}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

export default VerifyMember
