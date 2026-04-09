/**
 * Footer.jsx — "Curtain reveal" footer
 *
 * Structure (z-axis stacking trick):
 *
 *  <section height: 200vh>
 *    ├── Footer content (position: sticky, top: 0, z-index: 0)
 *    │     Sticks to the top of the viewport — stays visible.
 *    │     Revealed progressively as the curtain lifts.
 *    │
 *    └── Curtain (position: absolute, top: 0, height: 100vh, z-index: 10)
 *          Starts covering the footer. As the user scrolls through
 *          the section, GSAP translates it to y: -100vh so it slides
 *          upward and off-screen — revealing the footer beneath it.
 *
 * This avoids any fixed-position hacks and works perfectly with Lenis.
 *
 * GSAP timeline (scrub: 1.5):
 *  • Curtain: y 0 → '-100vh'
 *  • Footer content elements: staggered fade-in as curtain lifts
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap }    from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = ['Instagram', 'LinkedIn', 'YouTube', 'TikTok']

export default function Footer() {
  const sectionRef = useRef(null)
  const curtainRef = useRef(null)
  const contentRef = useRef(null)

  useGSAP(() => {
    // ── Curtain slides up ─────────────────────────────────────────────────
    // Start: curtain sits on top of the footer, hiding it
    // End:   curtain has moved fully off-screen upward
    gsap.fromTo(
      curtainRef.current,
      { y: 0 },
      {
        y:    '-100vh',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     '+=100vh',       // Curtain finishes lifting after 100vh of scroll
          scrub:   1.5,
        },
      }
    )

    // ── Footer content reveals with staggered fade ────────────────────────
    gsap.fromTo(
      contentRef.current.querySelectorAll('.reveal-item'),
      { opacity: 0, y: 30 },
      {
        opacity:  1,
        y:        0,
        duration: 0.8,
        stagger:  0.1,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top+=60vh top',   // Starts when curtain is ~60% lifted
          end:     'top+=85vh top',
          scrub:   1,
        },
      }
    )

  }, { scope: sectionRef })

  return (
    /* Total height = 200vh so the user has room to scroll the curtain away */
    <section
      ref={sectionRef}
      id="contact"
      style={{ position: 'relative', height: '200vh' }}
    >
      {/* ── Footer content ─────────────────────────────────────────────────
          sticky top-0 → stays at the top of the viewport as the user
          scrolls through the 200vh section                               */}
      <div
        ref={contentRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-8"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 85%, rgba(123,47,255,0.2) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(26,26,255,0.1) 0%, transparent 60%),
            #06060E
          `,
          zIndex: 0,
        }}
      >
        {/* Eyebrow */}
        <p className="reveal-item font-mono text-[#7B2FFF] text-[9px] tracking-[0.5em] uppercase mb-8">
          — Hai să creăm ceva extraordinar
        </p>

        {/* Big CTA headline */}
        <h2
          className="reveal-item font-display font-black italic uppercase text-white leading-[0.85] mb-16"
          style={{ fontSize: 'clamp(4rem, 13vw, 14rem)' }}
        >
          Let&apos;s
          <br />
          {/* Outlined "Work" — brand visual language */}
          <span
            style={{
              WebkitTextStroke: '2px rgba(123,47,255,0.8)',
              color:            'transparent',
            }}
          >
            Work
          </span>
        </h2>

        {/* Contact info row */}
        <div className="reveal-item flex flex-col md:flex-row items-center gap-6 md:gap-16 mb-16">
          <div>
            <p className="font-mono text-white/25 text-[9px] tracking-widest uppercase mb-2">Email</p>
            <a
              href="mailto:contact@allinmediafactory.com"
              className="font-body text-white/70 hover:text-white transition-colors duration-300 text-sm"
            >
              contact@allinmediafactory.com
            </a>
          </div>

          <div className="hidden md:block w-px h-8 bg-white/10" />

          <div>
            <p className="font-mono text-white/25 text-[9px] tracking-widest uppercase mb-2">Telefon</p>
            <a
              href="tel:+40000000000"
              className="font-body text-white/70 hover:text-white transition-colors duration-300 text-sm"
            >
              +40 000 000 000
            </a>
          </div>

          <div className="hidden md:block w-px h-8 bg-white/10" />

          <div>
            <p className="font-mono text-white/25 text-[9px] tracking-widest uppercase mb-2">Social</p>
            <div className="flex gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-mono text-white/35 hover:text-white transition-colors duration-300 text-[10px] tracking-wider"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="reveal-item w-full max-w-4xl h-px mb-8"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(123,47,255,0.4), rgba(26,26,255,0.3), transparent)',
          }}
        />

        {/* Copyright */}
        <p className="reveal-item font-mono text-white/15 text-[9px] tracking-widest">
          © 2024 All In Media Factory · Bucharest, Romania
        </p>
      </div>

      {/* ── Curtain ──────────────────────────────────────────────────────────
          Sits above the footer (z-index: 10), slides upward on scroll,
          revealing the footer beneath it.                                  */}
      <div
        ref={curtainRef}
        className="absolute top-0 left-0 right-0 gpu"
        style={{
          height:  '100vh',
          zIndex:  10,
          background: `
            radial-gradient(ellipse 50% 60% at 50% 30%, rgba(123,47,255,0.08) 0%, transparent 60%),
            #06060E
          `,
          pointerEvents: 'none',
        }}
      >
        {/* Decorative text visible in the curtain before it lifts */}
        <div className="h-full flex items-center justify-center">
          <p
            className="font-display font-black italic uppercase select-none"
            style={{
              fontSize:         'clamp(6rem, 22vw, 28rem)',
              lineHeight:       0.82,
              color:            'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.04)',
              letterSpacing:    '-0.02em',
            }}
          >
            CONTACT
          </p>
        </div>
      </div>
    </section>
  )
}
