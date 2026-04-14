(function () {
  // Note: we target #hero-scroll-container (not .hero) because
  // .hero is position:fixed and its getBoundingClientRect() never
  // changes regardless of scroll — so dist stays 0 and the blur
  // never engaged on the hero → stage transition. The container
  // is a normal-flow 110vh block with will-change:filter, which
  // (a) tracks real scroll position and (b) creates a containing
  // block for the fixed .hero child so filter cascades visually.
  const targets = [
    document.getElementById('hero-scroll-container'),
    document.getElementById('stage'),
    document.getElementById('servicii'),
    document.getElementById('contact-stage'),
  ].filter(Boolean);

  const MAX_BLUR  = 10;
  const MAX_SCALE = 0.03;
  const DEAD      = 0.42;
  const FADE      = 0.42;

  function easeIn(t) { return t * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function update() {
    const winH     = window.innerHeight;
    const vpCenter = winH * 0.5;

    targets.forEach((el) => {
      // Skip elements that are hidden by other JS (e.g. scroll-scrub
      // hides #stage after crossfade — blur engine must not override).
      if (el.style.visibility === 'hidden') return;

      const rect     = el.getBoundingClientRect();
      const elCenter = rect.top + Math.min(rect.height, winH) / 2;
      const dist     = Math.abs(elCenter - vpCenter);
      const progress = clamp((dist - winH * DEAD) / (winH * FADE), 0, 1);

      const above   = elCenter < vpCenter;
      const blurAmt = above ? MAX_BLUR : MAX_BLUR * 1.8;
      const blur    = easeIn(progress) * blurAmt;
      const scale   = above
        ? 1 - easeIn(progress) * MAX_SCALE
        : 1 + easeIn(progress) * MAX_SCALE;
      const op = 1 - easeIn(progress) * 0.35;

      el.style.filter    = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : '';
      el.style.transform = Math.abs(scale - 1) > 0.001 ? `scale(${scale.toFixed(4)})` : '';
      el.style.opacity   = op < 0.999 ? op.toFixed(3) : '';
    });
  }

  // rAF-throttle the scroll handler so touch-scroll on iOS stays
  // smooth even when the scroll event fires dozens of times per
  // frame. On low-power GPUs we throttle to every 2nd frame to
  // keep the main thread free for the Three.js render loops.
  let rafPending = false;
  let blurFrameSkip = 0;
  const BLUR_SKIP = window._lowPowerGpu ? 2 : 1;
  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      if (++blurFrameSkip % BLUR_SKIP === 0) update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();