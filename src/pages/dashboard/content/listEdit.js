// Helpers for editing lists in page content: move / remove / replace one item
export const moveItem = (list, i, dir) => {
  const next = [...list]
  ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
  return next
}
export const removeItem = (list, i) => list.filter((_, j) => j !== i)
export const replaceItem = (list, i, item) => list.map((old, j) => (j === i ? item : old))
