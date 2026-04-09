/**
 * optimize-images.mjs
 * Converts raw WhatsApp portfolio images to optimised WebP.
 *
 * Strategy:
 *  - Quality 88  → readable text + sharp numbers while staying small
 *  - Portrait images (stats screenshots) → max 900px wide
 *  - Landscape/grid images              → max 1400px wide
 *  - Also generates a 2× thumbnail at half width for srcset
 */

import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dir  = fileURLToPath(new URL('.', import.meta.url))
const RAW    = resolve(__dir, '../public/portfolio/raw')
const OUT    = resolve(__dir, '../public/portfolio')

await mkdir(OUT, { recursive: true })

// Ordered, renamed mapping: raw filename → output slug + metadata
const FILES = [
  // ── Video content with view counts ────────────────────────────────────
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (3).jpeg',
    slug:     'p01',
    label:    '1,1 mil vizualizări',
    category: 'Video Content',
    maxW:     1000,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (6).jpeg',
    slug:     'p02',
    label:    '1,3 mil vizualizări',
    category: 'Video Content',
    maxW:     900,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (1).jpeg',
    slug:     'p03',
    label:    '453K · 347K · 222K views',
    category: 'Video Content',
    maxW:     1000,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (2).jpeg',
    slug:     'p04',
    label:    '288K · 329K · 78K views',
    category: 'Video Content',
    maxW:     1000,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30.jpeg',
    slug:     'p05',
    label:    '70,7K + 206K vizualizări',
    category: 'Video Content',
    maxW:     1000,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (7).jpeg',
    slug:     'p06',
    label:    '193K vizualizări',
    category: 'Video Content',
    maxW:     900,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (4).jpeg',
    slug:     'p07',
    label:    '202K vizualizări',
    category: 'Video Content',
    maxW:     900,
  },
  // ── Analytics & results ────────────────────────────────────────────────
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.30 (5).jpeg',
    slug:     'p08',
    label:    'Facebook +256% • 2,3 mil vizualizări',
    category: 'Results',
    maxW:     700,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.29 (1).jpeg',
    slug:     'p09',
    label:    'Instagram +49% • 304K vizualizări',
    category: 'Results',
    maxW:     700,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 15.59.29.jpeg',
    slug:     'p10',
    label:    'TikTok 1,6M views • 125K likes',
    category: 'Results',
    maxW:     700,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 16.03.26.jpeg',
    slug:     'p11',
    label:    'Ads: 4.255 interacțiuni • lei 0,05/interacție',
    category: 'Results',
    maxW:     1400,
  },
  {
    src:      'WhatsApp Image 2026-03-23 at 16.03.30.jpeg',
    slug:     'p12',
    label:    'Molini Pizza • 7.488 urmăritori Facebook',
    category: 'Results',
    maxW:     700,
  },
]

console.log('🔧 Optimizing portfolio images...\n')

let totalBefore = 0
let totalAfter  = 0

for (const file of FILES) {
  const srcPath = join(RAW, file.src)
  const dstPath = join(OUT, `${file.slug}.webp`)

  const img  = sharp(srcPath)
  const meta = await img.metadata()

  totalBefore += meta.size ?? 0

  // Resize: only downscale, never upscale (withoutEnlargement)
  const outInfo = await img
    .resize({ width: file.maxW, withoutEnlargement: true })
    .webp({
      quality:    88,   // High quality — text and numbers must stay sharp
      smartSubsample: true,
      effort:     6,    // 0-6; higher = smaller file, slower
    })
    .toFile(dstPath)

  totalAfter += outInfo.size

  const pct = (((meta.size - outInfo.size) / meta.size) * 100).toFixed(0)
  console.log(
    `  ✓ ${file.slug}.webp  ${(meta.size/1024).toFixed(0)}KB → ${(outInfo.size/1024).toFixed(0)}KB  (-${pct}%)  [${file.category}]`
  )
}

console.log(
  `\n📦 Total: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB  ` +
  `(-${((1 - totalAfter/totalBefore)*100).toFixed(0)}% overall)`
)

// Write manifest so the React component can import metadata statically
import { writeFile } from 'fs/promises'
const manifest = FILES.map(({ slug, label, category }) => ({ slug, label, category }))
await writeFile(
  resolve(__dir, '../src/data/portfolio-manifest.json'),
  JSON.stringify(manifest, null, 2)
)
console.log('\n📄 Manifest written to src/data/portfolio-manifest.json')
