import useLanguage from '../i18n/useLanguage.js'

// <dialog> asking to confirm a delete. Open it with ref.current.showModal().
const ConfirmDialog = ({ ref, title, detail, onConfirm }) => {
  const { t } = useLanguage()
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box rounded-[2rem]">
        <h3 className="text-lg font-bold">{title}</h3>
        {detail && <p className="py-3">{detail}</p>}
        <div className="modal-action">
          <button className="btn rounded-full" onClick={() => ref.current?.close()}>{t('dash.cancel')}</button>
          <button
            className="btn btn-error rounded-full"
            onClick={() => {
              ref.current?.close()
              onConfirm()
            }}
          >
            {t('dash.delete')}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  )
}

export default ConfirmDialog
