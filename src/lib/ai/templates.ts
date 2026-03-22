import type { Template } from '@/types/builder'

export const templates: Template[] = [
  {
    id: 'landing',
    nameKey: 'modernLanding',
    descKey: 'modernLandingDesc',
    icon: '🚀',
    category: 'landing',
    starterPrompt:
      'Build a modern, stunning landing page for a SaaS product called "ÉlanNoire". Include a hero section with gradient background, feature cards with icons, pricing table with 3 tiers, testimonials section, and a footer. Use a purple/blue color scheme with smooth animations.',
  },
  {
    id: 'portfolio',
    nameKey: 'portfolio',
    descKey: 'portfolioDesc',
    icon: '🎨',
    category: 'portfolio',
    starterPrompt:
      'Create a personal portfolio website for a creative developer. Include a hero section with animated text, a project gallery with hover effects, an about section, skills section with progress bars, and a contact form. Use a dark theme with accent colors.',
  },
  {
    id: '3d-hero',
    nameKey: 'interactive3d',
    descKey: 'interactive3dDesc',
    icon: '🌐',
    category: '3d',
    starterPrompt:
      'Build a landing page with a 3D interactive hero section using Three.js. Create a rotating 3D geometric shape (like a torus knot or icosahedron) with a gradient material. Add particle effects in the background. Include a navigation bar and call-to-action buttons overlaid on the 3D scene.',
  },
  {
    id: 'dashboard',
    nameKey: 'adminDashboard',
    descKey: 'adminDashboardDesc',
    icon: '📊',
    category: 'dashboard',
    starterPrompt:
      'Create a modern admin dashboard with a sidebar navigation, top stats cards showing revenue/users/orders, a line chart area, a recent orders table, and a notifications panel. Use a dark theme with blue accents. Make it responsive.',
  },
  {
    id: 'ecommerce',
    nameKey: 'ecommerce',
    descKey: 'ecommerceDesc',
    icon: '🛍️',
    category: 'ecommerce',
    starterPrompt:
      'Build an e-commerce product listing page with a header with search and cart, category filters sidebar, product grid with cards showing images, prices, and ratings, and a featured products carousel. Use a clean, minimal design.',
  },
  {
    id: 'blog',
    nameKey: 'blog',
    descKey: 'blogDesc',
    icon: '📝',
    category: 'blog',
    starterPrompt:
      'Create a modern blog/magazine website with a featured article hero, article grid with thumbnails and excerpts, sidebar with categories and popular posts, newsletter subscription section, and footer. Use elegant typography and spacing.',
  },
]
