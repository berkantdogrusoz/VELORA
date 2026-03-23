import { getPublishedSite } from '@/lib/db/published-sites'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; page?: string[] }> }
) {
  const { slug, page } = await params
  const filename = page?.length ? page[0] + '.html' : 'index.html'

  const site = await getPublishedSite(slug)
  if (!site) {
    return new Response(notFoundPage(slug), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const html = site.files[filename]
  if (!html) {
    return new Response(notFoundPage(slug, filename), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // Rewrite internal .html links to clean URLs
  const rewrittenHtml = html.replace(
    /href="([^"]+)\.html"/g,
    (_, name) => `href="/s/${slug}/${name}"`
  )

  return new Response(rewrittenHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  })
}

function notFoundPage(slug: string, file?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found — ElanNoire</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; color: #c9a84c; font-family: system-ui, sans-serif; }
    .container { text-align: center; }
    h1 { font-size: 4rem; margin: 0; opacity: 0.3; }
    p { color: #888; margin-top: 1rem; }
    a { color: #c9a84c; text-decoration: none; border-bottom: 1px solid #c9a84c33; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>${file ? `Page "${file}" not found in site "${slug}".` : `Site "${slug}" not found.`}</p>
    <p><a href="/">← Back to ElanNoire</a></p>
  </div>
</body>
</html>`
}
