'use client'

import { useState, useEffect, useCallback } from 'react'
import { FolderOpen, Plus, Trash2, Loader2, X, Clock } from 'lucide-react'
import { useBuilderStore } from '@/store/builder-store'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { toast } from 'sonner'

interface ProjectItem {
  id: string
  title: string
  updated_at: string
}

export function ProjectSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(false)
  const { projectId, loadProject, reset } = useBuilderStore()

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.projects) {
        setProjects(data.projects)
      }
    } catch {
      console.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchProjects()
  }, [open, fetchProjects])

  const handleLoad = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`)
      const data = await res.json()
      if (data.project) {
        loadProject(
          data.project.id,
          data.project.title,
          data.project.messages || [],
          data.project.files || {}
        )
        toast.success(t('projects.loaded'))
        onClose()
      }
    } catch {
      toast.error(t('projects.loadFailed'))
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm(t('projects.confirmDelete'))) return

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (projectId === id) reset()
      toast.success(t('projects.deleted'))
    } catch {
      toast.error(t('projects.deleteFailed'))
    }
  }

  const handleNewProject = () => {
    reset()
    onClose()
    toast.info(t('projects.newCreated'))
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-obsidian border-r border-gold/[0.15] z-50 flex flex-col shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-gold/[0.12] shrink-0">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-gold/60" />
            <span className="text-sm text-gold/90 mono-text tracking-wider">{t('projects.title')}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gold/[0.1] rounded transition-colors">
            <X className="w-4 h-4 text-gold-muted/50" />
          </button>
        </div>

        {/* New project button */}
        <div className="p-3 border-b border-gold/[0.08]">
          <button
            onClick={handleNewProject}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold/[0.08] hover:bg-gold/[0.15] border border-gold/[0.15] text-gold/80 text-xs mono-text tracking-wider transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('projects.new')}
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-gold/40 animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <FolderOpen className="w-8 h-8 text-gold/15" />
              <p className="text-xs text-gold-muted/30 mono-text tracking-wider">{t('projects.empty')}</p>
            </div>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleLoad(project.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all group ${
                  projectId === project.id
                    ? 'bg-gold/[0.1] border-gold/[0.25]'
                    : 'bg-obsidian-light/30 border-gold/[0.08] hover:border-gold/[0.2] hover:bg-gold/[0.05]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground/80 truncate">{project.title}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock className="w-3 h-3 text-gold-muted/30" />
                      <span className="text-[10px] text-gold-muted/30 mono-text">{formatDate(project.updated_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  )
}
