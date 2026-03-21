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
            ? 'bg-card-hover text-foreground'
            : 'bg-gradient-to-br from-accent to-blue-500 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted mb-1">
          {isUser ? 'Sen' : 'ÉlanNoire AI'}
        </p>
        <div
          className={`text-sm leading-relaxed ${
            isUser ? 'text-foreground' : 'text-foreground/90'
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
