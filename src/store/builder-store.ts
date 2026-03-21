'use client'

import { create } from 'zustand'
import type { Message } from '@/types/builder'

interface BuilderState {
  messages: Message[]
  files: Record<string, string>
  activeFile: string
  isGenerating: boolean
  prompt: string

  addMessage: (msg: Message) => void
  setFiles: (files: Record<string, string>) => void
  updateFile: (name: string, content: string) => void
  setActiveFile: (name: string) => void
  setGenerating: (v: boolean) => void
  setPrompt: (v: string) => void
  reset: () => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  messages: [],
  files: {},
  activeFile: 'index.html',
  isGenerating: false,
  prompt: '',

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

  reset: () =>
    set({
      messages: [],
      files: {},
      activeFile: 'index.html',
      isGenerating: false,
      prompt: '',
    }),
}))
