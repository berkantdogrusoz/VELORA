import { supabase } from './supabase'
import type { Message } from '@/types/builder'

export interface Project {
  id: string
  clerk_id: string
  title: string
  messages: Message[]
  files: Record<string, string>
  created_at: string
  updated_at: string
}

export async function getUserProjects(clerkId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('clerk_id', clerkId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }

  return data || []
}

export async function getProject(id: string, clerkId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('clerk_id', clerkId)
    .single()

  if (error) return null
  return data
}

export async function saveProject(
  clerkId: string,
  projectId: string | null,
  title: string,
  messages: Message[],
  files: Record<string, string>
): Promise<Project | null> {
  if (projectId) {
    // Update existing project
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        messages,
        files,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('clerk_id', clerkId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update project:', error)
      return null
    }
    return data
  }

  // Create new project
  const { data, error } = await supabase
    .from('projects')
    .insert({
      clerk_id: clerkId,
      title,
      messages,
      files,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create project:', error)
    return null
  }
  return data
}

export async function deleteProject(id: string, clerkId: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('clerk_id', clerkId)

  return !error
}
