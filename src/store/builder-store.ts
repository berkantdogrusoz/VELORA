'use client'

import { create } from 'zustand'
import type { Message } from '@/types/builder'

interface BuilderState {
  messages: Message[]
  files: Record<string, string>
  activeFile: string
  isGenerating: boolean
  prompt: string
  credits: number | null

  addMessage: (msg: Message) => void
  setFiles: (files: Record<string, string>) => void
  updateFile: (name: string, content: string) => void
  setActiveFile: (name: string) => void
  setGenerating: (v: boolean) => void
  setPrompt: (v: string) => void
  setCredits: (n: number) => void
  decrementCredits: () => void
  reset: () => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  messages: [],
  files: {},
  activeFile: 'index.html',
  isGenerating: false,
  prompt: '',
  credits: null,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setFiles: (files) => set({ files }),

  updateFile: (name, content) =>
    set((state) => ({
      files: { ...state.files, [name]: content },
    })),

  setActiveFile: (name) => set({ activeFile: name }),

  setGenerating: (v) => set({ isGenerating: v }),

  setPrompt: (v) => set({ prompt: v }),

  setCredits: (n) => set({ credits: n }),

  decrementCredits: () =>
    set((state) => ({
      credits: state.credits !== null ? Math.max(0, state.credits - 1) : null,
    })),

  reset: () =>
    set({
      messages: [],
      files: {},
      activeFile: 'index.html',
      isGenerating: false,
      prompt: '',
    }),
}))
