'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useBuilderStore } from '@/store/builder-store'
import { parseAllPartialVeloraFiles, parseVeloraFiles } from '@/lib/ai/stream-parser'
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
      const currentFiles = Object.keys(files).length > 0 ? files : undefined

      // Timeout after 150 seconds (server maxDuration is 120s)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 150000)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentFiles,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

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
      if (!reader) throw new Error('Stream not available')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk

        // Try to parse and update preview progressively (supports multiple files)
        const partialFiles = parseAllPartialVeloraFiles(fullText)
        if (Object.keys(partialFiles).length > 0) {
          setFiles(partialFiles)
        }
      }

      // Final parse — ensure files are populated even if progressive parse missed them
      const finalFiles = parseVeloraFiles(fullText)
      if (Object.keys(finalFiles).length > 0) {
        setFiles(finalFiles)

        // Check for truncated HTML — missing </html> means generation was cut off
        const mainFile = finalFiles['index.html'] || Object.values(finalFiles)[0]
        if (mainFile && !mainFile.includes('</html>')) {
          toast.warning('Site generation was incomplete. Try a shorter or simpler prompt.', {
            duration: 6000,
          })
        }
      } else if (fullText.trim()) {
        // AI responded but didn't use velora-file tags — show the raw response
        console.warn('AI response did not contain <velora-file> tags:', fullText.substring(0, 200))
      }

      // Add assistant message
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullText || t('builder.errorMessage'),
        timestamp: Date.now(),
      })
    } catch (error) {
      const msg = error instanceof Error
        ? (error.name === 'AbortError' ? 'Request timed out. Please try again.' : error.message)
        : t('builder.errorOccurred')
      toast.error(msg)
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: msg,
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
    <div className="border-t border-gold/[0.1] p-2 md:p-4 relative z-[1]">
      <div className="flex items-end gap-2 bg-obsidian-light/40 rounded-xl border border-gold/[0.12] p-2 md:p-3 focus-within:border-gold/[0.3] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.06)] transition-all">
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
          className="flex-1 bg-transparent text-sm md:text-base resize-none outline-none placeholder:text-gold-muted/30 text-foreground/90 disabled:opacity-50 max-h-[300px] py-2 px-2 md:py-2.5 md:px-3"
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
      <p className="hidden md:block text-[10px] text-gold-muted/30 mt-1.5 px-1 mono-text tracking-wider">
        {t('builder.sendHint')}
      </p>
    </div>
  )
}
