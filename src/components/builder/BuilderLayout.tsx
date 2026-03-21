'use client'

import {
  Panel,
  Group,
  Separator,
} from 'react-resizable-panels'
import { PromptPanel } from './PromptPanel'
import { PreviewPanel } from './PreviewPanel'
import { BuilderHeader } from './BuilderHeader'

export function BuilderLayout() {
  return (
    <div className="flex flex-col h-full bg-obsidian">
      <BuilderHeader />
      <Group orientation="horizontal" className="flex-1">
        <Panel defaultSize="38%" minSize="25%" maxSize="55%">
          <PromptPanel />
        </Panel>
        <Separator className="w-[3px] bg-gold/[0.06] hover:bg-gold/[0.2] transition-colors" />
        <Panel defaultSize="62%" minSize="35%">
          <PreviewPanel />
        </Panel>
      </Group>
    </div>
  )
}
