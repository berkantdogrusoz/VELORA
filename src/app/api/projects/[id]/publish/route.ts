import { auth } from '@clerk/nextjs/server'
import { getProject } from '@/lib/db/projects'
import { publishSite, unpublishSite, getPublishedSiteByProject } from '@/lib/db/published-sites'

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const published = await getPublishedSiteByProject(userId, id)

  return Response.json({
    published: !!published,
    slug: published?.slug || null,
    url: published ? `/s/${published.slug}` : null,
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { slug } = await request.json()

  if (!slug || !SLUG_REGEX.test(slug)) {
    return Response.json(
      { error: 'Invalid slug. Use 3-50 lowercase letters, numbers, and hyphens.' },
      { status: 400 }
    )
  }

  // Get the project to access its files
  const project = await getProject(id, userId)
  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }

  if (!project.files || Object.keys(project.files).length === 0) {
    return Response.json({ error: 'Project has no files to publish' }, { status: 400 })
  }

  const site = await publishSite(userId, id, slug, project.files)
  if (!site) {
    return Response.json({ error: 'Failed to publish. Slug may already be taken.' }, { status: 409 })
  }

  return Response.json({
    published: true,
    slug: site.slug,
    url: `/s/${site.slug}`,
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const success = await unpublishSite(userId, id)

  if (!success) {
    return Response.json({ error: 'Failed to unpublish' }, { status: 500 })
  }

  return Response.json({ published: false })
}
