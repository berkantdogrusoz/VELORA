import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 30

export async function GET() {
  const modelId = 'claude-3-5-sonnet-20241022'

  try {
    // Check if API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({
        ok: false,
        error: 'ANTHROPIC_API_KEY is not set',
      })
    }

    const result = await generateText({
      model: anthropic(modelId),
      prompt: 'Say "Hello, ÉlanNoire is working!" and nothing else.',
      maxOutputTokens: 50,
    })

    return Response.json({
      ok: true,
      model: modelId,
      response: result.text,
      usage: result.usage,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const name = error instanceof Error ? error.name : 'Unknown'

    return Response.json({
      ok: false,
      model: modelId,
      errorName: name,
      error: message,
    })
  }
}
