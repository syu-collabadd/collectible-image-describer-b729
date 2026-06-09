interface Props {
  done: number
  total: number
  errors: number
}

export default function ProgressBar({ done, total, errors }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium">
          Processing{' '}
          <span className="font-mono text-indigo-400">{done}</span>
          <span className="text-slate-500"> / </span>
          <span className="font-mono">{total}</span>
          {' '}images
        </span>
        <div className="flex items-center gap-3">
          {errors > 0 && (
            <span className="text-xs text-red-400 font-mono">{errors} error{errors > 1 ? 's' : ''}</span>
          )}
          <span className="font-mono text-slate-400 text-xs">{pct}%</span>
        </div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
