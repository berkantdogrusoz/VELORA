import { isSlugAvailable } from '@/lib/db/published-sites'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return Response.json({ error: 'Slug is required' }, { status: 400 })
  }

  const available = await isSlugAvailable(slug)
  return Response.json({ available })
}
