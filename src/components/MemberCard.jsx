import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import memberTypeName from '../data/memberTypeName.js'
import { verifyUrl } from '../utils/memberNo.js'

// Credit-card sized member card (85.6 × 54 mm when printed)
const MemberCard = ({ user }) => {
  const { t, pick, date } = useLanguage()
  const [qr, setQr] = useState('')

  useEffect(() => {
    if (!user.memberNo) return
    QRCode.toDataURL(verifyUrl(user.memberNo), { margin: 1, width: 240, color: { dark: '#173d33', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [user.memberNo])

  return (
    <div className="member-card grain relative aspect-[85.6/54] w-full max-w-md overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#1f5a48] via-[#173d33] to-[#0f2b24] p-5 text-[#fdf6e6] shadow-2xl">
      <GiDove className="pointer-events-none absolute -right-6 -bottom-8 size-40 opacity-10" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-[#f2c14e] text-[#173d33]">
            <GiDove className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-bold">{t('site.name')}</p>
            <p className="text-[0.6rem] opacity-80">{t('site.tagline')}</p>
          </div>
          <span className="ml-auto rounded-full border border-[#f2c14e]/60 px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider text-[#f2c14e] uppercase">
            {t('card.memberCard')}
          </span>
        </div>

        <div className="mt-auto flex items-end gap-3">
          <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#fdf6e6]/15 text-2xl font-bold">
            {user.photo ? <img src={user.photo} alt="" className="size-full object-cover" /> : user.name?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg leading-tight font-bold">{user.name}</p>
            <p className="truncate text-xs opacity-80">{pick(memberTypeName(user.memberType))}</p>
            <p className="mt-1 font-mono text-sm font-semibold tracking-wider text-[#f2c14e]">{user.memberNo}</p>
            {user.approvedAt && <p className="text-[0.6rem] opacity-70">{t('card.since')}: {date(user.approvedAt)}</p>}
          </div>
          {qr && (
            <div className="shrink-0 text-center">
              <img src={qr} alt={t('card.scanToVerify')} className="size-20 rounded-lg bg-white p-1" />
              <p className="mt-0.5 text-[0.5rem] opacity-70">{t('card.scanToVerify')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberCard
