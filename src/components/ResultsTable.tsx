import { useState } from 'react'
import { Pencil, Check, X, Loader2, AlertTriangle } from 'lucide-react'
import type { ImageItem } from '../lib/types'

interface Props {
  items: ImageItem[]
  onUpdateDescription: (id: string, description: string) => void
  onUpdateSku: (id: string, sku: string) => void
}

export default function ResultsTable({ items, onUpdateDescription, onUpdateSku }: Props) {
  const [editingDesc, setEditingDesc] = useState<string | null>(null)
  const [editingSku, setEditingSku] = useState<string | null>(null)
  const [tempDesc, setTempDesc] = useState('')
  const [tempSku, setTempSku] = useState('')

  const done = items.filter(i => i.status === 'done' || i.status === 'error')
  if (!done.length) return null

  const startEditDesc = (item: ImageItem) => {
    setEditingDesc(item.id)
    setTempDesc(item.description)
  }
  const commitDesc = (id: string) => {
    onUpdateDescription(id, tempDesc.trim())
    setEditingDesc(null)
  }
  const cancelDesc = () => setEditingDesc(null)

  const startEditSku = (item: ImageItem) => {
    setEditingSku(item.id)
    setTempSku(item.sku)
  }
  const commitSku = (id: string) => {
    onUpdateSku(id, tempSku.trim())
    setEditingSku(null)
  }
  const cancelSku = () => setEditingSku(null)

  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-16">
              Image
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-36">
              SKU
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
              Description
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 w-16">
              Words
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {done.map(item => (
            <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
              {/* Thumbnail */}
              <td className="px-4 py-3">
                <img
                  src={item.previewUrl}
                  alt={item.sku}
                  className="w-10 h-10 object-cover rounded-md border border-slate-600"
                />
              </td>

              {/* SKU */}
              <td className="px-4 py-3">
                {editingSku === item.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={tempSku}
                      onChange={e => setTempSku(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitSku(item.id)
                        if (e.key === 'Escape') cancelSku()
                      }}
                      className="bg-slate-700 border border-indigo-500 rounded px-2 py-1 text-slate-100 font-mono text-xs w-28 focus:outline-none"
                    />
                    <button onClick={() => commitSku(item.id)} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={cancelSku} className="text-slate-400 hover:text-slate-200">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditSku(item)}
                    className="font-mono text-slate-300 text-xs hover:text-indigo-400 transition-colors flex items-center gap-1.5 group/sku"
                  >
                    {item.sku}
                    <Pencil className="w-3 h-3 opacity-0 group-hover/sku:opacity-100 text-slate-500" />
                  </button>
                )}
              </td>

              {/* Description */}
              <td className="px-4 py-3 max-w-0">
                {item.status === 'error' ? (
                  <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.error || 'Processing failed'}</span>
                  </div>
                ) : item.status === 'processing' ? (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    Analyzing image...
                  </div>
                ) : editingDesc === item.id ? (
                  <div className="flex items-start gap-2">
                    <textarea
                      autoFocus
                      value={tempDesc}
                      onChange={e => setTempDesc(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commitDesc(item.id)
                        if (e.key === 'Escape') cancelDesc()
                      }}
                      rows={3}
                      className="flex-1 bg-slate-700 border border-indigo-500 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none resize-none leading-relaxed"
                    />
                    <div className="flex flex-col gap-1 pt-1">
                      <button onClick={() => commitDesc(item.id)} className="text-emerald-400 hover:text-emerald-300">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={cancelDesc} className="text-slate-400 hover:text-slate-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditDesc(item)}
                    className="text-left text-slate-300 text-sm leading-relaxed hover:text-slate-100 transition-colors group/desc flex items-start gap-1.5 w-full"
                  >
                    <span className="flex-1">{item.description}</span>
                    <Pencil className="w-3.5 h-3.5 opacity-0 group-hover/desc:opacity-100 text-slate-500 flex-shrink-0 mt-0.5" />
                  </button>
                )}
              </td>

              {/* Word count */}
              <td className="px-4 py-3">
                {item.status === 'done' && (
                  <span className={`font-mono text-xs tabular-nums ${
                    wordCount(item.description) >= 40 && wordCount(item.description) <= 60
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}>
                    {wordCount(item.description)}w
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
