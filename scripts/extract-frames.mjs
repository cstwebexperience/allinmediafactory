/**
 * extract-frames.mjs
 * Extrage frame-urile base64 din HTML-ul scroll-scrub
 * și le salvează ca fișiere WebP separate în public/scrub/
 */
import { readFile, writeFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const SRC   = resolve('C:/Users/cst/OneDrive/Desktop/scroll-scrub masca.html')
const OUT   = resolve(__dir, '../public/scrub')

await mkdir(OUT, { recursive: true })

console.log('📖 Reading HTML file...')
const html = await readFile(SRC, 'utf8')

// Extract the frames array content
const match = html.match(/const frames=\[([\s\S]*?)\];/)
if (!match) { console.error('Could not find frames array'); process.exit(1) }

// Split on the pattern between frames
const raw = match[1]
const frameStrings = raw
  .split(/"data:image\/webp;base64,/)
  .slice(1)                          // remove first empty
  .map(s => s.split('"')[0])         // get base64 data up to closing quote

console.log(`🎞  Found ${frameStrings.length} frames`)

let totalBytes = 0
for (let i = 0; i < frameStrings.length; i++) {
  const buf  = Buffer.from(frameStrings[i], 'base64')
  const path = resolve(OUT, `f${String(i).padStart(4,'0')}.webp`)
  await writeFile(path, buf)
  totalBytes += buf.length
  if (i % 50 === 0) process.stdout.write(`  ${i}/${frameStrings.length}\r`)
}

console.log(`\n✅ Saved ${frameStrings.length} frames → public/scrub/`)
console.log(`📦 Total: ${(totalBytes/1024/1024).toFixed(1)} MB`)

// Write a manifest with frame count
await writeFile(
  resolve(__dir, '../src/data/scrub-manifest.json'),
  JSON.stringify({ frameCount: frameStrings.length })
)
console.log('📄 Manifest written')
