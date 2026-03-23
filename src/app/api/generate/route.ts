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

    const { messages, currentCode } = await request.json()

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

    const systemPrompt = buildSystemPrompt({
      currentCode: currentCode || undefined,
    })

    const lastMessage = messages[messages.length - 1]

    const result = streamText({
      model: anthropic('claude-sonnet-4-6-20250514'),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens: 16000,
    })

    // Log the generation
    logGeneration(userId, lastMessage?.content || '', 1).catch(console.error)

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Generate API error:', error)

    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return Response.json({ error: message }, { status: 500 })
  }
}
