'use client'

import { useRef, useEffect } from 'react'
import { useBuilderStore } from '@/store/builder-store'
import { ChatMessage } from './ChatMessage'
import { PromptInput } from './PromptInput'
import { TemplateSelector } from './TemplateSelector'

export function PromptPanel() {
  const { messages } = useBuilderStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full bg-obsidian/40 gold-veins relative">
      {!hasMessages ? (
        <div className="flex-1 overflow-y-auto p-4">
          <TemplateSelector />
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      )}
      <PromptInput />
    </div>
  )
}
