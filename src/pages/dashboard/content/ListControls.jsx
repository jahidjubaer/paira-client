import { FaArrowDown, FaArrowUp, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../../i18n/useLanguage.js'
import { moveItem, removeItem } from './listEdit.js'

// Up / down / remove buttons for item i of a list
const ListControls = ({ list, index, onChange }) => {
  const { t } = useLanguage()
  // preventDefault: inside a <summary>, a click would also open/close the section
  const act = (next) => (e) => {
    e.preventDefault()
    onChange(next())
  }
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" disabled={index === 0} onClick={act(() => moveItem(list, index, -1))} className="btn btn-ghost btn-sm btn-square" aria-label={t('set.moveUp')}><FaArrowUp /></button>
      <button type="button" disabled={index === list.length - 1} onClick={act(() => moveItem(list, index, 1))} className="btn btn-ghost btn-sm btn-square" aria-label={t('set.moveDown')}><FaArrowDown /></button>
      <button type="button" onClick={act(() => removeItem(list, index))} className="btn btn-ghost btn-sm btn-square text-error" aria-label={t('set.remove')}><FaTrash /></button>
    </div>
  )
}

export default ListControls
