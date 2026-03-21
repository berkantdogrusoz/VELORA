import crypto from 'crypto'
import { addCredits } from '@/lib/db/credits'

export async function POST(request: Request) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    if (!secret) {
      console.error('Missing LEMONSQUEEZY_WEBHOOK_SECRET')
      return Response.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature') || ''

    // Verify HMAC signature
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(rawBody)
    const expectedSignature = hmac.digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload.meta?.event_name

    if (eventName === 'order_created') {
      const customData = payload.meta?.custom_data
      const clerkId = customData?.clerk_id
      const credits = parseInt(customData?.credits || '0', 10)

      if (clerkId && credits > 0) {
        await addCredits(clerkId, credits)
        console.log(`Added ${credits} credits to user ${clerkId}`)
      } else {
        console.error('Missing clerk_id or credits in webhook custom_data:', customData)
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
