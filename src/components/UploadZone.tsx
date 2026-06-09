import { useRef, useState, useCallback } from 'react'
import { Upload, FolderOpen, ImageIcon } from 'lucide-react'

interface Props {
  onFiles: (files: File[]) => void
  disabled?: boolean
}

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export default function UploadZone({ onFiles, disabled }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    const images = Array.from(fileList).filter(f => ACCEPTED.includes(f.type))
    if (images.length) onFiles(images)
  }, [onFiles])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const items = e.dataTransfer.items
    const files: File[] = []

    if (items) {
      // Traverse directory entries if available
      const promises: Promise<void>[] = []
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.()
        if (entry?.isDirectory) {
          promises.push(traverseDirectory(entry as FileSystemDirectoryEntry, files))
        } else if (entry?.isFile) {
          promises.push(
            new Promise(res => {
              ;(entry as FileSystemFileEntry).file(f => {
                if (ACCEPTED.includes(f.type)) files.push(f)
                res()
              })
            }),
          )
        }
      }
      Promise.all(promises).then(() => {
        if (files.length) onFiles(files)
        else handleFiles(e.dataTransfer.files)
      })
    } else {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles, onFiles])

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={disabled ? undefined : onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all select-none
        flex flex-col items-center justify-center gap-3 text-center
        ${dragging
          ? 'border-indigo-400 bg-indigo-500/10'
          : disabled
            ? 'border-slate-700 bg-slate-800/30 cursor-not-allowed opacity-50'
            : 'border-slate-600 bg-slate-800/50 hover:border-indigo-500 hover:bg-indigo-500/5'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
        disabled={disabled}
      />

      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${dragging ? 'bg-indigo-500/20' : 'bg-slate-700'}`}>
        {dragging ? (
          <Upload className="w-7 h-7 text-indigo-400" />
        ) : (
          <FolderOpen className="w-7 h-7 text-slate-400" />
        )}
      </div>

      <div>
        <p className="text-slate-200 font-medium">
          {dragging ? 'Drop images here' : 'Drop a folder or select images'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          JPG, PNG, WebP — batch upload 100+ images at once
        </p>
      </div>

      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ImageIcon className="w-3.5 h-3.5" />
          Banknotes · Coins · Postcards
        </div>
      </div>
    </div>
  )
}

function traverseDirectory(dir: FileSystemDirectoryEntry, out: File[]): Promise<void> {
  return new Promise(resolve => {
    const reader = dir.createReader()
    const readAll = () => {
      reader.readEntries(entries => {
        if (!entries.length) return resolve()
        const ps: Promise<void>[] = entries.map(entry => {
          if (entry.isDirectory) return traverseDirectory(entry as FileSystemDirectoryEntry, out)
          return new Promise<void>(res => {
            ;(entry as FileSystemFileEntry).file(f => {
              if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(f.type)) out.push(f)
              res()
            })
          })
        })
        Promise.all(ps).then(readAll)
      })
    }
    readAll()
  })
}
