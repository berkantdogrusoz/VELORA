'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useBuilderStore } from '@/store/builder-store'
import { parsePartialVeloraFile } from '@/lib/ai/stream-parser'
import { toast } from 'sonner'

export function PromptInput() {
  const [input, setInput] = useState('')
  const storePrompt = useBuilderStore((s) => s.prompt)

  // Sync store prompt (from template selection) into local input
  useEffect(() => {
    if (storePrompt) {
      setInput(storePrompt)
      useBuilderStore.getState().setPrompt('')
      textareaRef.current?.focus()
    }
  }, [storePrompt])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { messages, files, isGenerating, addMessage, setFiles, setGenerating } =
    useBuilderStore()

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isGenerating) return

    // Add user message
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: trimmed,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setGenerating(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const currentCode = files['index.html'] || undefined

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentCode,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'AI isteği başarısız oldu')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream okunamadı')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk

        // Try to parse and update preview progressively
        const parsed = parsePartialVeloraFile(fullText)
        if (parsed) {
          setFiles({ [parsed.name]: parsed.content })
        }
      }

      // Add assistant message
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullText,
        timestamp: Date.now(),
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Bir hata oluştu'
      )
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: Date.now(),
      })
    } finally {
      setGenerating(false)
    }
  }, [input, isGenerating, messages, files, addMessage, setFiles, setGenerating])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <div className="border-t border-gold/[0.08] p-3">
      <div className="flex items-end gap-2 bg-obsidian-light/50 rounded-lg border border-gold/[0.1] p-2 focus-within:border-gold/[0.25] transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            isGenerating
              ? 'AI çalışıyor...'
              : 'Hayalinizdeki web sitesini anlatın...'
          }
          disabled={isGenerating}
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-gold-muted/30 text-foreground/90 disabled:opacity-50 max-h-[200px] py-1.5 px-2"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isGenerating}
          className="shrink-0 w-8 h-8 rounded-lg bg-gold/[0.15] hover:bg-gold/[0.3] border border-gold/[0.2] disabled:opacity-30 disabled:hover:bg-gold/[0.15] flex items-center justify-center transition-all"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 text-gold animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-gold" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-gold-muted/30 mt-1.5 px-1 mono-text tracking-wider">
        Enter ile gönder · Shift+Enter ile yeni satır
      </p>
    </div>
  )
}
