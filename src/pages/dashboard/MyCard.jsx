import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import toast from 'react-hot-toast'
import { FaPrint } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import useAuth from '../../context/useAuth.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import MemberCard from '../../components/MemberCard.jsx'

// /dashboard/card (own card) and /dashboard/members/:id/card (admin printing a member's card)
const MyCard = () => {
  const { id } = useParams()
  const { t } = useLanguage()
  const { user: me } = useAuth()
  const [other, setOther] = useState(null)

  useEffect(() => {
    if (!id) return
    api
      .get(`/users/${id}`)
      .then(({ data }) => setOther(data.user))
      .catch((err) => toast.error(apiError(err, t)))
  }, [id, t])

  const user = id ? other : me
  if (!user) return <Loader />

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold print:hidden">{id ? `${t('card.memberCard')} — ${user.name}` : t('card.title')}</h1>

      {!user.memberNo ? (
        <p className="rounded-[1.5rem] bg-base-100 p-10 text-center text-base-content/60 shadow-sm">{t('card.notApproved')}</p>
      ) : (
        <>
          <div className="print-area">
            <MemberCard user={user} />
          </div>
          <div className="flex flex-wrap items-center gap-4 print:hidden">
            <button onClick={() => window.print()} className="btn btn-primary rounded-full">
              <FaPrint /> {t('card.print')}
            </button>
            <p className="text-sm text-base-content/60">{t('card.printHint')}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default MyCard
