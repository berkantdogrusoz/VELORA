'use client'

import { Sparkles } from 'lucide-react'
import { templates } from '@/lib/ai/templates'
import { useBuilderStore } from '@/store/builder-store'
import { useTranslation } from '@/lib/i18n/i18n-context'

export function TemplateSelector() {
  const { setPrompt } = useBuilderStore()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 md:gap-6 px-2 relative z-[1]">
      <div className="text-center space-y-2 md:space-y-3">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gold/[0.06] border border-gold/[0.15] flex items-center justify-center mx-auto animate-pulse-glow">
          <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-gold/60" />
        </div>
        <h2
          className="text-lg md:text-xl italic text-gold-gradient"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {t('builder.whatToCreate')}
        </h2>
        <p className="text-[10px] md:text-xs text-gold-muted/50 max-w-[280px] mono-text tracking-wider leading-relaxed">
          {t('builder.selectTemplate')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-2.5 w-full max-w-full md:max-w-[400px]">
        {templates.map((template, i) => (
          <button
            key={template.id}
            onClick={() => setPrompt(template.starterPrompt)}
            className="flex flex-col gap-1.5 p-3.5 gold-border-glow bg-obsidian-light/30 hover:bg-obsidian-light/60 transition-all text-left group animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
          >
            <span className="text-lg">{template.icon}</span>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-gold transition-colors">
              {t(`templates.${template.nameKey}`)}
            </span>
            <span className="text-[10px] text-gold-muted/40 leading-tight">
              {t(`templates.${template.descKey}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
