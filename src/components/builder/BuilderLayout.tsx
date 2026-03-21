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
    <div className="flex flex-col h-full">
      <BuilderHeader />
      <Group orientation="horizontal" className="flex-1">
        <Panel defaultSize="38%" minSize="25%" maxSize="55%">
          <PromptPanel />
        </Panel>
        <Separator className="w-1.5 bg-border hover:bg-accent transition-colors" />
        <Panel defaultSize="62%" minSize="35%">
          <PreviewPanel />
        </Panel>
      </Group>
    </div>
  )
}
