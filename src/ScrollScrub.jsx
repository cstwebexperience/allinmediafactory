/**
 * ScrollScrub.jsx
 * Implementare identică cu versiunea HTML funcțională.
 *
 * HTML original:
 *   html,body { height:600vh }
 *   #stage { position:sticky; top:0; width:100vw; height:100vh; overflow:hidden }
 *   canvas  { width:100%; height:100%; display:block }
 *   c.width = img.naturalWidth; c.height = img.naturalHeight;
 *   ctx.drawImage(img, 0, 0)
 *   progress = window.scrollY / (body.scrollHeight - innerHeight)
 *
 * Adaptare React: progress calculat relativ la secțiune (nu întreaga pagină),
 * restul identic.
 * IMPORTANT: niciun ancestor nu trebuie să aibă overflow:hidden — strică sticky.
 */

import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 461
const SECTION_HEIGHT = '600vh'

const frameURL = (i) => `/scrub/f${String(i).padStart(4, '0')}.webp`

export default function ScrollScrub() {
  const sectionRef       = useRef(null)
  const canvasRef        = useRef(null)
  const imgs             = useRef(new Array(TOTAL_FRAMES).fill(null))
  const cur              = useRef(-1)
  const spinnerDone      = useRef(false)
  const [showSpinner, setShowSpinner] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    /* ── Draw — identic cu HTML ────────────────────────────────────────── */
    function draw(i) {
      if (i === cur.current) return
      const img = imgs.current[i]
      if (!img || !img.complete || !img.naturalWidth) return
      cur.current = i
      // Canvas buffer = dimensiunile naturale ale frame-ului (exact ca HTML)
      if (canvas.width !== img.naturalWidth) {
        canvas.width  = img.naturalWidth
        canvas.height = img.naturalHeight
      }
      ctx.drawImage(img, 0, 0)          // simplu, fără calcule de cover
      // Ascunde spinner-ul o singură dată
      if (!spinnerDone.current) {
        spinnerDone.current = true
        setShowSpinner(false)
      }
    }

    /* ── Preload frames ────────────────────────────────────────────────── */
    function loadRange(from, to, onFirstLoaded) {
      let firstCalled = false
      for (let i = from; i < Math.min(to, TOTAL_FRAMES); i++) {
        if (imgs.current[i]) continue
        const img = new Image()
        img.onload = () => {
          if (!firstCalled && onFirstLoaded) { firstCalled = true; onFirstLoaded() }
          // Redraw cadrul curent dacă acesta tocmai s-a încărcat
          const target = cur.current === -1 ? 0 : cur.current
          if (i === target) draw(target)
        }
        img.src = frameURL(i)
        imgs.current[i] = img
      }
    }

    /* ── Scroll handler — progress relativ la secțiune ────────────────── */
    function onScroll() {
      const section = sectionRef.current
      if (!section) return
      const rect        = section.getBoundingClientRect()
      const totalScroll = section.offsetHeight - window.innerHeight
      const scrolled    = Math.max(0, -rect.top)
      const progress    = Math.min(1, scrolled / totalScroll)
      const frameIdx    = Math.round(progress * (TOTAL_FRAMES - 1))
      draw(frameIdx)
    }

    /* ── Faza 1: primele 30 de frame-uri imediat ───────────────────────── */
    loadRange(0, 30, () => draw(0))

    /* ── Faza 2: 30-200 când secțiunea intră în viewport ──────────────── */
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { loadRange(30, 200); observer.disconnect() }
    }, { rootMargin: '200px' })
    if (sectionRef.current) observer.observe(sectionRef.current)

    /* ── Faza 3: 200-461 în timp liber ────────────────────────────────── */
    const idleCb = 'requestIdleCallback' in window
      ? requestIdleCallback(() => loadRange(200, TOTAL_FRAMES))
      : setTimeout(() => loadRange(200, TOTAL_FRAMES), 2000)

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
      if ('cancelIdleCallback' in window) cancelIdleCallback(idleCb)
      else clearTimeout(idleCb)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: SECTION_HEIGHT,
        background: '#000',
      }}
    >
      {/*
        sticky div — funcționează DOAR dacă niciun ancestor nu are overflow:hidden.
        App.jsx nu mai are overflowX:hidden, overflow-x:hidden e pe html/body în index.css.
      */}
      <div style={{
        position: 'sticky',
        top:      0,
        width:    '100vw',
        height:   '100vh',
        overflow: 'hidden',
        background: '#000',
      }}>
        {/* Canvas — exact ca HTML: CSS scalează, buffer = dimensiuni naturale */}
        <canvas
          ref={canvasRef}
          style={{
            width:   '100%',
            height:  '100%',
            display: 'block',
          }}
        />

        {/* Spinner — dispare după primul frame desenat */}
        {showSpinner && (
          <div style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            pointerEvents:  'none',
          }}>
            <div style={{
              width:           '36px',
              height:          '36px',
              border:          '2px solid rgba(123,47,255,0.2)',
              borderTopColor:  '#7B2FFF',
              borderRadius:    '50%',
              animation:       'scrub-spin 0.8s linear infinite',
            }} />
          </div>
        )}
      </div>

      <style>{`@keyframes scrub-spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
