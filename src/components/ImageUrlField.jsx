import { useEffect, useId, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCloudArrowUp } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { getUploadConfig, uploadImage } from '../utils/upload.js'

// Image link input with an "Upload" button (when Cloudinary is set up).
// Works inside uncontrolled forms: the uploaded URL is written into the named input.
// Pass onUploaded instead of name to receive the URL (e.g. to add photos to a list).
const ImageUrlField = ({ name, label, defaultValue = '', folder, className = '', onUploaded, required = false }) => {
  const { t } = useLanguage()
  const id = useId()
  const input = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(defaultValue)

  useEffect(() => {
    getUploadConfig().then((c) => setEnabled(c.enabled))
  }, [])

  const handleFile = async (e) => {
    const files = [...(e.target.files ?? [])]
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    try {
      for (const file of onUploaded ? files : files.slice(0, 1)) {
        const url = await uploadImage(file, folder)
        if (onUploaded) onUploaded(url)
        else if (input.current) {
          input.current.value = url
          setPreview(url)
        }
      }
      toast.success(t('upload.done'))
    } catch (err) {
      toast.error(t(err.message === 'too-large' ? 'upload.tooLarge' : err.message === 'not-image' ? 'upload.notImage' : 'upload.failed'))
    } finally {
      setBusy(false)
    }
  }

  const button = enabled && (
    <label className={`btn ${onUploaded ? 'btn-primary rounded-full' : 'join-item'} ${busy ? 'btn-disabled' : ''}`}>
      {busy ? <span className="loading loading-spinner loading-sm" /> : <FaCloudArrowUp />}
      <span className={onUploaded ? '' : 'hidden sm:inline'}>{t('upload.button')}</span>
      <input type="file" accept="image/*" multiple={Boolean(onUploaded)} onChange={handleFile} className="hidden" disabled={busy} />
    </label>
  )

  // Upload-only mode (no URL input)
  if (onUploaded) return enabled ? button : null

  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>}
      <div className="flex items-center gap-2">
        {preview && /^https?:\/\//.test(preview) && <img src={preview} alt="" className="size-10 shrink-0 rounded-lg object-cover" />}
        <div className="join w-full">
          <input
            ref={input}
            id={id}
            name={name}
            type="url"
            maxLength={500}
            required={required}
            defaultValue={defaultValue}
            onChange={(e) => setPreview(e.target.value)}
            placeholder="https://…"
            className="input join-item w-full"
          />
          {button}
        </div>
      </div>
    </div>
  )
}

export default ImageUrlField
