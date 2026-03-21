'use client'

import { User, Bot } from 'lucide-react'
import type { Message } from '@/types/builder'

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? '' : ''}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? 'bg-obsidian-light border border-gold/[0.08] text-foreground/60'
            : 'bg-gold/[0.1] border border-gold/[0.2] text-gold'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gold-muted/50 mb-1 mono-text tracking-wider">
          {isUser ? 'SEN' : 'ÉLANNOIRE AI'}
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
                ? 'Site oluşturuldu! Sağ panelde önizlemeyi görebilirsiniz. ✨'
                : message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
