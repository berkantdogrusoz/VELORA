'use client'

import { useBuilderStore } from '@/store/builder-store'
import { useUIStore } from '@/store/ui-store'
import { TabBar } from './TabBar'
import { CodeEditor } from './CodeEditor'
import { Globe, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/i18n-context'
import { useState, useEffect, useCallback } from 'react'

function injectNavigationInterceptor(html: string): string {
  const script = `<script>
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (a) {
        var href = a.getAttribute('href');
        if (href && href.endsWith('.html') && !href.startsWith('http')) {
          e.preventDefault();
          window.parent.postMessage({ type: 'elannoire-navigate', page: href }, '*');
        }
      }
    });
  </script>`
  if (html.includes('</body>')) {
    return html.replace('</body>', script + '</body>')
  }
  return html + script
}

export function PreviewPanel() {
  const { files, isGenerating } = useBuilderStore()
  const { activeTab, deviceView, previewFile, setPreviewFile } = useUIStore()
  const { t } = useTranslation()
  const html = files[previewFile] || files['index.html'] || ''
  const hasContent = Object.keys(files).length > 0
  const [previewHtml, setPreviewHtml] = useState('')

  // Only update preview when generation completes — zero flicker
  useEffect(() => {
    if (!isGenerating && html) {
      setPreviewHtml(injectNavigationInterceptor(html))
    }
  }, [isGenerating, html])

  // Listen for navigation messages from the iframe
  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === 'elannoire-navigate' && e.data.page) {
      const page = e.data.page as string
      // Check if the target page exists in files
      if (files[page]) {
        setPreviewFile(page)
      }
    }
  }, [files, setPreviewFile])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  const showPreview = previewHtml.length > 0

  return (
    <div className="flex flex-col h-full bg-obsidian/60">
      <TabBar />
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'preview' ? (
          showPreview && !isGenerating ? (
            <div className="w-full h-full flex items-start justify-center bg-obsidian overflow-auto p-0">
              <iframe
                key={`preview-${previewFile}`}
                srcDoc={previewHtml}
                sandbox="allow-scripts"
                className={`h-full border-0 bg-white transition-all duration-300 ${
                  deviceView === 'desktop'
                    ? 'w-full'
                    : deviceView === 'tablet'
                      ? 'w-[768px] rounded-lg shadow-[0_0_30px_rgba(201,168,76,0.1)] mt-4'
                      : 'w-[375px] rounded-lg shadow-[0_0_30px_rgba(201,168,76,0.1)] mt-4'
                }`}
                title="Preview"
              />
            </div>
          ) : (
            <EmptyPreview isGenerating={isGenerating} t={t} />
          )
        ) : (
          <CodeEditor />
        )}

        {/* Generating overlay */}
        {isGenerating && hasContent && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-obsidian/90 backdrop-blur border border-gold/[0.15] rounded-lg px-3 py-1.5 text-xs text-gold/80 mono-text tracking-wider">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('builder.updating')}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyPreview({ isGenerating, t }: { isGenerating: boolean; t: (key: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 obsidian-bg gold-veins relative">
      {isGenerating ? (
        <div className="relative z-[1] flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/[0.06] border border-gold/[0.15] flex items-center justify-center animate-pulse-glow">
            <Loader2 className="w-8 h-8 text-gold/60 animate-spin" />
          </div>
          <p
            className="text-sm text-gold-gradient italic"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {t('builder.creatingYourSite')}
          </p>
          <p className="text-xs text-gold-muted/40 mono-text tracking-wider">
            {t('builder.aiPreparing')}
          </p>
        </div>
      ) : (
        <div className="relative z-[1] flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gold-border-glow bg-obsidian-light/50 flex items-center justify-center">
            <Globe className="w-8 h-8 text-gold/25" />
          </div>
          <p
            className="text-sm text-gold-gradient italic"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {t('builder.previewHere')}
          </p>
          <p className="text-xs text-gold-muted/30 mono-text tracking-wider">
            {t('builder.sendPrompt')}
          </p>
        </div>
      )}
    </div>
  )
}
