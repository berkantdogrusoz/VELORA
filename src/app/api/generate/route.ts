import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { auth } from '@clerk/nextjs/server'
import { buildSystemPrompt } from '@/lib/ai/prompt-builder'
import { deductCredit, logGeneration, getOrCreateUser } from '@/lib/db/credits'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, currentFiles, currentCode } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    // Ensure user exists
    await getOrCreateUser(userId)

    // Check and deduct credits
    const hasCredits = await deductCredit(userId, 1)
    if (!hasCredits) {
      return Response.json(
        { error: 'Insufficient credits. Please purchase more credits to continue.' },
        { status: 402 }
      )
    }

    // Support both currentFiles (new) and currentCode (legacy)
    const files = currentFiles || (currentCode ? { 'index.html': currentCode } : undefined)

    const systemPrompt = buildSystemPrompt({
      currentFiles: files,
    })

    const lastMessage = messages[messages.length - 1]

    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens: 32000,
    })

    // Log the generation
    logGeneration(userId, lastMessage?.content || '', 1).catch(console.error)

    // Use manual stream to catch errors properly
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
          console.error('Stream error:', error)
          const errMsg = error instanceof Error ? error.message : 'Stream failed'
          controller.enqueue(encoder.encode(`\n\n[ERROR]: ${errMsg}`))
          controller.close()
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
