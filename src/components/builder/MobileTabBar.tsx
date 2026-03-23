'use client'

import { MessageSquare, Eye } from 'lucide-react'
import { useUIStore } from '@/store/ui-store'

export function MobileTabBar() {
  const { mobilePanel, setMobilePanel } = useUIStore()

  return (
    <div className="h-12 bg-obsidian/90 backdrop-blur-xl border-t border-gold/[0.12] flex shrink-0 md:hidden">
      <button
        onClick={() => setMobilePanel('prompt')}
        className={`flex-1 flex items-center justify-center gap-2 text-xs mono-text tracking-wider transition-colors ${
          mobilePanel === 'prompt'
            ? 'text-gold border-t-2 border-gold/60 bg-gold/[0.06]'
            : 'text-gold-muted/40 hover:text-gold/60'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        CHAT
      </button>
      <div className="w-px bg-gold/[0.08]" />
      <button
        onClick={() => setMobilePanel('preview')}
        className={`flex-1 flex items-center justify-center gap-2 text-xs mono-text tracking-wider transition-colors ${
          mobilePanel === 'preview'
            ? 'text-gold border-t-2 border-gold/60 bg-gold/[0.06]'
            : 'text-gold-muted/40 hover:text-gold/60'
        }`}
      >
        <Eye className="w-4 h-4" />
        PREVIEW
      </button>
    </div>
  )
}
