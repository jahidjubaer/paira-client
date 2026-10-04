import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaCircleCheck, FaCircleXmark, FaClock } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import usePageTitle from '../utils/usePageTitle.js'
import { fundName } from '../data/funds.js'

// /donate/result?status=success|pending|failed|cancelled&tran=… — the payment gateway sends donors here
const DonateResult = () => {
  const { t, pick, money } = useLanguage()
  const [params] = useSearchParams()
  const tran = params.get('tran')
  const [payment, setPayment] = useState(null)
  usePageTitle(t('nav.donate'))

  useEffect(() => {
    if (!tran) return
    api.get(`/payments/status/${encodeURIComponent(tran)}`).then(({ data }) => setPayment(data)).catch(() => {})
  }, [tran])

  // The server's record wins over the URL (the URL can be edited by anyone)
  const status = payment?.status === 'verified' ? 'success' : params.get('status') === 'success' ? 'pending' : params.get('status')
  const view = {
    success: { icon: FaCircleCheck, tone: 'text-success bg-success/10', text: t('pay.resultSuccess') },
    pending: { icon: FaClock, tone: 'text-warning bg-warning/10', text: t('pay.resultPending') },
    cancelled: { icon: FaCircleXmark, tone: 'text-base-content/70 bg-base-200', text: t('pay.resultCancelled') },
  }[status] ?? { icon: FaCircleXmark, tone: 'text-error bg-error/10', text: t('pay.resultFailed') }

  return (
    <section className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className={`rounded-[2rem] p-10 ${view.tone}`}>
        <view.icon className="mx-auto size-16" />
        <h1 className="mt-5 text-2xl font-bold text-base-content">{view.text}</h1>
        {payment && status === 'success' && (
          <p className="mt-2 text-base-content/70">
            {t('pay.amountReceived')}: <strong>{money(payment.amount)}</strong> · {pick(fundName(payment.fund))}
          </p>
        )}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        {status === 'success' || status === 'pending' ? (
          <Link to="/finance" className="btn btn-primary rounded-full">{t('donate.seeFinance')}</Link>
        ) : (
          <Link to="/donate" className="btn btn-primary rounded-full">{t('pay.tryAgain')}</Link>
        )}
        <Link to="/" className="btn btn-ghost rounded-full">{t('common.backHome')}</Link>
      </div>
    </section>
  )
}

export default DonateResult
