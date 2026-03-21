import { auth } from '@clerk/nextjs/server'

const LEMON_SQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID

// Map plan names to Lemon Squeezy variant IDs
// TODO: Update these with actual variant IDs from Lemon Squeezy dashboard
const PLAN_VARIANTS: Record<string, { variantId: string; credits: number }> = {
  starter: { variantId: process.env.LEMON_VARIANT_STARTER || '', credits: 50 },
  pro: { variantId: process.env.LEMON_VARIANT_PRO || '', credits: 200 },
  business: { variantId: process.env.LEMON_VARIANT_BUSINESS || '', credits: 600 },
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()
    const planConfig = PLAN_VARIANTS[plan]

    if (!planConfig) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (!LEMON_SQUEEZY_API_KEY || !planConfig.variantId) {
      return Response.json(
        { error: 'Payment system is being configured. Please try again later.' },
        { status: 503 }
      )
    }

    // Create Lemon Squeezy checkout
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                clerk_id: userId,
                credits: planConfig.credits.toString(),
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://elannoire.site'}/builder`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: planConfig.variantId,
              },
            },
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Lemon Squeezy error:', data)
      return Response.json({ error: 'Failed to create checkout' }, { status: 500 })
    }

    return Response.json({ url: data.data.attributes.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
