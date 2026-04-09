import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef    = useRef(null)
  const titleRef      = useRef(null)
  const subtitleRef   = useRef(null)
  const glowRef       = useRef(null)
  const scrollHintRef = useRef(null)

  useGSAP(() => {
    // Scroll scrub: title scales + fades as user scrolls down
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    })

    tl.to(titleRef.current,      { scale: 1.12, opacity: 0, y: -40, ease: 'none' }, 0)
    tl.to(subtitleRef.current,   { opacity: 0, y: -50, ease: 'none' }, 0)
    tl.to(scrollHintRef.current, { opacity: 0, ease: 'none' }, 0)
    tl.to(glowRef.current,       { scale: 1.5, opacity: 0, ease: 'none' }, 0)

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background glow — purple/blue gradient from logo */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 65% 65% at 32% 52%, rgba(123,47,255,0.38) 0%, transparent 68%),
            radial-gradient(ellipse 55% 60% at 68% 48%, rgba(26,26,255,0.28) 0%, transparent 65%)
          `,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Title — always visible, GSAP animates it OUT on scroll */}
      <div ref={titleRef} className="relative z-10 text-center px-4" style={{ willChange: 'transform, opacity' }}>
        <p className="font-mono text-[#7B2FFF] text-[10px] tracking-[0.5em] uppercase mb-6">
          Creative Media Production
        </p>

        <h1
          className="font-display font-black italic uppercase text-white leading-[0.82] select-none"
          style={{ fontSize: 'clamp(4.5rem, 18vw, 22rem)' }}
        >
          ALL&nbsp;IN
          <br />
          <span className="relative inline-block">
            MEDIA
            {/* Glow echo */}
            <span
              aria-hidden
              className="absolute inset-0 font-display font-black italic uppercase"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(123,47,255,0.6)',
                filter: 'blur(10px)',
              }}
            >
              MEDIA
            </span>
          </span>
        </h1>

        <p className="font-mono text-white/30 text-[11px] tracking-[0.35em] uppercase mt-8">
          FACTORY
        </p>
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="absolute bottom-28 font-body text-white/35 text-sm tracking-wider z-10"
      >
        Strategy · Storytelling · Vision
      </p>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-white/25 text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
      </div>
    </section>
  )
}
