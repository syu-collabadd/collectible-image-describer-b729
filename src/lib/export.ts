import type { ImageItem } from './types'

export function exportToCsv(items: ImageItem[]): void {
  const done = items.filter(i => i.status === 'done')
  const rows = [
    ['SKU', 'Description'],
    ...done.map(i => [i.sku, i.description]),
  ]

  const csv = rows
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `collectible-descriptions-${localDateKey()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function localDateKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
