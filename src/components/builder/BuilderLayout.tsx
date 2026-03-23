'use client'

import { useState, useEffect } from 'react'
import {
  Panel,
  Group,
  Separator,
} from 'react-resizable-panels'
import { PromptPanel } from './PromptPanel'
import { PreviewPanel } from './PreviewPanel'
import { BuilderHeader } from './BuilderHeader'
import { MobileTabBar } from './MobileTabBar'
import { useUIStore } from '@/store/ui-store'

export function BuilderLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const { mobilePanel } = useUIStore()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="flex flex-col h-full obsidian-bg relative">
      <BuilderHeader />

      {isMobile ? (
        <>
          <div className="flex-1 overflow-hidden">
            {mobilePanel === 'prompt' ? <PromptPanel /> : <PreviewPanel />}
          </div>
          <MobileTabBar />
        </>
      ) : (
        <Group orientation="horizontal" className="flex-1">
          <Panel defaultSize="38%" minSize="25%" maxSize="55%">
            <PromptPanel />
          </Panel>
          <Separator className="w-[3px] bg-gold/[0.06] hover:bg-gold/[0.25] transition-colors cursor-col-resize relative group">
            <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-gold/[0.04] transition-colors" />
          </Separator>
          <Panel defaultSize="62%" minSize="35%">
            <PreviewPanel />
          </Panel>
        </Group>
      )}
    </div>
  )
}
