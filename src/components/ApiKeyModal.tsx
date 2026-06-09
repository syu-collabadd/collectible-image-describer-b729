import { useState } from 'react'
import { Key, Eye, EyeOff, ExternalLink, Sparkles } from 'lucide-react'

interface Props {
  onSave: (key: string) => void
  onDemo: () => void
}

export default function ApiKeyModal({ onSave, onDemo }: Props) {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Connect Claude AI</h2>
            <p className="text-xs text-slate-400">One-time setup</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm mt-4 mb-5 leading-relaxed">
          This tool uses Claude's Vision AI to analyze your collectible images. Enter your Anthropic API key — it's stored locally in your browser and never sent anywhere except Anthropic's servers.
        </p>

        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && key.trim() && onSave(key.trim())}
            placeholder="sk-ant-api03-..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 pr-10 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={() => key.trim() && onSave(key.trim())}
          disabled={!key.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
        >
          Start Describing Images
        </button>

        <div className="relative flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-slate-700" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 border-t border-slate-700" />
        </div>

        <button
          onClick={onDemo}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Try Demo Mode
        </button>
        <p className="text-center text-xs text-slate-500 mt-2">
          Simulated descriptions — no API key needed
        </p>

        <a
          href="https://console.anthropic.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 justify-center mt-5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Get your API key at console.anthropic.com
        </a>
      </div>
    </div>
  )
}
