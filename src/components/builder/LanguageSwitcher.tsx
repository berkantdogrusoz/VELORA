'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/i18n-context'
import { localeNames, type Locale } from '@/lib/i18n/translations'

const locales: Locale[] = ['en', 'tr', 'de', 'fr']

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 text-[11px] rounded-lg bg-gold/[0.06] border border-gold/[0.1] hover:bg-gold/[0.12] transition-colors mono-text tracking-wider text-gold/70"
      >
        <Globe className="w-3 h-3" />
        {lang.toUpperCase()}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-obsidian/95 backdrop-blur-xl border border-gold/[0.15] rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 min-w-[120px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                l === lang
                  ? 'bg-gold/[0.12] text-gold'
                  : 'text-foreground/70 hover:bg-gold/[0.06] hover:text-gold/80'
              }`}
            >
              <span className="mono-text text-[10px] w-5">{l.toUpperCase()}</span>
              <span>{localeNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
