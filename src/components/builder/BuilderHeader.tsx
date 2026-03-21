'use client'

import { Sparkles, Download, RotateCcw } from 'lucide-react'
import { useBuilderStore } from '@/store/builder-store'
import { toast } from 'sonner'

export function BuilderHeader() {
  const { files, reset } = useBuilderStore()
  const hasFiles = Object.keys(files).length > 0

  const handleExport = () => {
    const html = files['index.html']
    if (!html) {
      toast.error('Henüz oluşturulmuş bir site yok!')
      return
    }
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'elannoire-site.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Site indirildi!')
  }

  const handleReset = () => {
    if (hasFiles && !window.confirm('Tüm çalışmanız silinecek. Emin misiniz?')) return
    reset()
    toast.info('Proje sıfırlandı')
  }

  return (
    <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm tracking-tight">ÉlanNoire</span>
        <span className="text-[10px] text-muted bg-card-hover px-1.5 py-0.5 rounded-full font-medium">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-1">
        {hasFiles && (
          <>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/10 text-accent-light hover:bg-accent/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-card-hover text-muted hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
