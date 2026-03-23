'use client'

import { Eye, Code2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { useBuilderStore } from '@/store/builder-store'

export function TabBar() {
  const { activeTab, setActiveTab, deviceView, setDeviceView, previewFile, setPreviewFile } = useUIStore()
  const { files, activeFile, setActiveFile } = useBuilderStore()
  const fileNames = Object.keys(files)
  const hasMultipleFiles = fileNames.length > 1

  return (
    <div className="shrink-0">
      <div className="h-10 bg-obsidian/80 backdrop-blur-md border-b border-gold/[0.1] flex items-center justify-between px-2">
        {/* Tab buttons */}
        <div className="flex items-center gap-0.5">
          <TabButton
            active={activeTab === 'preview'}
            onClick={() => setActiveTab('preview')}
            icon={<Eye className="w-3.5 h-3.5" />}
            label="Preview"
          />
          <TabButton
            active={activeTab === 'code'}
            onClick={() => setActiveTab('code')}
            icon={<Code2 className="w-3.5 h-3.5" />}
            label="Code"
          />
        </div>

        {/* Device view buttons (only in preview mode, hidden on mobile) */}
        {activeTab === 'preview' && (
          <div className="hidden md:flex items-center gap-0.5">
            <DeviceButton
              active={deviceView === 'desktop'}
              onClick={() => setDeviceView('desktop')}
              icon={<Monitor className="w-3.5 h-3.5" />}
            />
            <DeviceButton
              active={deviceView === 'tablet'}
              onClick={() => setDeviceView('tablet')}
              icon={<Tablet className="w-3.5 h-3.5" />}
            />
            <DeviceButton
              active={deviceView === 'mobile'}
              onClick={() => setDeviceView('mobile')}
              icon={<Smartphone className="w-3.5 h-3.5" />}
            />
          </div>
        )}
      </div>

      {/* File tabs — shown when multiple files exist */}
      {hasMultipleFiles && (
        <div className="h-8 bg-obsidian/60 border-b border-gold/[0.08] flex items-center gap-0.5 px-2 overflow-x-auto">
          {fileNames.map((name) => {
            const isActive = activeTab === 'code' ? activeFile === name : previewFile === name
            return (
              <button
                key={name}
                onClick={() => {
                  if (activeTab === 'code') {
                    setActiveFile(name)
                  } else {
                    setPreviewFile(name)
                  }
                }}
                className={`px-2.5 py-1 text-[10px] rounded-md transition-colors mono-text tracking-wider whitespace-nowrap ${
                  isActive
                    ? 'bg-gold/[0.1] text-gold border border-gold/[0.15]'
                    : 'text-gold-muted/35 hover:text-gold/50 hover:bg-gold/[0.05]'
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors mono-text tracking-wider ${
        active
          ? 'bg-gold/[0.1] text-gold border border-gold/[0.15]'
          : 'text-gold-muted/40 hover:text-gold/60 hover:bg-gold/[0.05]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function DeviceButton({
  active,
  onClick,
  icon,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'text-gold bg-gold/[0.1]'
          : 'text-gold-muted/30 hover:text-gold/50 hover:bg-gold/[0.05]'
      }`}
    >
      {icon}
    </button>
  )
}
