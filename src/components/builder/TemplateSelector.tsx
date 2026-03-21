'use client'

import { Sparkles } from 'lucide-react'
import { templates } from '@/lib/ai/templates'
import { useBuilderStore } from '@/store/builder-store'

export function TemplateSelector() {
  const { setPrompt } = useBuilderStore()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-2">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-gold/60" />
        </div>
        <h2
          className="text-lg italic text-foreground/90"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Ne oluşturmak istiyorsunuz?
        </h2>
        <p className="text-xs text-gold-muted/50 max-w-[280px] mono-text tracking-wider">
          Bir şablon seçin veya hayalinizdeki web sitesini aşağıdaki kutucuğa yazın
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setPrompt(template.starterPrompt)}
            className="flex flex-col gap-1 p-3 rounded-lg bg-obsidian-light/50 border border-gold/[0.08] hover:border-gold/[0.2] hover:bg-obsidian-light transition-all text-left group"
          >
            <span className="text-lg">{template.icon}</span>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-gold transition-colors">
              {template.name}
            </span>
            <span className="text-[10px] text-gold-muted/40 leading-tight">
              {template.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
