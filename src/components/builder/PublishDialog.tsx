'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Globe, Loader2, X, Check, ExternalLink, Trash2 } from 'lucide-react'
import { useBuilderStore } from '@/store/builder-store'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { toast } from 'sonner'

export function PublishDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const { projectId, publishedSlug, setPublishedSlug } = useBuilderStore()
  const [slug, setSlug] = useState('')
  const [available, setAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [liveUrl, setLiveUrl] = useState<string | null>(null)
  const checkTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  // Fetch current publish status when dialog opens
  useEffect(() => {
    if (!open || !projectId) return

    fetch(`/api/projects/${projectId}/publish`)
      .then((res) => res.json())
      .then((data) => {
        if (data.published) {
          setPublished(true)
          setSlug(data.slug || '')
          setLiveUrl(data.url || null)
          setPublishedSlug(data.slug || null)
        } else {
          setPublished(false)
          setSlug(publishedSlug || '')
          setLiveUrl(null)
        }
      })
      .catch(console.error)
  }, [open, projectId, publishedSlug, setPublishedSlug])

  // Debounced slug availability check
  const checkSlug = useCallback(async (value: string) => {
    if (value.length < 3) {
      setAvailable(null)
      return
    }
    setChecking(true)
    try {
      const res = await fetch(`/api/slug/check?slug=${encodeURIComponent(value)}`)
      const data = await res.json()
      setAvailable(data.available)
    } catch {
      setAvailable(null)
    } finally {
      setChecking(false)
    }
  }, [])

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSlug(cleaned)
    setAvailable(null)

    if (checkTimeout.current) clearTimeout(checkTimeout.current)
    checkTimeout.current = setTimeout(() => checkSlug(cleaned), 500)
  }

  const handlePublish = async () => {
    if (!projectId || !slug || slug.length < 3) return

    setPublishing(true)
    try {
      // Save project first to ensure latest files are in DB
      const saveRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: useBuilderStore.getState().projectTitle || 'Untitled',
          messages: useBuilderStore.getState().messages,
          files: useBuilderStore.getState().files,
        }),
      })
      await saveRes.json()

      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })

      const data = await res.json()
      if (res.ok && data.published) {
        setPublished(true)
        setLiveUrl(data.url)
        setPublishedSlug(data.slug)
        toast.success(t('publish.success'))
      } else {
        toast.error(data.error || t('publish.failed'))
      }
    } catch {
      toast.error(t('publish.failed'))
    } finally {
      setPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    if (!projectId || !window.confirm(t('publish.confirmUnpublish'))) return

    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.published) {
        setPublished(false)
        setLiveUrl(null)
        setPublishedSlug(null)
        toast.success(t('publish.unpublished'))
      }
    } catch {
      toast.error(t('publish.failed'))
    }
  }

  if (!open) return null

  const canPublish = slug.length >= 3 && (available === true || (published && slug === publishedSlug))

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw] bg-obsidian border border-gold/[0.2] rounded-2xl z-50 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold/[0.1]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold/60" />
            <span className="text-sm text-gold/90 mono-text tracking-wider">{t('publish.title')}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gold/[0.1] rounded transition-colors">
            <X className="w-4 h-4 text-gold-muted/50" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!projectId ? (
            <p className="text-sm text-gold-muted/50 text-center py-4">{t('publish.saveFirst')}</p>
          ) : (
            <>
              {/* Slug input */}
              <div>
                <label className="block text-[10px] text-gold-muted/40 mono-text tracking-wider mb-1.5">
                  {t('publish.slugLabel')}
                </label>
                <div className="flex items-center gap-0 bg-obsidian-light/30 rounded-lg border border-gold/[0.12] overflow-hidden">
                  <span className="px-3 py-2.5 text-xs text-gold-muted/30 mono-text bg-obsidian-light/40 border-r border-gold/[0.08]">
                    elannoire.site/s/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-site"
                    className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-foreground/90 placeholder:text-gold-muted/20 mono-text"
                    maxLength={50}
                  />
                  <div className="px-2">
                    {checking ? (
                      <Loader2 className="w-4 h-4 text-gold/40 animate-spin" />
                    ) : available === true ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : available === false ? (
                      <X className="w-4 h-4 text-red-400" />
                    ) : null}
                  </div>
                </div>
                {available === false && (
                  <p className="text-[10px] text-red-400/70 mt-1 mono-text">{t('publish.slugTaken')}</p>
                )}
              </div>

              {/* Live URL */}
              {published && liveUrl && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/[0.08] border border-green-500/[0.2]">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400/80 mono-text">{t('publish.live')}</span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                  >
                    {liveUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handlePublish}
                  disabled={!canPublish || publishing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold/[0.15] hover:bg-gold/[0.25] border border-gold/[0.2] text-gold text-xs mono-text tracking-wider transition-colors disabled:opacity-40 disabled:hover:bg-gold/[0.15]"
                >
                  {publishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  {published ? t('publish.update') : t('publish.publish')}
                </button>

                {published && (
                  <button
                    onClick={handleUnpublish}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-red-500/[0.15] border border-red-500/[0.15] text-red-400/70 text-xs mono-text tracking-wider transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
