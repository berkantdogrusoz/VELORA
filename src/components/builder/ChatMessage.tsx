'use client'

import { User, Bot } from 'lucide-react'
import type { Message } from '@/types/builder'
import { useTranslation } from '@/lib/i18n/i18n-context'

export function ChatMessage({ message }: { message: Message }) {
  const { t } = useTranslation()
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 animate-fade-in relative z-[1] ${isUser ? '' : ''}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? 'bg-obsidian-light/80 border border-gold/[0.08] text-foreground/60'
            : 'bg-gold/[0.1] border border-gold/[0.2] text-gold shadow-[0_0_10px_rgba(201,168,76,0.08)]'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium mb-1 mono-text tracking-wider ${isUser ? 'text-gold-muted/50' : 'text-gold/60'}`}>
          {isUser ? t('builder.you') : t('builder.aiLabel')}
        </p>
        <div
          className={`text-sm leading-relaxed ${
            isUser ? 'text-foreground/90' : 'text-foreground/80'
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <p className="whitespace-pre-wrap">
              {message.content.includes('<velora-file')
                ? t('builder.siteCreated')
                : message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
