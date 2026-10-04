// Turns an axios error into a message in the current language
const apiError = (err, t) => {
  const status = err?.response?.status
  if (!err?.response) return t('auth.failed')
  if (status === 429) return t('auth.tooMany')
  if (status === 409) return t('auth.emailTaken')
  if (status >= 500) return t('auth.failed')
  return err.response.data?.message || t('auth.failed')
}

export default apiError
