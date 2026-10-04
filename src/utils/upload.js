import api from '../api/axiosInstance.js'

const MAX_BYTES = 8 * 1024 * 1024
let configPromise = null

// Is Cloudinary set up on the server? (asked once per page load)
export const getUploadConfig = () => {
  configPromise ??= api
    .get('/uploads/config')
    .then(({ data }) => data)
    .catch(() => ({ enabled: false }))
  return configPromise
}

// Uploads an image straight to Cloudinary with a signature from our server; returns its https URL
export const uploadImage = async (file, folder) => {
  if (!file.type.startsWith('image/')) throw new Error('not-image')
  if (file.size > MAX_BYTES) throw new Error('too-large')

  const { data: sig } = await api.post('/uploads/sign', { folder })
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', sig.apiKey)
  form.append('timestamp', sig.timestamp)
  form.append('signature', sig.signature)
  form.append('folder', sig.folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: form })
  const json = await res.json()
  if (!res.ok || !json.secure_url) throw new Error('upload-failed')
  return json.secure_url
}
