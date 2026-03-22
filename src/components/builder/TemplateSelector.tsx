'use client'

import { Sparkles } from 'lucide-react'
import { templates } from '@/lib/ai/templates'
import { useBuilderStore } from '@/store/builder-store'

export function TemplateSelector() {
  const { setPrompt } = useBuilderStore()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-2 relative z-[1]">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gold/[0.06] border border-gold/[0.15] flex items-center justify-center mx-auto animate-pulse-glow">
          <Sparkles className="w-7 h-7 text-gold/60" />
        </div>
        <h2
          className="text-xl italic text-gold-gradient"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Ne oluşturmak istiyorsunuz?
        </h2>
        <p className="text-xs text-gold-muted/50 max-w-[280px] mono-text tracking-wider leading-relaxed">
          Bir şablon seçin veya hayalinizdeki web sitesini aşağıdaki kutucuğa yazın
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[400px]">
        {templates.map((template, i) => (
          <button
            key={template.id}
            onClick={() => setPrompt(template.starterPrompt)}
            className="flex flex-col gap-1.5 p-3.5 gold-border-glow bg-obsidian-light/30 hover:bg-obsidian-light/60 transition-all text-left group animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
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
