import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap }    from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_ITEMS = [
  { slug: 'p01', label: '1,1 mil',  unit: 'vizualizări', wide: true  },
  { slug: 'p02', label: '1,3 mil',  unit: 'vizualizări', wide: false },
  { slug: 'p05', label: '206K',     unit: 'vizualizări', wide: false },
  { slug: 'p03', label: '453K',     unit: 'views grid',  wide: false },
  { slug: 'p04', label: '329K',     unit: 'views grid',  wide: false },
  { slug: 'p06', label: '193K',     unit: 'vizualizări', wide: false },
  { slug: 'p07', label: '202K',     unit: 'vizualizări', wide: false },
]

const RESULT_ITEMS = [
  { slug: 'p08', label: '+256%',  unit: 'Facebook Views',  accent: '#1877F2' },
  { slug: 'p09', label: '+49%',   unit: 'Instagram Views', accent: '#E1306C' },
  { slug: 'p10', label: '1,6M',   unit: 'TikTok Views',   accent: '#ffffff'  },
  { slug: 'p11', label: '0,05₊', unit: 'lei/interacțiune', accent: '#7B2FFF' },
  { slug: 'p12', label: '7.488', unit: 'urmăritori',       accent: '#1877F2' },
]

function PortfolioCard({ slug, label, unit, wide, accent, isStats, index }) {
  return (
    <div
      className={`portfolio-card overflow-hidden${wide ? ' col-span-2' : ''}`}
      data-cursor-expand
    >
      <div className="card-inner relative overflow-hidden group gpu rounded-sm">
        <div
          className="w-full relative bg-[#0B0B18]"
          style={{ aspectRatio: isStats ? '9 / 16' : wide ? '21 / 9' : '4 / 3' }}
        >
          <img
            src={`/portfolio/${slug}.webp`}
            alt={`${label} ${unit}`}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            className={`w-full h-full ${isStats ? 'object-contain' : 'object-cover'}`}
            style={{ display: 'block' }}
          />

          {/* Hover gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(6,6,14,0.92) 0%, rgba(6,6,14,0.3) 45%, transparent 75%)',
            }}
          />

          {/* Number badge on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <div className="flex items-end gap-2">
              <span
                className="font-display font-black italic text-4xl leading-none"
                style={{ color: accent ?? '#ffffff' }}
              >
                {label}
              </span>
              <span className="font-mono text-white/50 text-[9px] tracking-widest uppercase mb-1.5">
                {unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioSection() {
  const sectionRef    = useRef(null)
  const videoGridRef  = useRef(null)
  const resultGridRef = useRef(null)

  useGSAP(() => {
    ;[videoGridRef, resultGridRef].forEach((gridRef) => {
      if (!gridRef.current) return

      gridRef.current.querySelectorAll('.portfolio-card').forEach((card, i) => {
        const inner = card.querySelector('.card-inner')

        // Zoom-in reveal
        gsap.fromTo(inner,
          { scale: 1.08, filter: 'brightness(0.55)' },
          {
            scale: 1, filter: 'brightness(1)', ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 50%', scrub: 1 },
          }
        )

        // Parallax
        const yDir = i % 2 === 0 ? 40 : -40
        gsap.fromTo(card, { y: yDir }, {
          y: -yDir, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })

    // Title entry
    gsap.from(sectionRef.current.querySelectorAll('.section-reveal'), {
      y: 50, opacity: 0, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'top 45%', scrub: 1 },
    })

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative py-28 px-6 md:px-10 bg-[#06060E]"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <p className="section-reveal font-mono text-[#7B2FFF] text-[9px] tracking-[0.5em] uppercase mb-4">
          — Rezultate reale
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2
            className="section-reveal font-display font-black italic uppercase text-white leading-[0.88]"
            style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
          >
            Our Work
          </h2>
          <p className="section-reveal font-mono text-white/25 text-[9px] tracking-wider uppercase pb-1 leading-relaxed text-right">
            Cifre verificabile.<br />
            <span className="text-white/15">Fiecare proiect, fiecare rezultat.</span>
          </p>
        </div>
        <div
          className="w-full h-px mt-8"
          style={{ background: 'linear-gradient(90deg, rgba(123,47,255,0.55), rgba(26,26,255,0.3), transparent)' }}
        />
      </div>

      {/* Video Content */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="font-mono text-white/20 text-[9px] tracking-[0.4em] uppercase mb-5">
          01 · Video Content
        </p>
      </div>

      <div
        ref={videoGridRef}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-20"
      >
        {VIDEO_ITEMS.map((item, i) => (
          <PortfolioCard key={item.slug} {...item} isStats={false} index={i} />
        ))}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="font-mono text-white/20 text-[9px] tracking-[0.4em] uppercase mb-5">
          02 · Analytics &amp; Results
        </p>
      </div>

      <div
        ref={resultGridRef}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {RESULT_ITEMS.map((item, i) => (
          <PortfolioCard
            key={item.slug} {...item}
            isStats={true} wide={false}
            index={i + VIDEO_ITEMS.length}
          />
        ))}
      </div>
    </section>
  )
}
