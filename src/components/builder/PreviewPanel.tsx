'use client'

import { useBuilderStore } from '@/store/builder-store'
import { useUIStore } from '@/store/ui-store'
import { TabBar } from './TabBar'
import { CodeEditor } from './CodeEditor'
import { Globe, Loader2 } from 'lucide-react'

export function PreviewPanel() {
  const { files, isGenerating } = useBuilderStore()
  const { activeTab, deviceView } = useUIStore()
  const html = files['index.html'] || ''
  const hasContent = html.length > 0

  return (
    <div className="flex flex-col h-full bg-card">
      <TabBar />
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'preview' ? (
          hasContent ? (
            <div className="w-full h-full flex items-start justify-center bg-zinc-950 overflow-auto p-0">
              <iframe
                srcDoc={html}
                sandbox="allow-scripts allow-same-origin"
                className={`h-full border-0 bg-white transition-all duration-300 ${
                  deviceView === 'desktop'
                    ? 'w-full'
                    : deviceView === 'tablet'
                      ? 'w-[768px] rounded-lg shadow-2xl mt-4'
                      : 'w-[375px] rounded-lg shadow-2xl mt-4'
                }`}
                title="Preview"
              />
            </div>
          ) : (
            <EmptyPreview isGenerating={isGenerating} />
          )
        ) : (
          <CodeEditor />
        )}

        {/* Generating overlay */}
        {isGenerating && hasContent && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-card/90 backdrop-blur border border-border rounded-lg px-3 py-1.5 text-xs text-accent-light">
            <Loader2 className="w-3 h-3 animate-spin" />
            Güncelleniyor...
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyPreview({ isGenerating }: { isGenerating: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted">
      {isGenerating ? (
        <>
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Siteniz oluşturuluyor...
          </p>
          <p className="text-xs text-muted">
            AI muhteşem bir şey hazırlıyor
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-2xl bg-card-hover flex items-center justify-center">
            <Globe className="w-8 h-8 text-muted" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Önizleme burada görünecek
          </p>
          <p className="text-xs text-muted">
            Soldaki panelden bir prompt gönderin
          </p>
        </>
      )}
    </div>
  )
}
