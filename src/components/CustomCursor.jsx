/**
 * CustomCursor.jsx
 *
 * Two-layer cursor:
 *  • Dot  — tracks mouse with near-zero lag (GSAP quickTo, duration 0.08s)
 *  • Ring — follows with a smooth spring-like delay  (duration 0.45s)
 *
 * On `[data-cursor-expand]` elements (portfolio cards):
 *  • Ring scales up 3.5× and shows "VIEW" label
 *  • Dot disappears
 *
 * mix-blend-mode: difference  → cursor inverts colours beneath it,
 * so it stays visible on both dark and bright surfaces.
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef    = useRef(null)
  const ringRef   = useRef(null)
  const labelRef  = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current

    // quickTo creates a cached, optimised setter — much faster than gsap.to()
    // called on every mousemove
    const dotX  = gsap.quickTo(dot,  'x', { duration: 0.08 })
    const dotY  = gsap.quickTo(dot,  'y', { duration: 0.08 })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

    const onMove = ({ clientX: x, clientY: y }) => {
      dotX(x); dotY(y)
      ringX(x); ringY(y)
    }

    // ─── Expand on portfolio hover ──────────────────────────────────────────
    const expand = () => {
      gsap.to(ring,         { scale: 3.5, duration: 0.35, ease: 'power2.out' })
      gsap.to(dot,          { scale: 0,   duration: 0.2  })
      gsap.to(labelRef.current, { opacity: 1, duration: 0.2, delay: 0.1 })
    }
    const collapse = () => {
      gsap.to(ring,         { scale: 1,   duration: 0.35, ease: 'power2.out' })
      gsap.to(dot,          { scale: 1,   duration: 0.2  })
      gsap.to(labelRef.current, { opacity: 0, duration: 0.15 })
    }

    // Use capture-phase delegation so we don't need per-card listeners
    const onEnter = (e) => { if (e.target.closest('[data-cursor-expand]')) expand() }
    const onLeave = (e) => { if (e.target.closest('[data-cursor-expand]')) collapse() }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter, true)
    document.addEventListener('mouseleave', onLeave, true)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter, true)
      document.removeEventListener('mouseleave', onLeave, true)
    }
  }, [])

  return (
    <>
      {/* Small dot — exact mouse position */}
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full
                   pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2
                   mix-blend-difference"
        style={{ willChange: 'transform' }}
      />

      {/* Ring — delayed follower */}
      <div
        ref={ringRef}
        className="custom-follower fixed top-0 left-0 w-9 h-9 border border-white/70 rounded-full
                   pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2
                   mix-blend-difference flex items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        {/* "VIEW" label — only visible on portfolio hover */}
        <span
          ref={labelRef}
          className="font-mono text-white text-[7px] tracking-widest uppercase opacity-0 select-none"
          style={{ mixBlendMode: 'normal' }}
        >
          VIEW
        </span>
      </div>
    </>
  )
}
