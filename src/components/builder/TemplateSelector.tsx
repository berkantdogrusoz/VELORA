'use client'

import { Sparkles } from 'lucide-react'
import { templates } from '@/lib/ai/templates'
import { useBuilderStore } from '@/store/builder-store'

export function TemplateSelector() {
  const { setPrompt } = useBuilderStore()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-2">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center mx-auto animate-pulse-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-lg font-semibold">Ne oluşturmak istiyorsunuz?</h2>
        <p className="text-xs text-muted max-w-[280px]">
          Bir şablon seçin veya hayalinizdeki web sitesini aşağıdaki kutucuğa yazın
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setPrompt(template.starterPrompt)}
            className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border hover:border-accent/50 hover:bg-card-hover transition-all text-left group"
          >
            <span className="text-lg">{template.icon}</span>
            <span className="text-xs font-medium group-hover:text-accent-light transition-colors">
              {template.name}
            </span>
            <span className="text-[10px] text-muted leading-tight">
              {template.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
