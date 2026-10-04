import { useState } from 'react'
import { FaCheck, FaCopy } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

const CopyButton = ({ text, light = false }) => {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked; the number is still visible to copy by hand
    }
  }

  return (
    <button type="button" onClick={copy} className={`btn btn-xs rounded-full ${light ? 'btn-ghost text-current hover:bg-white/10' : 'btn-ghost'}`}>
      {copied ? <FaCheck /> : <FaCopy />} {copied ? t('donate.copied') : t('donate.copy')}
    </button>
  )
}

export default CopyButton
