export type ProcessingStatus = 'pending' | 'processing' | 'done' | 'error'

export interface ImageItem {
  id: string
  file: File
  previewUrl: string
  sku: string
  description: string
  status: ProcessingStatus
  error?: string
}

export interface SkuConfig {
  prefix: string
  startNumber: number
  padLength: number
}
