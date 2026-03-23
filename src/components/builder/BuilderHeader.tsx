'use client'

import { Sparkles, Download, RotateCcw, Coins, FolderOpen, Save } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useBuilderStore } from '@/store/builder-store'
import { toast } from 'sonner'
import Link from 'next/link'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ProjectSidebar } from './ProjectSidebar'

export function BuilderHeader() {
  const { t } = useTranslation()
  const { files, credits, messages, projectId, projectTitle, isGenerating, setCredits, setProjectId, setProjectTitle, reset } = useBuilderStore()
  const hasFiles = Object.keys(files).length > 0
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const prevGenerating = useRef(isGenerating)

  // Fetch credits on mount
  useEffect(() => {
    fetch('/api/credits')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.credits === 'number') {
          setCredits(data.credits)
        }
      })
      .catch(console.error)
  }, [setCredits])

  const saveProject = useCallback(async () => {
    if (messages.length === 0 || Object.keys(files).length === 0) return

    setSaving(true)
    try {
      // Auto-generate title from first user message
      const firstUserMsg = messages.find((m) => m.role === 'user')
      const title = projectTitle || (firstUserMsg?.content.substring(0, 80) || 'Untitled Project')

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title,
          messages,
          files,
        }),
      })

      const data = await res.json()
      if (data.project) {
        setProjectId(data.project.id)
        setProjectTitle(data.project.title)
      }
    } catch {
      console.error('Auto-save failed')
    } finally {
      setSaving(false)
    }
  }, [messages, files, projectId, projectTitle, setProjectId, setProjectTitle])

  // Auto-save when generation completes
  useEffect(() => {
    if (prevGenerating.current && !isGenerating && messages.length > 0) {
      saveProject()
    }
    prevGenerating.current = isGenerating
  }, [isGenerating, messages.length, saveProject])

  const handleManualSave = async () => {
    if (messages.length === 0) {
      toast.error(t('projects.nothingToSave'))
      return
    }
    await saveProject()
    toast.success(t('projects.saved'))
  }

  const handleExport = () => {
    const html = files['index.html']
    if (!html) {
      toast.error(t('builder.noSiteYet'))
      return
    }
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'elannoire-site.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('builder.siteDownloaded'))
  }

  const handleReset = () => {
    if (hasFiles && !window.confirm(t('builder.confirmReset'))) return
    reset()
    toast.info(t('builder.projectReset'))
  }

  return (
    <>
      <header className="h-12 bg-obsidian/80 backdrop-blur-xl border-b border-gold/[0.12] flex items-center justify-between px-2 md:px-4 shrink-0 relative z-10" style={{ boxShadow: '0 1px 20px rgba(201, 168, 76, 0.03)' }}>
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Projects button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 px-2 md:px-2.5 py-1.5 rounded-lg hover:bg-gold/[0.08] border border-gold/[0.1] transition-colors"
            title={t('projects.title')}
          >
            <FolderOpen className="w-4 h-4 text-gold/60" />
            <span className="hidden md:inline text-[10px] text-gold-muted/50 mono-text tracking-wider">{t('projects.title')}</span>
          </button>

          <Link href="/" className="flex items-center gap-1.5 md:gap-2">
            <div className="w-7 h-7 rounded-lg bg-gold/[0.1] border border-gold/[0.2] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold/70" />
            </div>
            <span
              className="hidden md:inline text-sm text-gold tracking-[0.05em]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Élan<span className="text-foreground/90">Noire</span>
            </span>
            <span className="hidden md:inline text-[9px] text-gold-muted/50 mono-text px-1.5 py-0.5 border border-gold/[0.1] rounded-full">
              BETA
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Credits display */}
          <Link
            href="/pricing"
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 text-xs rounded-lg bg-gold/[0.06] border border-gold/[0.1] hover:bg-gold/[0.12] transition-colors"
          >
            <Coins className="w-3.5 h-3.5 text-gold/70" />
            <span className="mono-text text-[11px] text-gold/80 tracking-wider">
              {credits !== null ? credits : '...'}
            </span>
            <span className="hidden md:inline text-[9px] text-gold-muted/40 mono-text">CREDITS</span>
          </Link>

          {hasFiles && (
            <>
              {/* Save button */}
              <button
                onClick={handleManualSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg bg-gold/[0.08] text-gold/80 hover:bg-gold/[0.15] hover:text-gold border border-gold/[0.1] transition-colors mono-text tracking-wider disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{saving ? t('projects.saving') : t('projects.save')}</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg bg-gold/[0.08] text-gold/80 hover:bg-gold/[0.15] hover:text-gold border border-gold/[0.1] transition-colors mono-text tracking-wider"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gold/[0.06] text-gold-muted/50 hover:text-gold/70 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* User button */}
          <div className="ml-0.5 md:ml-1">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7',
                },
              }}
            />
          </div>
        </div>
      </header>

      <ProjectSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
