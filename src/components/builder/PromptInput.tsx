'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useBuilderStore } from '@/store/builder-store'
import { parsePartialVeloraFile } from '@/lib/ai/stream-parser'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/i18n-context'

export function PromptInput() {
  const { t } = useTranslation()
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
  const { messages, files, credits, isGenerating, addMessage, setFiles, setGenerating, decrementCredits } =
    useBuilderStore()

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isGenerating) return

    // Check credits before sending
    if (credits !== null && credits <= 0) {
      toast.error(t('builder.noCredits'), {
        action: {
          label: t('builder.getCredits'),
          onClick: () => window.location.href = '/pricing',
        },
      })
      return
    }

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
        if (response.status === 402) {
          toast.error(t('builder.noCredits'), {
            action: {
              label: t('builder.getCredits'),
              onClick: () => window.location.href = '/pricing',
            },
          })
          return
        }
        throw new Error(errorData.error || t('builder.aiFailed'))
      }

      // Deduct credit locally
      decrementCredits()

      const reader = response.body?.getReader()
      if (!reader) throw new Error(t('builder.streamError'))

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
        error instanceof Error ? error.message : t('builder.errorOccurred')
      )
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: t('builder.errorMessage'),
        timestamp: Date.now(),
      })
    } finally {
      setGenerating(false)
    }
  }, [input, isGenerating, messages, files, credits, t, addMessage, setFiles, setGenerating, decrementCredits])

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
    el.style.height = Math.min(el.scrollHeight, 300) + 'px'
  }

  return (
    <div className="border-t border-gold/[0.1] p-4 relative z-[1]">
      <div className="flex items-end gap-2 bg-obsidian-light/40 rounded-xl border border-gold/[0.12] p-3 focus-within:border-gold/[0.3] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.06)] transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            isGenerating
              ? t('builder.aiWorking')
              : t('builder.placeholder')
          }
          disabled={isGenerating}
          rows={2}
          className="flex-1 bg-transparent text-base resize-none outline-none placeholder:text-gold-muted/30 text-foreground/90 disabled:opacity-50 max-h-[300px] py-2.5 px-3"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isGenerating}
          className="shrink-0 w-10 h-10 rounded-lg bg-gold/[0.15] hover:bg-gold/[0.3] border border-gold/[0.2] disabled:opacity-30 disabled:hover:bg-gold/[0.15] flex items-center justify-center transition-all"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-gold" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-gold-muted/30 mt-1.5 px-1 mono-text tracking-wider">
        {t('builder.sendHint')}
      </p>
    </div>
  )
}
