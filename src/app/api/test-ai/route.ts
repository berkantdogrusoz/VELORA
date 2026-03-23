import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 60

const MODELS_TO_TRY = [
  'claude-sonnet-4-5-20241022',
  'claude-sonnet-4-20250514',
  'claude-sonnet-4-6',
  'claude-sonnet-4-6-20250514',
  'claude-sonnet-4-5',
  'claude-sonnet-4',
  'claude-haiku-4-5-20251001',
]

export async function GET() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({
      ok: false,
      error: 'ANTHROPIC_API_KEY is not set',
    })
  }

  const keyPrefix = process.env.ANTHROPIC_API_KEY.substring(0, 12) + '...'
  const results: Array<{ model: string; ok: boolean; response?: string; error?: string }> = []

  for (const modelId of MODELS_TO_TRY) {
    try {
      const result = await generateText({
        model: anthropic(modelId),
        prompt: 'Say "Hello" and nothing else.',
        maxOutputTokens: 10,
      })
      results.push({ model: modelId, ok: true, response: result.text })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      results.push({ model: modelId, ok: false, error: message })
    }
  }

  const working = results.filter(r => r.ok).map(r => r.model)

  return Response.json({
    keyPrefix,
    workingModels: working,
    results,
  })
}
