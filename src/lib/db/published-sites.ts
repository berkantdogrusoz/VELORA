import { supabase } from './supabase'

export interface PublishedSite {
  id: string
  project_id: string
  clerk_id: string
  slug: string
  files: Record<string, string>
  published_at: string
  updated_at: string
}

export async function getPublishedSite(slug: string): Promise<PublishedSite | null> {
  const { data, error } = await supabase
    .from('published_sites')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getPublishedSiteByProject(clerkId: string, projectId: string): Promise<PublishedSite | null> {
  const { data, error } = await supabase
    .from('published_sites')
    .select('*')
    .eq('clerk_id', clerkId)
    .eq('project_id', projectId)
    .single()

  if (error) return null
  return data
}

export async function publishSite(
  clerkId: string,
  projectId: string,
  slug: string,
  files: Record<string, string>
): Promise<PublishedSite | null> {
  // Check if already published for this project
  const existing = await getPublishedSiteByProject(clerkId, projectId)

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('published_sites')
      .update({
        slug,
        files,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .eq('clerk_id', clerkId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update published site:', error)
      return null
    }
    return data
  }

  // Create new
  const { data, error } = await supabase
    .from('published_sites')
    .insert({
      project_id: projectId,
      clerk_id: clerkId,
      slug,
      files,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to publish site:', error)
    return null
  }
  return data
}

export async function unpublishSite(clerkId: string, projectId: string): Promise<boolean> {
  const { error } = await supabase
    .from('published_sites')
    .delete()
    .eq('clerk_id', clerkId)
    .eq('project_id', projectId)

  return !error
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from('published_sites')
    .select('id')
    .eq('slug', slug)
    .single()

  return !data
}
