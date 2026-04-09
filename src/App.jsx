import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollScrub from './ScrollScrub'

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ──────────────────────────────────────────────────────────────── */
const VIDEO_ITEMS = [
  { slug: 'p01', label: '1,1 mil',  unit: 'vizualizări', wide: true  },
  { slug: 'p02', label: '1,3 mil',  unit: 'vizualizări', wide: false },
  { slug: 'p05', label: '206K',     unit: 'vizualizări', wide: false },
  { slug: 'p03', label: '453K',     unit: 'views',       wide: false },
  { slug: 'p06', label: '193K',     unit: 'vizualizări', wide: false },
  { slug: 'p07', label: '202K',     unit: 'vizualizări', wide: false },
]
const RESULT_ITEMS = [
  { slug: 'p08', label: '+256%',  unit: 'Facebook',    accent: '#1877F2' },
  { slug: 'p09', label: '+49%',   unit: 'Instagram',   accent: '#E1306C' },
  { slug: 'p10', label: '1,6M',   unit: 'TikTok',      accent: '#fff'    },
  { slug: 'p11', label: '0.05₊', unit: 'lei/interacț', accent: '#7B2FFF' },
  { slug: 'p12', label: '7.488', unit: 'urmăritori',   accent: '#1877F2' },
]
const SERVICES = [
  { num:'01', title:'Video\nProduction', desc:'Filmare 4K, motion design și post-producție pentru branduri care vor să iasă în evidență.', tags:['Filmare 4K','Motion Design','Color Grading'] },
  { num:'02', title:'Strategy',          desc:'Strategie de conținut aliniată cu obiectivele tale de business și adaptată fiecărui canal.',  tags:['Brand Identity','Content Strategy','Social Media'] },
  { num:'03', title:'Creative',          desc:'Direcție creativă pentru campanii care rămân în minte și lasă urmă.',                          tags:['Art Direction','Concepte Creative','Storytelling'] },
]
const NAV_LINKS = ['Services', 'Portfolio', 'Contact']

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const navRef      = useRef(null)
  const pillRef     = useRef(null)
  const linksRef    = useRef([])
  const [hovered, setHovered]   = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Frosted glass appears after 60px scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Move pill indicator to hovered link
  const movePill = (idx) => {
    const el = linksRef.current[idx]
    const nav = navRef.current
    if (!el || !nav || !pillRef.current) return
    const elRect  = el.getBoundingClientRect()
    const navRect = nav.getBoundingClientRect()
    pillRef.current.style.width   = `${elRect.width + 28}px`
    pillRef.current.style.left    = `${elRect.left - navRect.left - 14}px`
    pillRef.current.style.opacity = '1'
  }

  const hidePill = () => {
    if (pillRef.current) pillRef.current.style.opacity = '0'
  }

  return (
    <>
      <style>{`
        /* ── Floating pill navbar ── */
        .navbar-float {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          z-index: 200; width: calc(100% - 48px); max-width: 1100px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 8px 8px 10px;
          border-radius: 100px;
          background: rgba(14, 12, 28, 0.72);
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(123,47,255,0.08);
          transition: box-shadow 0.4s ease, background 0.4s ease;
        }
        .navbar-float:hover {
          box-shadow: 0 12px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(123,47,255,0.18);
        }

        /* Logo circle */
        .logo-circle {
          width: 44px; height: 44px; border-radius: 50%;
          overflow: hidden; flex-shrink: 0;
          border: 1.5px solid rgba(123,47,255,0.45);
          box-shadow: 0 0 14px rgba(123,47,255,0.3);
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.25,1,0.5,1);
          display: block;
        }
        .logo-circle:hover {
          box-shadow: 0 0 24px rgba(123,47,255,0.55);
          border-color: rgba(123,47,255,0.75);
          transform: scale(1.06);
        }
        .logo-circle img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }

        /* Nav links */
        .nav-link {
          position: relative; color: rgba(255,255,255,0.5);
          font-size: 11.5px; letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none; padding: 9px 16px; border-radius: 100px;
          transition: color 0.25s cubic-bezier(0.25,1,0.5,1);
          font-family: monospace; white-space: nowrap; z-index: 1;
        }
        .nav-link:hover { color: rgba(255,255,255,0.95); }

        /* Sliding active pill under links */
        .nav-pill {
          position: absolute; height: 36px; border-radius: 100px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          top: 50%; transform: translateY(-50%);
          transition:
            left   0.35s cubic-bezier(0.25,1,0.5,1),
            width  0.35s cubic-bezier(0.25,1,0.5,1),
            opacity 0.2s ease;
          opacity: 0; pointer-events: none;
        }

        /* CTA button */
        .cta-btn {
          background: linear-gradient(135deg, #7B2FFF 0%, #5010D0 100%);
          border: none; border-radius: 100px; color: #fff;
          font-size: 11px; font-family: monospace;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 11px 24px; cursor: pointer; white-space: nowrap;
          box-shadow: 0 0 22px rgba(123,47,255,0.4);
          transition: transform 0.22s cubic-bezier(0.25,1,0.5,1),
                      box-shadow 0.22s ease;
          text-decoration: none; display: inline-block;
        }
        .cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 36px rgba(123,47,255,0.62);
        }
        .cta-btn:active { transform: scale(0.97); }

        /* Divider */
        .nav-divider {
          width: 1px; height: 22px;
          background: rgba(255,255,255,0.1);
          margin: 0 10px;
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar-float, .logo-circle, .nav-link, .nav-pill, .cta-btn { transition: none !important; }
        }
      `}</style>

      <nav ref={navRef} className="navbar-float">

        {/* Logo — circular */}
        <a href="#" aria-label="All In Media Factory" className="logo-circle">
          <img src="/logo.png" alt="All In Media Factory" />
        </a>

        {/* Links + pill + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>

          {/* Links container — pill is relative to this */}
          <div
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseLeave={hidePill}
          >
            <span ref={pillRef} className="nav-pill" />

            {NAV_LINKS.map((label, i) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="nav-link"
                ref={el => linksRef.current[i] = el}
                onMouseEnter={() => { setHovered(i); movePill(i) }}
                onFocus={() => { setHovered(i); movePill(i) }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA button */}
          <span className="nav-divider" />
          <a href="#contact" className="cta-btn">Contactează-ne</a>
        </div>
      </nav>
    </>
  )
}

/* ─── Hero border — iPhone squircle frame ───────────────────────────────── */
function HeroFrame({ children, frameRef }) {
  return (
    <>
      <style>{`
        @keyframes borderPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1;   }
        }
        .hero-frame-outer {
          position: relative;
          margin: 12px;
          border-radius: 50px;
          /* Gradient border via padding + background trick */
          background: linear-gradient(
            145deg,
            rgba(180,130,255,0.55) 0%,
            rgba(90,60,200,0.35)   30%,
            rgba(20,20,120,0.25)   60%,
            rgba(123,47,255,0.4)   100%
          );
          padding: 1.5px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 0 60px rgba(123,47,255,0.18),
            0 0 120px rgba(80,30,200,0.10),
            inset 0 0 0 1px rgba(255,255,255,0.02);
          animation: borderPulse 5s ease-in-out infinite;
        }
        .hero-frame-inner {
          border-radius: 48.5px;
          overflow: hidden;
          background: #06060E;
          height: calc(100vh - 24px);
          position: relative;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        /* Subtle corner glints — like iPhone aluminum frame catching light */
        .hero-frame-outer::before,
        .hero-frame-outer::after {
          content: '';
          position: absolute; border-radius: 50px;
          pointer-events: none; z-index: 2;
        }
        .hero-frame-outer::before {
          inset: 0;
          background: linear-gradient(
            130deg,
            rgba(255,255,255,0.12) 0%,
            transparent 25%,
            transparent 75%,
            rgba(255,255,255,0.06) 100%
          );
          border-radius: 50px;
        }
      `}</style>
      <div className="hero-frame-outer">
        <div ref={frameRef} className="hero-frame-inner">
          {children}
        </div>
      </div>
    </>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const heroRef      = useRef(null)
  const heroFrameRef = useRef(null)
  const titleRef     = useRef(null)

  useEffect(() => {
    try {
      if (titleRef.current && heroRef.current) {
        gsap.to(titleRef.current, {
          opacity: 0, y: -60, scale: 1.1, ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top', end: 'bottom top',
            scrub: 1, pin: true, pinSpacing: true,
          },
        })
      }
    } catch (e) { console.error('GSAP:', e) }
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const S = {
    bg:     '#06060E',
    purple: '#7B2FFF',
    lbl:    { color:'rgba(255,255,255,0.25)', fontSize:'9px', letterSpacing:'0.4em', textTransform:'uppercase', fontFamily:'monospace' },
  }

  return (
    <div style={{ background: S.bg, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      <Navbar />

      {/* ── HERO with iPhone frame ─────────────────────────────────────── */}
      <section ref={heroRef} style={{ height: '100vh', background: S.bg }}>
        <HeroFrame frameRef={heroFrameRef}>
          {/* Glow background inside frame */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            background: `
              radial-gradient(ellipse 65% 65% at 32% 52%, rgba(123,47,255,0.35) 0%, transparent 68%),
              radial-gradient(ellipse 55% 60% at 68% 48%, rgba(26,26,255,0.25)  0%, transparent 65%)
            ` }} />

          {/* Title */}
          <div ref={titleRef} style={{ textAlign:'center', position:'relative', zIndex:1, padding:'0 24px' }}>
            <p style={{ color:S.purple, fontSize:'10px', letterSpacing:'0.55em', textTransform:'uppercase', marginBottom:'28px', fontFamily:'monospace' }}>
              Creative Media Production
            </p>
            <h1 style={{ fontSize:'clamp(3.5rem,17vw,19rem)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', lineHeight:0.84, margin:0, letterSpacing:'-0.01em' }}>
              ALL IN<br />MEDIA
            </h1>
            <p style={{ color:'rgba(255,255,255,0.28)', fontSize:'11px', letterSpacing:'0.4em', textTransform:'uppercase', marginTop:'28px', fontFamily:'monospace' }}>
              FACTORY
            </p>
          </div>

          {/* Scroll hint */}
          <div style={{ position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
            <p style={{ ...S.lbl, marginBottom:'8px' }}>Scroll</p>
            <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)', margin:'0 auto' }} />
          </div>
        </HeroFrame>
      </section>

      {/* ── SCROLL SCRUB ──────────────────────────────────────────────── */}
      <ScrollScrub />

      {/* ── SERVICES ──────────────────────────────────────────────────── */}
      <section id="services" style={{ padding:'120px 40px', background:S.bg }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ ...S.lbl, marginBottom:'60px' }}>— Services</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'60px' }}>
            {SERVICES.map((s,i) => (
              <div key={i}>
                <p style={{ ...S.lbl, marginBottom:'20px' }}>{s.num}</p>
                <h2 style={{ fontSize:'clamp(2.5rem,5vw,5.5rem)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', lineHeight:0.88, whiteSpace:'pre-line', marginBottom:'20px' }}>{s.title}</h2>
                <div style={{ height:'1px', background:'linear-gradient(90deg, rgba(123,47,255,0.6), transparent)', marginBottom:'20px' }} />
                <p style={{ color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:'20px', fontSize:'15px' }}>{s.desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {s.tags.map((t,j) => (
                    <span key={j} style={{ border:'1px solid rgba(255,255,255,0.1)', padding:'6px 12px', fontSize:'9px', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ─────────────────────────────────────────────────── */}
      <section id="portfolio" style={{ padding:'120px 40px', background:S.bg }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <p style={{ color:S.purple, fontSize:'9px', letterSpacing:'0.5em', textTransform:'uppercase', fontFamily:'monospace', marginBottom:'12px' }}>— Rezultate reale</p>
          <h2 style={{ fontSize:'clamp(3rem,8vw,8rem)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', lineHeight:0.88, marginBottom:'40px' }}>Our Work</h2>
          <div style={{ height:'1px', background:'linear-gradient(90deg, rgba(123,47,255,0.5), transparent)', marginBottom:'48px' }} />

          <p style={{ ...S.lbl, marginBottom:'16px' }}>01 · Video Content</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'60px' }}>
            {VIDEO_ITEMS.map((item,i) => (
              <div key={item.slug} style={{ gridColumn:item.wide?'span 2':'span 1', position:'relative', overflow:'hidden', borderRadius:'8px', aspectRatio:item.wide?'21/9':'4/3', background:'#0B0B18' }}>
                <img src={`/portfolio/${item.slug}.webp`} alt={item.label} loading={i<2?'eager':'lazy'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top, rgba(6,6,14,0.92) 0%, transparent 70%)', padding:'16px' }}>
                  <span style={{ fontWeight:900, fontStyle:'italic', fontSize:'26px', textTransform:'uppercase' }}>{item.label}</span>
                  <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'9px', letterSpacing:'0.3em', textTransform:'uppercase', fontFamily:'monospace', marginLeft:'8px' }}>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...S.lbl, marginBottom:'16px' }}>02 · Analytics & Results</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px' }}>
            {RESULT_ITEMS.map((item) => (
              <div key={item.slug} style={{ position:'relative', overflow:'hidden', borderRadius:'8px', aspectRatio:'9/16', background:'#0B0B18' }}>
                <img src={`/portfolio/${item.slug}.webp`} alt={item.label} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top, rgba(6,6,14,0.95) 0%, transparent 60%)', padding:'12px' }}>
                  <div style={{ fontWeight:900, fontStyle:'italic', fontSize:'22px', textTransform:'uppercase', color:item.accent }}>{item.label}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'8px', letterSpacing:'0.3em', textTransform:'uppercase', fontFamily:'monospace' }}>{item.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <section id="contact" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 40px', background:'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(123,47,255,0.18) 0%, transparent 65%), #06060E' }}>
        <p style={{ color:S.purple, fontSize:'9px', letterSpacing:'0.5em', textTransform:'uppercase', fontFamily:'monospace', marginBottom:'32px' }}>— Hai să creăm ceva extraordinar</p>
        <h2 style={{ fontSize:'clamp(3rem,12vw,12rem)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', lineHeight:0.85, marginBottom:'60px' }}>
          Let's<br /><span style={{ WebkitTextStroke:'2px rgba(123,47,255,0.8)', color:'transparent' }}>Work</span>
        </h2>
        <div style={{ display:'flex', gap:'60px', flexWrap:'wrap', justifyContent:'center', marginBottom:'60px' }}>
          {[
            { label:'Email', val:'contact@allinmediafactory.com', href:'mailto:contact@allinmediafactory.com' },
            { label:'Telefon', val:'+40 000 000 000', href:'tel:+40000000000' },
          ].map(({ label, val, href }) => (
            <div key={label}>
              <p style={{ ...S.lbl, marginBottom:'8px' }}>{label}</p>
              <a href={href} style={{ color:'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:'14px' }}>{val}</a>
            </div>
          ))}
        </div>
        <div style={{ height:'1px', width:'100%', maxWidth:'600px', background:'linear-gradient(90deg, transparent, rgba(123,47,255,0.4), transparent)', marginBottom:'32px' }} />
        <p style={{ color:'rgba(255,255,255,0.15)', fontSize:'9px', letterSpacing:'0.3em', fontFamily:'monospace' }}>© 2024 All In Media Factory · Bucharest, Romania</p>
      </section>

    </div>
  )
}
