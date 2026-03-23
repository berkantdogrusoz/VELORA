'use client'

import { create } from 'zustand'

type ActiveTab = 'preview' | 'code'
type DeviceView = 'desktop' | 'tablet' | 'mobile'
type MobilePanel = 'prompt' | 'preview'

interface UIState {
  activeTab: ActiveTab
  deviceView: DeviceView
  mobilePanel: MobilePanel

  setActiveTab: (tab: ActiveTab) => void
  setDeviceView: (view: DeviceView) => void
  setMobilePanel: (panel: MobilePanel) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'preview',
  deviceView: 'desktop',
  mobilePanel: 'prompt',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceView: (view) => set({ deviceView: view }),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
}))
