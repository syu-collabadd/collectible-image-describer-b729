import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a professional product description writer for a collectibles dealer specializing in banknotes, coins, stamps, and postcards.
Analyze the image and write a concise, accurate 40-60 word product description suitable for eBay listings.

Rules:
- Lead with the year if visible (e.g., "1952 France 5 Francs banknote")
- Include country/issuer, denomination/type, and any notable visual elements
- For banknotes: mention the portrayed figure(s) or artwork
- For coins: mention denomination, country, year, and key design elements
- For postcards: describe the scene, text visible, and style
- Be factual and specific — avoid marketing language
- Output ONLY the description, nothing else`

export async function describeImage(
  apiKey: string,
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
): Promise<string> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: 'Describe this collectible item for an eBay listing.',
          },
        ],
      },
    ],
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type')
  return block.text.trim()
}

export function fileToBase64(file: File): Promise<{ data: string; mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const [header, data] = result.split(',')
      const mediaType = header.match(/data:([^;]+)/)?.[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      resolve({ data, mediaType: mediaType || 'image/jpeg' })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
