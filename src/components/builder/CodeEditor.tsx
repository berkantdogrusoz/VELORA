'use client'

import dynamic from 'next/dynamic'
import { useBuilderStore } from '@/store/builder-store'
import { Loader2 } from 'lucide-react'

const Editor = dynamic(() => import('@monaco-editor/react').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-card">
      <div className="flex items-center gap-2 text-muted text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Editör yükleniyor...
      </div>
    </div>
  ),
})

export function CodeEditor() {
  const { files, activeFile, updateFile } = useBuilderStore()
  const code = files[activeFile] || ''

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFile(activeFile, value)
    }
  }

  return (
    <Editor
      height="100%"
      language="html"
      theme="vs-dark"
      value={code}
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: 'var(--font-geist-mono), monospace',
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        renderLineHighlight: 'gutter',
        bracketPairColorization: { enabled: true },
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  )
}
