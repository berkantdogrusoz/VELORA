import { auth } from '@clerk/nextjs/server'
import { getUserCredits } from '@/lib/db/credits'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const credits = await getUserCredits(userId)

    return Response.json({ credits })
  } catch (error) {
    console.error('Credits API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
