import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt } from '@/lib/ai/prompt-builder'

export async function POST(request: Request) {
  try {
    const { messages, currentCode } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt({
      currentCode: currentCode || undefined,
    })

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens: 16000,
    })

    // Return as a plain text stream for easier parsing
    const stream = result.textStream

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Generate API error:', error)

    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return Response.json({ error: message }, { status: 500 })
  }
}
