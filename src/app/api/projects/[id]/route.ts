import { auth } from '@clerk/nextjs/server'
import { getProject, deleteProject } from '@/lib/db/projects'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const project = await getProject(id, userId)

  if (!project) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }

  return Response.json({ project })
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
  const success = await deleteProject(id, userId)

  if (!success) {
    return Response.json({ error: 'Failed to delete project' }, { status: 500 })
  }

  return Response.json({ success: true })
}
