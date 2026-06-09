import { useState, useCallback, useRef } from 'react'
import { Download, Play, Layers, Coins } from 'lucide-react'
import ApiKeyModal from './components/ApiKeyModal'
import UploadZone from './components/UploadZone'
import ImageGrid from './components/ImageGrid'
import ResultsTable from './components/ResultsTable'
import ProgressBar from './components/ProgressBar'
import Sidebar from './components/Sidebar'
import type { ImageItem, SkuConfig } from './lib/types'
import { describeImage, fileToBase64 } from './lib/claude'
import { generateSku, defaultSkuConfig } from './lib/sku'
import { exportToCsv } from './lib/export'

const API_KEY_STORAGE = 'collectible_ai_key'
const CONCURRENCY = 3

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem(API_KEY_STORAGE))
  const [showKeyModal, setShowKeyModal] = useState(!localStorage.getItem(API_KEY_STORAGE))
  const [items, setItems] = useState<ImageItem[]>([])
  const [skuConfig, setSkuConfig] = useState<SkuConfig>(defaultSkuConfig)
  const [isProcessing, setIsProcessing] = useState(false)
  const abortRef = useRef(false)

  const saveKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE, key)
    setApiKey(key)
    setShowKeyModal(false)
  }

  const handleFiles = useCallback((files: File[]) => {
    const startIndex = items.length
    const newItems: ImageItem[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      previewUrl: URL.createObjectURL(file),
      sku: generateSku(startIndex + i, skuConfig),
      description: '',
      status: 'pending',
    }))
    setItems(prev => [...prev, ...newItems])
  }, [items.length, skuConfig])

  const processImages = useCallback(async () => {
    if (!apiKey || isProcessing) return
    const pending = items.filter(i => i.status === 'pending')
    if (!pending.length) return

    setIsProcessing(true)
    abortRef.current = false

    const queue = [...pending]
    let active = 0

    const processNext = async (): Promise<void> => {
      if (!queue.length || abortRef.current) return
      const item = queue.shift()!
      active++

      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i))

      try {
        const { data, mediaType } = await fileToBase64(item.file)
        const description = await describeImage(apiKey, data, mediaType)
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, description, status: 'done' } : i))
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error'
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error } : i))
      } finally {
        active--
        await processNext()
      }
    }

    const workers = Array.from({ length: Math.min(CONCURRENCY, pending.length) }, () => processNext())
    await Promise.all(workers)
    setIsProcessing(false)
  }, [apiKey, isProcessing, items])

  const updateDescription = useCallback((id: string, description: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, description } : i))
  }, [])

  const updateSku = useCallback((id: string, sku: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, sku } : i))
  }, [])

  const clearAll = useCallback(() => {
    items.forEach(i => URL.revokeObjectURL(i.previewUrl))
    setItems([])
  }, [items])

  const donePending = items.filter(i => i.status === 'done' || i.status === 'error').length
  const processingCount = items.filter(i => i.status === 'processing').length
  const doneCount = items.filter(i => i.status === 'done').length
  const errorCount = items.filter(i => i.status === 'error').length
  const pendingCount = items.filter(i => i.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Coins className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <span className="text-slate-100 font-semibold tracking-tight">CollectibleAI</span>
              <span className="text-slate-500 text-xs ml-2">Bulk Image Describer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mr-2">
                <span><span className="text-slate-200">{items.length}</span> loaded</span>
                {doneCount > 0 && <span><span className="text-emerald-400">{doneCount}</span> done</span>}
                {errorCount > 0 && <span><span className="text-red-400">{errorCount}</span> errors</span>}
                {pendingCount > 0 && <span><span className="text-slate-500">{pendingCount}</span> pending</span>}
              </div>
            )}

            {doneCount > 0 && (
              <button
                onClick={() => exportToCsv(items)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV ({doneCount})
              </button>
            )}

            {pendingCount > 0 && !isProcessing && (
              <button
                onClick={processImages}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Describe {pendingCount} image{pendingCount > 1 ? 's' : ''}
              </button>
            )}

            {isProcessing && (
              <button
                onClick={() => { abortRef.current = true; setIsProcessing(false) }}
                className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-400 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-6 flex gap-6">
        <Sidebar
          skuConfig={skuConfig}
          onSkuChange={setSkuConfig}
          onResetKey={() => setShowKeyModal(true)}
          hasImages={items.length > 0}
          isProcessing={isProcessing}
          onClearAll={clearAll}
        />

        <main className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Upload zone — always visible when not processing bulk */}
          {!isProcessing && (
            <UploadZone onFiles={handleFiles} disabled={isProcessing} />
          )}

          {/* Progress */}
          {(isProcessing || processingCount > 0) && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <ProgressBar done={donePending} total={items.length} errors={errorCount} />
            </div>
          )}

          {/* Image grid */}
          {items.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-200">
                  Image Queue
                  <span className="text-slate-500 font-normal ml-2 font-mono">{items.length}</span>
                </h2>
              </div>
              <ImageGrid items={items} />
            </div>
          )}

          {/* Results table */}
          {donePending > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-200">
                  Results
                  <span className="text-slate-500 font-normal ml-2 font-mono">{donePending}</span>
                </h2>
                <p className="text-xs text-slate-500">Click any cell to edit inline</p>
              </div>
              <ResultsTable
                items={items}
                onUpdateDescription={updateDescription}
                onUpdateSku={updateSku}
              />
            </div>
          )}

          {/* Empty state */}
          {!items.length && (
            <div className="flex-1 flex items-center justify-center text-center py-16">
              <div>
                <p className="text-slate-500 text-sm">
                  Upload images above to get started.<br />
                  Supports banknotes, coins, postcards, and all collectible types.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showKeyModal && <ApiKeyModal onSave={saveKey} />}
    </div>
  )
}
