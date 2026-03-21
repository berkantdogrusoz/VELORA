/**
 * Parse streaming AI output for <velora-file> blocks.
 * Returns a map of filename -> content.
 */
export function parseVeloraFiles(text: string): Record<string, string> {
  const files: Record<string, string> = {}
  const regex = /<velora-file\s+name="([^"]+)">([\s\S]*?)(?:<\/velora-file>|$)/g

  let match
  while ((match = regex.exec(text)) !== null) {
    const fileName = match[1]
    let content = match[2]
    // Trim leading/trailing whitespace from content
    content = content.replace(/^\n/, '').replace(/\n$/, '')
    files[fileName] = content
  }

  return files
}

/**
 * Extract partial content during streaming (before closing tag arrives).
 */
export function parsePartialVeloraFile(text: string): { name: string; content: string } | null {
  const openTagMatch = text.match(/<velora-file\s+name="([^"]+)">/)
  if (!openTagMatch) return null

  const name = openTagMatch[1]
  const startIndex = text.indexOf('>',  text.indexOf(openTagMatch[0])) + 1
  const endTagIndex = text.indexOf('</velora-file>')

  const content = endTagIndex !== -1
    ? text.slice(startIndex, endTagIndex)
    : text.slice(startIndex)

  return { name, content: content.replace(/^\n/, '') }
}
