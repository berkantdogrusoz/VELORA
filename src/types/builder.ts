export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface GeneratedFile {
  name: string
  content: string
  language: string
}

export interface Template {
  id: string
  nameKey: string
  descKey: string
  icon: string
  category: 'landing' | 'portfolio' | '3d' | 'dashboard' | 'ecommerce' | 'blog'
  starterPrompt: string
}
