'use client'

import { Eye, Code2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useUIStore } from '@/store/ui-store'

export function TabBar() {
  const { activeTab, setActiveTab, deviceView, setDeviceView } = useUIStore()

  return (
    <div className="h-10 bg-card border-b border-border flex items-center justify-between px-2 shrink-0">
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

      {/* Device view buttons (only in preview mode) */}
      {activeTab === 'preview' && (
        <div className="flex items-center gap-0.5">
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
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        active
          ? 'bg-accent/15 text-accent-light'
          : 'text-muted hover:text-foreground hover:bg-card-hover'
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
          ? 'text-accent-light bg-accent/15'
          : 'text-muted hover:text-foreground hover:bg-card-hover'
      }`}
    >
      {icon}
    </button>
  )
}
