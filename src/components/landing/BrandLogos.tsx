'use client'

import type { ReactNode } from 'react'

/* Brand logos — mix of real + fictional brands for social proof */
export function BrandLogo({ name, className = '' }: { name: string; className?: string }) {
  const color = 'currentColor'

  const logos: Record<string, ReactNode> = {
    /* ===== Real Brands ===== */
    Microsoft: (
      <svg viewBox="0 0 23 23" className={className} fill={color}>
        <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
      </svg>
    ),
    Shopify: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zm-1.584-18.2c0-.096-.021-.178-.044-.259-.615-1.627-1.721-2.485-2.9-2.485-.073 0-.149.005-.224.014-.034-.041-.068-.082-.104-.12C9.792 2.153 8.891 1.8 7.834 1.83c-2.063.062-4.12 1.554-5.792 4.2C.896 7.828.195 9.872.037 11.434c0 0 3.524-1.073 3.598-1.097.201-.695.553-1.727 1.012-2.748.718-1.594 1.6-2.642 2.378-3.026-.335 1.091-.596 2.601-.596 2.601l3.324-1.011s.585-3.374.585-3.374h.003z" />
      </svg>
    ),
    Vercel: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M12 1L24 22H0L12 1z" />
      </svg>
    ),
    Notion: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.04 2.17c-.42-.326-.98-.7-2.055-.607L3.01 2.721c-.466.046-.56.28-.373.466l1.822 1.021zm.793 3.313v13.904c0 .746.373 1.026 1.214.98l14.523-.84c.84-.046.932-.56.932-1.166V6.595c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.746.327-.746.886v.04zm14.337.42c.093.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.746 0-.933-.234-1.493-.933l-4.571-7.178v6.946l1.446.327s0 .84-1.166.84l-3.22.187c-.093-.187 0-.653.327-.746l.84-.233V8.958l-1.166-.093c-.093-.42.14-1.026.793-1.073l3.453-.233 4.759 7.272V8.491l-1.213-.14c-.093-.513.28-.886.746-.932l3.22-.187-.003.002z" />
      </svg>
    ),

    /* ===== Fictional Brands ===== */
    Luminary: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
    Arcway: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M12 2C6.48 2 2 8 2 12c0 2.5 1.5 5 4 7h12c2.5-2 4-4.5 4-7 0-4-4.48-10-10-10zm0 3c3.5 0 7 4.5 7 7 0 1.5-.8 3-2 4.5H7c-1.2-1.5-2-3-2-4.5 0-2.5 3.5-7 7-7z" />
      </svg>
    ),
    Prismix: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M12 2L3 20h18L12 2zm0 5l5.5 11h-11L12 7z" />
      </svg>
    ),
    NovaByte: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M12 2l2.4 7.2H22l-6 4.4 2.4 7.2L12 16.4l-6.4 4.4 2.4-7.2-6-4.4h7.6z" />
      </svg>
    ),
    Flowmark: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M4 4c0 4 3 6 5 8s5 4 5 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M10 4c0 4 3 6 5 8s5 4 5 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
    Zenith: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M3 20h18L12 4 3 20zm2.5-2L12 7l6.5 11H5.5z" />
        <circle cx="12" cy="15" r="1.5" />
      </svg>
    ),
    Corelink: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    Vantiq: (
      <svg viewBox="0 0 24 24" className={className} fill={color}>
        <path d="M2 4l8 16L18 4" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4l8 16" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  }

  return logos[name] || null
}

export const brandNames = [
  'Microsoft', 'Luminary', 'Shopify', 'Arcway', 'Vercel',
  'Prismix', 'NovaByte', 'Notion', 'Flowmark', 'Zenith',
  'Corelink', 'Vantiq',
]
