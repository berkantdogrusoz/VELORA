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
  projectId: string | null
  projectTitle: string

  addMessage: (msg: Message) => void
  setFiles: (files: Record<string, string>) => void
  updateFile: (name: string, content: string) => void
  setActiveFile: (name: string) => void
  setGenerating: (v: boolean) => void
  setPrompt: (v: string) => void
  setCredits: (n: number) => void
  decrementCredits: () => void
  setProjectId: (id: string | null) => void
  setProjectTitle: (title: string) => void
  loadProject: (id: string, title: string, messages: Message[], files: Record<string, string>) => void
  reset: () => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  messages: [],
  files: {},
  activeFile: 'index.html',
  isGenerating: false,
  prompt: '',
  credits: null,
  projectId: null,
  projectTitle: '',

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

  setProjectId: (id) => set({ projectId: id }),

  setProjectTitle: (title) => set({ projectTitle: title }),

  loadProject: (id, title, messages, files) =>
    set({
      projectId: id,
      projectTitle: title,
      messages,
      files,
      activeFile: 'index.html',
      isGenerating: false,
      prompt: '',
    }),

  reset: () =>
    set({
      messages: [],
      files: {},
      activeFile: 'index.html',
      isGenerating: false,
      prompt: '',
      projectId: null,
      projectTitle: '',
    }),
}))
