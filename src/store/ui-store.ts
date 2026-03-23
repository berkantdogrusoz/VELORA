'use client'

import { create } from 'zustand'

type ActiveTab = 'preview' | 'code'
type DeviceView = 'desktop' | 'tablet' | 'mobile'
type MobilePanel = 'prompt' | 'preview'

interface UIState {
  activeTab: ActiveTab
  deviceView: DeviceView
  mobilePanel: MobilePanel
  previewFile: string

  setActiveTab: (tab: ActiveTab) => void
  setDeviceView: (view: DeviceView) => void
  setMobilePanel: (panel: MobilePanel) => void
  setPreviewFile: (file: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'preview',
  deviceView: 'desktop',
  mobilePanel: 'prompt',
  previewFile: 'index.html',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceView: (view) => set({ deviceView: view }),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
  setPreviewFile: (file) => set({ previewFile: file }),
}))
