/**
 * ServicesSection.jsx — Horizontal scroll panel
 *
 * How horizontal scroll scrub works:
 *  1. The section is pinned (stays fixed on screen).
 *  2. The inner track is wider than the viewport (3 cards × card width + gaps).
 *  3. GSAP translates the track on the X axis from 0 → -(totalWidth - viewportWidth).
 *  4. The scroll distance on Y that drives this is calculated dynamically
 *     via `end: () => ...` so it recalculates on window resize.
 *  5. `invalidateOnRefresh: true` ensures positions are recomputed correctly.
 *
 * Result: user scrolls vertically → content moves horizontally.
 * This is the exact pattern used on award-winning agency sites.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap }    from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    number:      '01',
    title:       ['Video', 'Production'],
    description: 'De la concept la livrare finală. Filmări 4K, regie, post-producție și motion design pentru branduri care vor să iasă din anonimat.',
    tags:        ['Filmare 4K', 'Motion Design', 'Color Grading', 'Post-producție'],
  },
  {
    number:      '02',
    title:       ['Strategy'],
    description: 'Narativele care mișcă audiențe. Construim strategii de conținut aliniate cu obiectivele tale de business și adaptate la fiecare canal.',
    tags:        ['Brand Identity', 'Content Strategy', 'Social Media', 'Positioning'],
  },
  {
    number:      '03',
    title:       ['Creative'],
    description: 'Idei care ies din tipar și rămân în minte. Direcție creativă pentru campanii care contează și care lasă urmă.',
    tags:        ['Concepte Creative', 'Art Direction', 'Storytelling', 'Campanii'],
  },
]

export default function ServicesSection() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)

  useGSAP(() => {
    const track        = trackRef.current
    const section      = sectionRef.current

    // `end` is a function so ScrollTrigger recalculates on window resize
    const getDistance = () => track.scrollWidth - window.innerWidth

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:            section,
        start:              'top top',
        // Scroll distance needed = horizontal distance to cover + extra padding
        end:                () => `+=${getDistance() + window.innerWidth * 0.3}`,
        scrub:              1,
        pin:                true,
        anticipatePin:      1,
        invalidateOnRefresh: true,   // Recalculate on resize
      },
    })

    // Translate the entire track to the left
    tl.to(track, {
      x:    () => -getDistance(),
      ease: 'none',
    })

    // Stagger: each card fades in from opacity 0.25 as it enters the viewport
    // We use a simple fromTo on each card keyed to its position in the track
    track.querySelectorAll('.service-card').forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: i === 0 ? 1 : 0.2 },
        {
          opacity: 1,
          ease:    'none',
          scrollTrigger: {
            trigger:            card,
            containerAnimation: tl.scrollTrigger,  // Ties to the horizontal track ST
            start:              'left 80%',
            end:                'left 40%',
            scrub:              true,
          },
        }
      )
    })

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative h-screen flex items-center overflow-hidden bg-[#06060E]"
    >
      {/* Section label */}
      <span className="absolute top-8 left-8 font-mono text-white/25 text-[9px] tracking-[0.4em] uppercase z-10">
        — Services
      </span>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex items-center gpu"
        style={{
          paddingLeft:  '12vw',
          paddingRight: '12vw',
          gap:          '8vw',
        }}
      >
        {SERVICES.map((svc, i) => (
          <article
            key={i}
            className="service-card flex-shrink-0"
            style={{ width: '65vw', maxWidth: '680px' }}
          >
            {/* Number */}
            <p className="font-mono text-white/18 text-sm tracking-widest mb-10">
              {svc.number}
            </p>

            {/* Title — each line is a separate element for visual flexibility */}
            <h2
              className="font-display font-black italic uppercase text-white leading-[0.88] mb-10"
              style={{ fontSize: 'clamp(4.5rem, 10vw, 10rem)' }}
            >
              {svc.title.map((line, j) => (
                <span key={j} className="block">{line}</span>
              ))}
            </h2>

            {/* Gradient rule — violet to transparent, brand colour */}
            <div
              className="w-full h-px mb-8"
              style={{
                background: 'linear-gradient(90deg, rgba(123,47,255,0.65), rgba(26,26,255,0.3), transparent)',
              }}
            />

            {/* Description */}
            <p className="font-body text-white/55 text-base leading-relaxed max-w-md mb-10">
              {svc.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2.5">
              {svc.tags.map((tag, j) => (
                <span
                  key={j}
                  className="font-mono text-[9px] tracking-widest uppercase
                             px-3 py-1.5 border border-white/10 text-white/35
                             hover:border-[#7B2FFF]/50 hover:text-white/70
                             transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {SERVICES.map((_, i) => (
          <div key={i} className="w-8 h-px bg-white/15" />
        ))}
      </div>
    </section>
  )
}
