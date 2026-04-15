/* ═══════════════════════════════════════════════════
   INIT: Lenis · GSAP · Cursor · Loader · SplitType
   ═══════════════════════════════════════════════════ */

// ── 0. GPU DETECTION ────────────────────────────────
// Reads the WebGL renderer string and flags integrated/software GPUs
// (Intel HD/UHD, SwiftShader, llvmpipe, low-end mobile chips). On those
// machines we skip the smooth-wheel layer entirely (lerping at <60fps
// looks like scroll lag) AND tell the Three.js scenes to drop their
// post-processing pipelines. The detection runs synchronously on a
// throwaway canvas so the result is ready before Lenis is constructed.
function detectLowPowerGpu() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return { low: true, renderer: 'no-webgl' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '') : '';
    const r = renderer.toLowerCase();
    let low = false;
    // Software renderers — always slow
    if (r.includes('swiftshader') || r.includes('llvmpipe') || r.includes('software') || r.includes('basic render')) low = true;
    // Intel integrated graphics — HD Graphics, UHD Graphics, Iris (non-Pro)
    if (r.includes('intel') && (r.includes('hd graphics') || r.includes('uhd graphics') || (r.includes('iris') && !r.includes('iris pro')))) low = true;
    // Older mobile GPUs that sometimes appear on cheap Chromebooks
    if (r.includes('mali-')) low = true;
    if (/adreno \(?\d{2,3}\)?$/.test(r)) low = true; // Adreno 3xx/4xx etc.
    // No debug info available + only 1 logical CPU = also treat as low
    if (!renderer && (navigator.hardwareConcurrency || 4) <= 2) low = true;
    return { low, renderer: renderer || '(unknown)' };
  } catch (e) {
    return { low: false, renderer: '(error)' };
  }
}
const _gpu = detectLowPowerGpu();
window._lowPowerGpu = _gpu.low;
// Expose at ?debug=1 so we can verify on a slow machine
if (location.search.includes('debug=1')) {
  console.log('[gpu]', _gpu.renderer, '→ lowPower:', _gpu.low);
}


// ── 1. LENIS SMOOTH SCROLL ──────────────────────────
// Tuned for a tight, responsive feel:
//  - duration 1.6 -> 1.05 so the wheel reacts almost immediately
//  - lerp added so fast wheel ticks settle without overshoot
//  - touch falls through to native scroll on phones (no smooth lag)
//  - on detected low-power GPUs we DISABLE smoothWheel entirely so the
//    page falls back to the browser's native scroll, which is silky on
//    integrated graphics where lerping at <60fps looks like jank.
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = new Lenis({
  duration: 1.05,
  lerp: 0.12,
  smoothWheel: !prefersReduced && !window._lowPowerGpu,
  smoothTouch: false,
  syncTouch: false,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  wheelMultiplier: 1.0,
  touchMultiplier: 1.4,
  easing: (t) => 1 - Math.pow(1 - t, 3),
});
window._lenis = lenis;

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Boot the ScrollTrigger-driven scroll-scrub once GSAP is configured
if (typeof window._scrollScrubInit === 'function') window._scrollScrubInit();


// ── 2. LOADING SCREEN ───────────────────────────────
// Smooth rAF-driven counter 0 → 100 over a fixed duration with
// ease-out cubic. No fake random steps, no 'sprint from 17 to 100'
// jump — every frame pushes the bar forward by a smooth delta.
(function () {
  const loader   = document.getElementById('loader');
  const fill     = document.getElementById('loader-bar-fill');
  const pctEl    = document.getElementById('loader-percent');

  const DURATION = 3200;   // total time for 0 → 100
  const startTime = performance.now();
  let finished = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function tickFrame(now) {
    if (finished) return;
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / DURATION);
    const v = easeOutCubic(t) * 100;
    fill.style.width = v + '%';
    pctEl.textContent = Math.floor(v) + '%';
    if (t < 1) {
      requestAnimationFrame(tickFrame);
    } else {
      pctEl.textContent = '100%';
      fill.style.width = '100%';
      // Brief hold at 100 so the user registers the end state, then exit
      setTimeout(complete, 260);
    }
  }
  requestAnimationFrame(tickFrame);

  function complete() {
    if (finished) return;
    finished = true;
    // Dramatic mask-expand reveal (same feel as before)
    gsap.to(loader, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 1.0, delay: 0.1,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        revealPage();
      }
    });
  }

  // Hard fallback — fire reveal after 6s no matter what
  setTimeout(complete, 6000);

  function revealPage() {
    window._loaderDone = true;
    const titleBlock = document.getElementById('hero-title-block');
    const h1  = document.querySelector('.hero-title-block h1');
    const sub = document.querySelector('.hero-title-block .sub');

    // Ensure title block is visible for GSAP to animate
    if (titleBlock) titleBlock.style.opacity = '1';

    if (h1 && window.SplitType) {
      const split = new SplitType(h1, { types: 'chars' });
      gsap.from(split.chars, {
        y: 50, opacity: 0, rotateX: -40,
        duration: 0.75, stagger: 0.03,
        ease: 'power3.out', delay: 0.08,
        transformPerspective: 500,
        onComplete: () => {
          // Revert split so Three.js opacity control works cleanly
          split.revert();
        }
      });
    }
    if (sub) {
      // Trigger the CSS keyframe reveal (opacity + y). Using CSS here
      // instead of gsap.from because the CSS animation's 'forwards' fill
      // mode can't be interrupted by rapid scroll that toggles the hero's
      // visibility — the old GSAP tween used to get stuck at opacity:0
      // if visibility:hidden kicked in mid-tween.
      sub.classList.add('sub-reveal');
    }
  }
})();


// ── 3. GSAP SCROLLTRIGGER ANIMATIONS ────────────────
(function () {
  ScrollTrigger.refresh();

  // ── Contact labels fade in (lightweight, no scale/blur on the stage)
  ['contact-clipLabel', 'contact-waLabel'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: '#contact', start: 'top 70%', once: true },
        opacity: 0, y: 20, duration: 0.8,
        delay: 0.3 + i * 0.18, ease: 'power3.out',
      });
    }
  });
})();


// ── 4. RENDERER PAUSING (off-screen Three.js scenes) ─────
window._heroVisible = true;
window._contactVisible = true;
(function () {
  // Observe scroll-container (not .hero) because .hero is position:fixed
  // inside a will-change parent — iOS Safari IO doesn't reliably track it.
  const heroContainer = document.getElementById('hero-scroll-container');
  if (heroContainer) {
    new IntersectionObserver(([e]) => { window._heroVisible = e.isIntersecting; }, { threshold: 0 })
      .observe(heroContainer);
  }
  const contactStageEl = document.getElementById('contact-stage');
  if (contactStageEl) {
    new IntersectionObserver(([e]) => { window._contactVisible = e.isIntersecting; }, { threshold: 0 })
      .observe(contactStageEl);
  }
})();