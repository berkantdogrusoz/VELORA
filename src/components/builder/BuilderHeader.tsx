'use client'

import { Sparkles, Download, RotateCcw, Coins } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useBuilderStore } from '@/store/builder-store'
import { toast } from 'sonner'
import Link from 'next/link'
import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { LanguageSwitcher } from './LanguageSwitcher'

export function BuilderHeader() {
  const { t } = useTranslation()
  const { files, credits, setCredits, reset } = useBuilderStore()
  const hasFiles = Object.keys(files).length > 0

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
    <header className="h-12 bg-obsidian/80 backdrop-blur-xl border-b border-gold/[0.12] flex items-center justify-between px-4 shrink-0 relative z-10" style={{ boxShadow: '0 1px 20px rgba(201, 168, 76, 0.03)' }}>
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gold/[0.1] border border-gold/[0.2] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-gold/70" />
        </div>
        <span
          className="text-sm text-gold tracking-[0.05em]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Élan<span className="text-foreground/90">Noire</span>
        </span>
        <span className="text-[9px] text-gold-muted/50 mono-text px-1.5 py-0.5 border border-gold/[0.1] rounded-full">
          BETA
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Credits display */}
        <Link
          href="/pricing"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gold/[0.06] border border-gold/[0.1] hover:bg-gold/[0.12] transition-colors"
        >
          <Coins className="w-3.5 h-3.5 text-gold/70" />
          <span className="mono-text text-[11px] text-gold/80 tracking-wider">
            {credits !== null ? credits : '...'}
          </span>
          <span className="text-[9px] text-gold-muted/40 mono-text">CREDITS</span>
        </Link>

        {hasFiles && (
          <>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gold/[0.08] text-gold/80 hover:bg-gold/[0.15] hover:text-gold border border-gold/[0.1] transition-colors mono-text tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gold/[0.06] text-gold-muted/50 hover:text-gold/70 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* User button */}
        <div className="ml-1">
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
  )
}
