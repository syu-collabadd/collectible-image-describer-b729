import type { SkuConfig } from './types'

export function generateSku(index: number, config: SkuConfig): string {
  const num = (config.startNumber + index).toString().padStart(config.padLength, '0')
  return config.prefix ? `${config.prefix}-${num}` : num
}

export const defaultSkuConfig: SkuConfig = {
  prefix: 'COL',
  startNumber: 1001,
  padLength: 4,
}
