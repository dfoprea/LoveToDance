/**
 * prerender.mjs — Post-build SSG prerendering
 * Porneste un server static pe dist/, viziteaza fiecare ruta cu Puppeteer,
 * salveaza HTML-ul generat de React inapoi in dist/{ruta}/index.html
 * Rezultat: Googlebot primeste HTML complet in loc de <div id="root"> gol.
 */

import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const puppeteer = require('./node_modules/puppeteer/index.js')

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, 'dist')
const PORT = 3033

const ROUTES = [
  '/',
  '/instructors',
  '/features',
  '/pricing',
  '/faq',
  '/schedule',
  '/gallery',
  '/combinations',
  '/contact',
  '/privacy',
]

// Mime types pentru server static simplu
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
}

// Server static minimal care serveste dist/
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let urlPath = req.url.split('?')[0]

      // SPA fallback: daca nu are extensie, serveste index.html
      const hasExt = extname(urlPath).length > 0
      const filePath = hasExt
        ? join(DIST_DIR, urlPath)
        : join(DIST_DIR, 'index.html')

      try {
        const data = readFileSync(filePath)
        const ext = extname(filePath)
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
        res.end(data)
      } catch {
        // Fallback la index.html pentru rute React Router
        try {
          const data = readFileSync(join(DIST_DIR, 'index.html'))
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(data)
        } catch {
          res.writeHead(404)
          res.end('Not found')
        }
      }
    })
    server.listen(PORT, () => {
      console.log(`[prerender] Server static pe http://localhost:${PORT}`)
      resolve(server)
    })
  })
}

async function prerender() {
  const server = await startServer()

  console.log('[prerender] Pornesc Puppeteer...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`
    console.log(`[prerender] Procesez: ${route}`)

    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
      // Asteapta ca React sa randeze complet
      await new Promise(r => setTimeout(r, 2500))

      const html = await page.content()

      // Salveaza HTML in dist/{ruta}/index.html
      const routeDir = route === '/' ? DIST_DIR : join(DIST_DIR, route)
      if (!existsSync(routeDir)) mkdirSync(routeDir, { recursive: true })
      writeFileSync(join(routeDir, 'index.html'), html, 'utf8')

      console.log(`[prerender] ✓ ${route}`)
    } catch (err) {
      console.error(`[prerender] ✗ ${route}: ${err.message}`)
    }

    await page.close()
  }

  await browser.close()
  server.close()
  console.log('[prerender] Gata! Toate rutele au fost pre-randate.')
}

prerender().catch(err => {
  console.error('[prerender] Eroare fatala:', err)
  process.exit(1)
})
