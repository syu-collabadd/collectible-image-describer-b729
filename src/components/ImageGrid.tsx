import { CheckCircle, Loader2, XCircle, Clock } from 'lucide-react'
import type { ImageItem } from '../lib/types'

interface Props {
  items: ImageItem[]
}

const statusIcon = {
  pending: <Clock className="w-3.5 h-3.5 text-slate-500" />,
  processing: <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />,
  done: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  error: <XCircle className="w-3.5 h-3.5 text-red-400" />,
}

export default function ImageGrid({ items }: Props) {
  if (!items.length) return null

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
      {items.map(item => (
        <div key={item.id} className="group relative">
          <div className="aspect-square rounded-lg overflow-hidden bg-slate-700 border border-slate-600 group-hover:border-indigo-500/50 transition-colors">
            <img
              src={item.previewUrl}
              alt={item.file.name}
              className="w-full h-full object-cover"
            />
            {item.status !== 'done' && (
              <div className="absolute inset-0 bg-slate-900/40 rounded-lg" />
            )}
          </div>
          <div className="absolute top-1 right-1 bg-slate-900/80 rounded-full p-0.5">
            {statusIcon[item.status]}
          </div>
          <p className="mt-1 text-[10px] text-slate-500 truncate px-0.5" title={item.file.name}>
            {item.sku}
          </p>
        </div>
      ))}
    </div>
  )
}
