/**
 * VideoSection.jsx — Expanding video container (50vw → 100vw)
 *
 * ScrollTrigger timeline (pinned, scrub: 1.5):
 *  • Container width:        50vw  → 100vw
 *  • Container borderRadius: 16px  → 0px     (goes truly edge-to-edge)
 *  • Overlay opacity:        0.6   → 0        (darkening lifts to reveal video)
 *  • Inner label:            opacity 1 → 0    (fades as video fills screen)
 *
 * The scrub value of 1.5 (vs 1 in Hero) makes this feel heavier and more
 * cinematic — like a camera iris opening slowly.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap }    from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoSection() {
  const sectionRef   = useRef(null)
  const containerRef = useRef(null)
  const labelRef     = useRef(null)
  const overlayRef   = useRef(null)

  useGSAP(() => {
    // ─── Expand timeline ──────────────────────────────────────────────────
    // pin:    keep the section fixed while scrolling 100vh worth of content
    // scrub:  1.5s lag makes the iris feel heavy and deliberate
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top top',
        end:     '+=100%',
        scrub:   1.5,
        pin:     true,
        anticipatePin: 1,    // Pre-computes pin position to avoid jump
      },
    })

    // Container grows from centered 50vw box to full-bleed
    tl.fromTo(
      containerRef.current,
      { width: '50vw', borderRadius: '14px' },
      { width: '100vw', borderRadius: '0px', ease: 'none' },
      0
    )

    // Overlay darkening dissolves (video becomes "brighter")
    tl.fromTo(
      overlayRef.current,
      { opacity: 0.55 },
      { opacity: 0, ease: 'none' },
      0
    )

    // Label fades out as the video takes over the screen
    tl.to(labelRef.current, { opacity: 0, y: -10, ease: 'none' }, 0)

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-[#06060E] overflow-hidden"
    >
      {/* Expanding video wrapper */}
      <div
        ref={containerRef}
        className="relative overflow-hidden gpu"
        style={{
          width:        '50vw',
          aspectRatio:  '16 / 9',
          borderRadius: '14px',
        }}
      >
        {/* ── Placeholder — swap this div for <video> when ready ── */}
        <div
          className="w-full h-full flex flex-col items-center justify-center relative"
          style={{
            background: `
              radial-gradient(ellipse at 40% 50%, rgba(123,47,255,0.22) 0%, transparent 65%),
              radial-gradient(ellipse at 70% 40%, rgba(26,26,255,0.18) 0%, transparent 60%),
              #090916
            `,
          }}
        >
          {/* Corner brackets — cinematic frame decoration */}
          {['top-4 left-4 border-t border-l',
            'top-4 right-4 border-t border-r',
            'bottom-4 left-4 border-b border-l',
            'bottom-4 right-4 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 border-white/20 ${cls}`} />
          ))}

          {/* Play button */}
          <button
            className="w-20 h-20 rounded-full border border-white/25 flex items-center justify-center
                       hover:bg-white/8 hover:border-white/50 transition-all duration-500 group z-10"
            aria-label="Play showreel"
          >
            <svg
              className="w-7 h-7 text-white translate-x-0.5 group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* Label */}
          <p
            ref={labelRef}
            className="font-mono text-white/35 text-[10px] tracking-[0.4em] uppercase mt-5 z-10"
          >
            Showreel 2024
          </p>
        </div>

        {/* Dark overlay that lifts as video expands */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#06060E] pointer-events-none"
          style={{ opacity: 0.55 }}
        />
      </div>

      {/* Section label — top left */}
      <div className="absolute top-8 left-8 font-mono text-white/25 text-[9px] tracking-[0.4em] uppercase">
        — Showreel
      </div>
    </section>
  )
}
