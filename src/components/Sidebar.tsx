import { Settings, Key, RotateCcw } from 'lucide-react'
import type { SkuConfig } from '../lib/types'

interface Props {
  skuConfig: SkuConfig
  onSkuChange: (c: SkuConfig) => void
  onResetKey: () => void
  hasImages: boolean
  isProcessing: boolean
  onClearAll: () => void
}

export default function Sidebar({
  skuConfig,
  onSkuChange,
  onResetKey,
  hasImages,
  isProcessing,
  onClearAll,
}: Props) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* SKU Config */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-200">SKU Settings</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Prefix</label>
            <input
              value={skuConfig.prefix}
              onChange={e => onSkuChange({ ...skuConfig, prefix: e.target.value.toUpperCase() })}
              placeholder="COL"
              maxLength={10}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Start Number</label>
            <input
              type="number"
              value={skuConfig.startNumber}
              onChange={e => onSkuChange({ ...skuConfig, startNumber: parseInt(e.target.value) || 1 })}
              min={1}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Zero-pad digits</label>
            <select
              value={skuConfig.padLength}
              onChange={e => onSkuChange({ ...skuConfig, padLength: parseInt(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} digits (e.g. {skuConfig.startNumber.toString().padStart(n, '0')})</option>
              ))}
            </select>
          </div>

          <div className="pt-1 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Preview</p>
            <p className="font-mono text-indigo-400 text-sm">
              {skuConfig.prefix ? `${skuConfig.prefix}-` : ''}{skuConfig.startNumber.toString().padStart(skuConfig.padLength, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {hasImages && !isProcessing && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <button
            onClick={onClearAll}
            className="w-full flex items-center gap-2 justify-center text-sm text-slate-400 hover:text-red-400 transition-colors py-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear all images
          </button>
        </div>
      )}

      {/* API Key */}
      <button
        onClick={onResetKey}
        className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-auto px-1"
      >
        <Key className="w-3.5 h-3.5" />
        Change API key
      </button>
    </aside>
  )
}
