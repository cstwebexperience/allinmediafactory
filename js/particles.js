(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50;will-change:transform;transform:translateZ(0);';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { desynchronized: true });
  let W, H;

  // On mobile / touch / narrow viewport we cut the particle count
  // aggressively so the rAF loop doesn't steal frames from the
  // Three.js hero sphere + scroll-scrub canvas. 110 was too heavy
  // on iPhone when combined with the deform loop + bloom.
  const IS_TOUCH_OR_NARROW = window.matchMedia(
    '(max-width: 900px), (hover: none) and (pointer: coarse)'
  ).matches;
  const PARTICLE_COUNT = IS_TOUCH_OR_NARROW ? 22 : (window._lowPowerGpu ? 50 : 110);
  const MOUSE_RADIUS   = 130;
  const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
  const MOUSE_FORCE    = 0.20;

  // Flag consumed by Particle.update() to apply a sphere-exclusion
  // zone on mobile while the hero section is on screen. Updated by
  // syncMobileVisibility() below. Always false on desktop.
  let _inHeroMobile = false;
  let _sphereCX = 0, _sphereCY = 0, _sphereR = 0, _sphereR2 = 0;

  const mouse = { x: -999, y: -999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    _sphereCX = W * 0.5;
    _sphereCY = H * 0.46;
    _sphereR  = Math.min(W, H) * 0.38;
    _sphereR2 = _sphereR * _sphereR;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle(init) { this.reset(init); }

  Particle.prototype.reset = function (init) {
    this.x    = Math.random() * W;
    this.y    = init ? Math.random() * H : (Math.random() > 0.5 ? -6 : H + 6);
    this.size = Math.random() * 2.5 + 0.8;
    this.base = Math.random() * 0.18 + 0.08;
    this.vx   = (Math.random() - 0.5) * 0.28;
    this.vy   = (Math.random() - 0.5) * 0.18 - 0.04;
    this.ph   = Math.random() * Math.PI * 2;
    this.ps   = Math.random() * 0.006 + 0.002;
    this.px   = 0;
    this.py   = 0;
  };

  Particle.prototype.update = function () {
    this.ph += this.ps;
    this.x  += this.vx + Math.sin(this.ph) * 0.14;
    this.y  += this.vy + Math.cos(this.ph * 0.7) * 0.09;

    const dx   = this.x - mouse.x;
    const dy   = this.y - mouse.y;
    const d2   = dx * dx + dy * dy;
    if (d2 < MOUSE_RADIUS_SQ && d2 > 1) {
      const dist = Math.sqrt(d2);
      const f = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
      this.px += (dx / dist) * f;
      this.py += (dy / dist) * f;
    }

    this.px *= 0.91;
    this.py *= 0.91;
    this.x  += this.px;
    this.y  += this.py;

    // Sphere exclusion — only on mobile hero state. Any particle
    // that ends up inside the sphere's screen-space radius is
    // snapped to the edge and has its inward velocity flipped
    // outward, so they physically cannot overlap the sphere.
    if (_inHeroMobile) {
      const sdx = this.x - _sphereCX;
      const sdy = this.y - _sphereCY;
      const sd2 = sdx * sdx + sdy * sdy;
      if (sd2 < _sphereR2) {
        const sd = Math.sqrt(sd2);
        if (sd < 1) {
          this.x = _sphereCX + _sphereR;
          this.y = _sphereCY;
        } else {
          const nx = sdx / sd;
          const ny = sdy / sd;
          this.x = _sphereCX + nx * _sphereR;
          this.y = _sphereCY + ny * _sphereR;
          if (this.vx * nx + this.vy * ny < 0) {
            this.vx = nx * 0.22;
            this.vy = ny * 0.22;
          }
        }
      }
    }

    if (this.x < -8)  this.x = W + 8;
    if (this.x > W+8) this.x = -8;
    if (this.y < -8 || this.y > H + 8) this.reset(false);
  };

  Particle.prototype.draw = function () {
    const op = this.base * (0.65 + Math.sin(this.ph * 2.1) * 0.35);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
    ctx.fill();
  };

  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle(true));

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  })();

  // ── Mobile-only visibility gating ─────────────────────
  // On phones the particles live in THREE states:
  //   hero     → visible, BUT with a sphere-exclusion zone so
  //              particles can never overlap the metal sphere
  //   hidden   → opacity 0 through the entire scroll-scrub video
  //              section so the footage stays clean
  //   revealed → visible, no exclusion, on the broken-mask +
  //              contact sections (#servicii.revealed is true)
  // Desktop code path is unchanged — always visible, 110 dots.
  if (IS_TOUCH_OR_NARROW) {
    canvas.style.transition = 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    canvas.style.opacity = '1';
    const serviciiEl = document.getElementById('servicii');
    let lastVisible = true;
    function syncMobileVisibility() {
      const sy = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight;
      const revealed = !!(serviciiEl && serviciiEl.classList.contains('revealed'));
      const onHero = sy < vh * 0.9;
      // Active sphere exclusion flag — read by Particle.update()
      _inHeroMobile = onHero;
      // Visible on hero OR when fragments+contact are revealed
      const visible = onHero || revealed;
      if (visible !== lastVisible) {
        canvas.style.opacity = visible ? '1' : '0';
        lastVisible = visible;
      }
    }
    window.addEventListener('scroll', syncMobileVisibility, { passive: true });
    // Poll at 220ms — the scroll-scrub onUpdate that toggles
    // .revealed can fire slightly off-phase with native scroll
    // events on mobile, so a low-rate poll keeps the canvas in sync.
    setInterval(syncMobileVisibility, 220);
    syncMobileVisibility();
  }
})();