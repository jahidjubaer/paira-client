import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaEnvelopeOpen, FaEnvelope, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

const Messages = () => {
  const { t, date } = useLanguage()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/messages')
      .then(({ data }) => setMessages(data.messages))
      .catch((err) => toast.error(apiError(err, t)))
      .finally(() => setLoading(false))
  }, [t])

  const toggleRead = async (msg) => {
    try {
      const { data } = await api.patch(`/messages/${msg._id}`, { isRead: !msg.isRead })
      setMessages((list) => list.map((m) => (m._id === msg._id ? data.item : m)))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/messages/${id}`)
      setMessages((list) => list.filter((m) => m._id !== id))
      toast.success(t('dash.deleted'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  if (loading) return <Loader />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">{t('dash.messages')}</h1>
      {messages.length === 0 && <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('dash.noMessages')}</p>}
      {messages.map((m) => (
        <article key={m._id} className={`rounded-[1.5rem] bg-base-100 p-6 shadow-sm ${m.isRead ? 'opacity-75' : 'border-l-4 border-primary'}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">
                {m.name} {!m.isRead && <span className="badge badge-sm badge-primary ml-1">{t('dash.unread')}</span>}
              </p>
              <a href={`mailto:${m.email}`} className="link text-sm link-primary">{m.email}</a>
              <p className="text-xs text-base-content/50">{date(m.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleRead(m)} className="btn btn-sm btn-ghost" title={m.isRead ? t('dash.markUnread') : t('dash.markRead')}>
                {m.isRead ? <FaEnvelope /> : <FaEnvelopeOpen />}
              </button>
              <button onClick={() => remove(m._id)} className="btn btn-sm btn-ghost text-error" aria-label={t('dash.delete')}>
                <FaTrash />
              </button>
            </div>
          </div>
          {m.subject && <h2 className="mt-4 text-lg font-bold">{m.subject}</h2>}
          <p className="mt-2 whitespace-pre-line">{m.message}</p>
        </article>
      ))}
    </div>
  )
}

export default Messages
