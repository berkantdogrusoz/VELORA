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

/**
 * Parse all complete and partial velora-file blocks during streaming.
 * Returns a merged files map with all complete blocks + the last partial block.
 */
export function parseAllPartialVeloraFiles(text: string): Record<string, string> {
  const files: Record<string, string> = {}

  // Find all complete blocks
  const completeRegex = /<velora-file\s+name="([^"]+)">([\s\S]*?)<\/velora-file>/g
  let match
  let lastCompleteEnd = 0
  while ((match = completeRegex.exec(text)) !== null) {
    const fileName = match[1]
    let content = match[2]
    content = content.replace(/^\n/, '').replace(/\n$/, '')
    files[fileName] = content
    lastCompleteEnd = match.index + match[0].length
  }

  // Check for a trailing partial block after the last complete one
  const remaining = text.slice(lastCompleteEnd)
  const partialMatch = remaining.match(/<velora-file\s+name="([^"]+)">/)
  if (partialMatch) {
    const name = partialMatch[1]
    const startIndex = remaining.indexOf('>', remaining.indexOf(partialMatch[0])) + 1
    const content = remaining.slice(startIndex).replace(/^\n/, '')
    if (content.length > 0) {
      files[name] = content
    }
  }

  return files
}
