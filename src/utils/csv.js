// Builds a CSV file that Excel opens correctly with Bangla text (UTF-8 BOM) and downloads it.
// columns: [{ label, value: (row) => any }]
export const downloadCsv = (filename, columns, rows) => {
  const cell = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [columns.map((c) => cell(c.label)).join(','), ...rows.map((r) => columns.map((c) => cell(c.value(r))).join(','))]
  const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}
