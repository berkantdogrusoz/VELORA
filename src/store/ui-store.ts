'use client'

import { create } from 'zustand'

type ActiveTab = 'preview' | 'code'
type DeviceView = 'desktop' | 'tablet' | 'mobile'

interface UIState {
  activeTab: ActiveTab
  deviceView: DeviceView
  isSidebarCollapsed: boolean

  setActiveTab: (tab: ActiveTab) => void
  setDeviceView: (view: DeviceView) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'preview',
  deviceView: 'desktop',
  isSidebarCollapsed: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceView: (view) => set({ deviceView: view }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
