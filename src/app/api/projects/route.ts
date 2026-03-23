import { auth } from '@clerk/nextjs/server'
import { getUserProjects, saveProject } from '@/lib/db/projects'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await getUserProjects(userId)
  return Response.json({ projects })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId, title, messages, files } = await request.json()

  if (!title || !messages || !files) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const project = await saveProject(userId, projectId || null, title, messages, files)

  if (!project) {
    return Response.json({ error: 'Failed to save project' }, { status: 500 })
  }

  return Response.json({ project })
}
