// ── Scroll-Scrub Frame Animation (ScrollTrigger-driven, Lenis-safe) ──
    // Uses GSAP ScrollTrigger so it stays in lockstep with Lenis smooth scroll.
    // Frames are lazy-loaded: first 30 immediately, rest in background.
    window._scrollScrubInit = function () {
      const TOTAL_FRAMES = 576;
      // Load fewer frames eagerly on mobile to reduce initial bandwidth
      const _scrubMobile = window.matchMedia('(max-width: 900px)').matches;
      const EAGER_FRAMES = _scrubMobile ? 12 : 30;
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      const stage = document.getElementById('stage');
      const images = new Array(TOTAL_FRAMES);
      const loaded = new Uint8Array(TOTAL_FRAMES);
      let currentFrame = -1;
      let canvasSized = false;

      function pad(i) { return String(i).padStart(4, '0'); }

      function sizeCanvas(img) {
        if (canvasSized) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvasSized = true;
      }

      function drawFrame(index) {
        index = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
        if (index === currentFrame) return;
        const img = images[index];
        if (!img || !loaded[index]) return;
        if (!canvasSized) sizeCanvas(img);
        ctx.drawImage(img, 0, 0);
        currentFrame = index;
      }

      function loadFrame(idx, eager) {
        if (images[idx]) return images[idx];
        const img = new Image();
        img.decoding = 'async';
        img.onload = function () {
          loaded[idx] = 1;
          if (idx === 0) {
            sizeCanvas(this);
            ctx.drawImage(this, 0, 0);
            currentFrame = 0;
            if (window._loaderAssetDone) window._loaderAssetDone();
          }
        };
        img.src = 'frames/frame_' + pad(idx + 1) + '.webp';
        images[idx] = img;
        return img;
      }

      // Eager-load the first batch
      for (let i = 0; i < EAGER_FRAMES && i < TOTAL_FRAMES; i++) loadFrame(i, true);

      // Background-load the rest in chunks via requestIdleCallback (or rAF fallback)
      const idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
      let bgIdx = EAGER_FRAMES;
      const BATCH_SIZE = _scrubMobile ? 4 : 8;
      function loadNextBatch() {
        const batchEnd = Math.min(bgIdx + BATCH_SIZE, TOTAL_FRAMES);
        for (let i = bgIdx; i < batchEnd; i++) loadFrame(i, false);
        bgIdx = batchEnd;
        if (bgIdx < TOTAL_FRAMES) idle(loadNextBatch);
      }
      idle(loadNextBatch);

      // ScrollTrigger for frame scrubbing — staged crossfade so the
      // PNG mask never overlaps the video mask:
      //
      //   0%  → 70%  : video frames scrub (mask splits)
      //   70% → 76%  : fragments-canvas fades in OVER the last frame
      //                (visually identical, so no jump)
      //   76% → 80%  : stage canvas fades out (video mask disappears,
      //                only PNG fragments remain)
      //   80%+       : .revealed → annotation draw-on animation +
      //                pointer-events on (clicks enabled)
      if (window.gsap && window.ScrollTrigger) {
        // On mobile/portrait the stage canvas renders the mask full
        // screen while .fragments-canvas renders it inside a smaller
        // centred 16:9 box — so the desktop overlap crossfade shows
        // a "big mask + small mask" intercalation at 70-76%. Switch
        // to a clean SEQUENTIAL crossfade on mobile: stage fades out
        // completely first, then fragments fade in from black.
        const IS_NARROW = window.matchMedia(
          '(max-width: 900px), (orientation: portrait)'
        ).matches;

        const SCRUB_END          = 0.70;
        const FRAGMENTS_FADE_IN  = IS_NARROW ? 0.77 : 0.70;
        const FRAGMENTS_FADE_OUT = IS_NARROW ? 0.83 : 0.76;
        const STAGE_FADE_START   = IS_NARROW ? 0.70 : 0.76;
        const STAGE_FADE_END     = IS_NARROW ? 0.76 : 0.80;
        const REVEAL_AT          = IS_NARROW ? 0.83 : 0.80;

        const servicii = document.getElementById('servicii');
        const fragsCanvas = document.getElementById('fragments-canvas');

        ScrollTrigger.create({
          trigger: '#scroll-scrub-container',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const p = self.progress;

            // 1) Video frames
            const scrubP = Math.min(1, p / SCRUB_END);
            drawFrame(Math.round(scrubP * (TOTAL_FRAMES - 1)));

            // 2) Fragments canvas fades in 70 → 76
            //    + servicii gets a solid BG so the scroll-scrub canvas
            //      behind can never ghost through the fragment PNGs.
            if (p >= FRAGMENTS_FADE_IN) {
              const fp = Math.min(1, (p - FRAGMENTS_FADE_IN) / (FRAGMENTS_FADE_OUT - FRAGMENTS_FADE_IN));
              fragsCanvas.style.opacity = fp;
              servicii.style.background = '#050507';
            } else {
              fragsCanvas.style.opacity = 0;
              servicii.style.background = 'transparent';
            }

            // 3) Stage canvas fades out 76 → 80
            //    Once fully faded: paint canvas solid black + hide
            //    the entire stage element. iOS Safari ignores opacity:0
            //    + visibility:hidden on composited sticky layers, so we
            //    must physically erase the canvas content to kill the
            //    ghost mask. Stage display stays 'block' (not 'none')
            //    because its height props up the scroll container.
            if (p >= STAGE_FADE_START) {
              const sp = Math.min(1, (p - STAGE_FADE_START) / (STAGE_FADE_END - STAGE_FADE_START));
              stage.style.opacity = 1 - sp;
              if (sp >= 1) {
                stage.style.visibility = 'hidden';
                // Nuclear: paint the canvas solid black so even if
                // Safari composites it, the user sees nothing.
                ctx.fillStyle = '#050507';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                currentFrame = -1; // force redraw when scrolling back
              } else {
                stage.style.visibility = 'visible';
              }
            } else {
              stage.style.opacity = 1;
              stage.style.visibility = 'visible';
              // Redraw current frame in case canvas was painted black
              // (user scrolled back up from the revealed state)
              if (currentFrame < 0) {
                const rIdx = Math.round(Math.min(1, p / SCRUB_END) * (TOTAL_FRAMES - 1));
                drawFrame(rIdx);
              }
            }

            // 4) Full reveal at 80%+ → annotation draw-on + clicks
            if (p >= REVEAL_AT) {
              servicii.classList.add('revealed');
            } else {
              servicii.classList.remove('revealed');
            }
          },
          onLeaveBack: () => {
            fragsCanvas.style.opacity = 0;
            stage.style.opacity = 1;
            stage.style.visibility = 'visible';
            servicii.classList.remove('revealed');
            servicii.style.background = 'transparent';
            drawFrame(0);
          },
        });

      }
    };


    // ── Mask Fragments → Full-screen Overlay ─────────────
    // Each fragment is a full-screen <div> backed by its own transparent
    // PNG, so we can't rely on per-element :hover or click events — they
    // all overlap. Instead we keep an offscreen canvas of every PNG and
    // hit-test the alpha channel under the cursor to figure out which
    // fragment was actually pointed at.
    (function () {
      const overlay  = document.getElementById('service-overlay');
      const ghost    = document.getElementById('overlay-ghost');
      const closeBtn = document.getElementById('overlay-close');
      const canvas   = document.getElementById('fragments-canvas');
      const servicii = document.getElementById('servicii');

      // data-frag value -> fragment DOM id + pane id + ann id
      const FRAG_BY_NAME = {
        'ochi-stang':   { id: 'frag-left-eye',    pane: 'pane-left-eye',    ann: 'ann-left-eye' },
        'ochi-drept':   { id: 'frag-right-eye',   pane: 'pane-right-eye',   ann: 'ann-right-eye' },
        'nas':          { id: 'frag-nose',        pane: 'pane-nose',        ann: 'ann-nose' },
        'gura-stanga':  { id: 'frag-left-mouth',  pane: 'pane-left-mouth',  ann: 'ann-left-mouth' },
        'gura-dreapta': { id: 'frag-right-mouth', pane: 'pane-right-mouth', ann: 'ann-right-mouth' },
      };

      // ── Pre-load every PNG into an offscreen canvas for alpha hit testing
      const offscreens = {};
      Object.keys(FRAG_BY_NAME).forEach(name => {
        const img = new Image();
        img.onload = function () {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const tctx = c.getContext('2d');
          tctx.drawImage(img, 0, 0);
          // Cache alpha channel as Uint8Array — avoids expensive
          // getImageData() calls on every mouse move during hit-test.
          const idata = tctx.getImageData(0, 0, c.width, c.height).data;
          const alpha = new Uint8Array(c.width * c.height);
          for (let i = 0; i < alpha.length; i++) alpha[i] = idata[i * 4 + 3];
          offscreens[name] = { alpha, w: img.naturalWidth, h: img.naturalHeight };
          if (window._loaderAssetDone) window._loaderAssetDone();
        };
        img.src = 'frag-' + name + '.png';
      });

      // ── Float animation params ─────────────────────────
      // Each fragment drifts on its own sin/cos curve. Different phases,
      // amplitudes and speeds so the 5 pieces never feel synced. Kept
      // small (<= 8px) on desktop so it reads as breathing, not sliding.
      // On mobile we multiply the amplitudes by 0.35 — the mask is
      // visually smaller on a phone so the same pixel drift made
      // adjacent fragments overlap each other visibly.
      const IS_MOBILE_FLOAT = window.matchMedia(
        '(max-width: 900px), (orientation: portrait)'
      ).matches;
      const FLOAT_SCALE = IS_MOBILE_FLOAT ? 0.35 : 1.0;
      const FLOAT_PARAMS = {
        'ochi-stang':   { ax: 6 * FLOAT_SCALE, ay: 5 * FLOAT_SCALE, phx: 0.0,  phy: 1.2, sx: 0.45, sy: 0.38 },
        'ochi-drept':   { ax: 5 * FLOAT_SCALE, ay: 6 * FLOAT_SCALE, phx: 0.8,  phy: 0.4, sx: 0.42, sy: 0.50 },
        'nas':          { ax: 4 * FLOAT_SCALE, ay: 4 * FLOAT_SCALE, phx: 2.0,  phy: 2.5, sx: 0.55, sy: 0.48 },
        'gura-stanga':  { ax: 5 * FLOAT_SCALE, ay: 6 * FLOAT_SCALE, phx: 1.5,  phy: 0.7, sx: 0.38, sy: 0.52 },
        'gura-dreapta': { ax: 6 * FLOAT_SCALE, ay: 5 * FLOAT_SCALE, phx: 0.4,  phy: 2.2, sx: 0.48, sy: 0.40 },
      };
      // Live per-fragment pixel offsets — read by hitTest() so clicks
      // land on the visible drifted pixels, not the original PNG coords.
      const fragmentOffsets = {
        'ochi-stang':   { x: 0, y: 0 },
        'ochi-drept':   { x: 0, y: 0 },
        'nas':          { x: 0, y: 0 },
        'gura-stanga':  { x: 0, y: 0 },
        'gura-dreapta': { x: 0, y: 0 },
      };
      // Cache DOM refs so we don't hit getElementById every frame
      const fragmentEls = {};
      Object.entries(FRAG_BY_NAME).forEach(([name, cfg]) => {
        fragmentEls[name] = document.getElementById(cfg.id);
      });
      // The float animation must NOT start until the scroll-scrub
      // crossfade is fully done (at which point #servicii has the
      // .revealed class). Otherwise the last video frames show the
      // mask static and centred while the PNG overlay drifts — the
      // two layers interleave visibly. We ramp the blend from 0 to
      // 1 over ~700ms once revealed to avoid snapping into motion.
      const serviciiEl = document.getElementById('servicii');
      let floatBlendStart = -1;
      let floatBlend = 0;
      function floatTick(tMs) {
        const revealed = serviciiEl && serviciiEl.classList.contains('revealed');
        if (revealed && floatBlendStart < 0) floatBlendStart = tMs;
        if (!revealed) { floatBlendStart = -1; floatBlend = 0; }
        else floatBlend = Math.min(1, (tMs - floatBlendStart) / 700);

        const t = tMs * 0.001;
        for (const name in FLOAT_PARAMS) {
          const p = FLOAT_PARAMS[name];
          const fx = Math.sin(t * p.sx + p.phx) * p.ax * floatBlend;
          const fy = Math.cos(t * p.sy + p.phy) * p.ay * floatBlend;
          fragmentOffsets[name].x = fx;
          fragmentOffsets[name].y = fy;
          const el = fragmentEls[name];
          if (el) {
            el.style.setProperty('--fx', fx.toFixed(2) + 'px');
            el.style.setProperty('--fy', fy.toFixed(2) + 'px');
          }
        }
        requestAnimationFrame(floatTick);
      }
      requestAnimationFrame(floatTick);

      // Returns the data-frag name under the given client coords, or null.
      // Uses contain semantics everywhere. On mobile portrait the CSS
      // sizes .fragments-canvas to a 100vw × 56.25vw box (exactly the
      // image aspect) so cover and contain give the same result —
      // Math.min works uniformly. Subtracts each fragment's float
      // offset so clicks land on visibly drifted pixels.
      // Cache the bounding rect — only updates on scroll/resize, not per mouse move
      let _cachedRect = null;
      let _rectFrame = -1;
      function getCachedRect() {
        const f = performance.now();
        if (!_cachedRect || f - _rectFrame > 200) {
          _cachedRect = canvas.getBoundingClientRect();
          _rectFrame = f;
        }
        return _cachedRect;
      }
      window.addEventListener('scroll', () => { _cachedRect = null; }, { passive: true });
      window.addEventListener('resize', () => { _cachedRect = null; }, { passive: true });

      function hitTest(clientX, clientY) {
        const r = getCachedRect();
        if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
        for (const name in offscreens) {
          const off = offscreens[name];
          if (!off) continue;
          const drift = fragmentOffsets[name] || { x: 0, y: 0 };
          const scale = Math.min(r.width / off.w, r.height / off.h);
          const drawnW = off.w * scale;
          const drawnH = off.h * scale;
          const dx = (r.width - drawnW) / 2;
          const dy = (r.height - drawnH) / 2;
          const localX = clientX - r.left - dx - drift.x;
          const localY = clientY - r.top - dy - drift.y;
          const px = Math.floor(localX / scale);
          const py = Math.floor(localY / scale);
          if (px < 0 || py < 0 || px >= off.w || py >= off.h) continue;
          // Read from cached alpha array — zero GPU/CPU overhead
          if (off.alpha[py * off.w + px] > 50) return name;
        }
        return null;
      }

      // ── State ──
      let currentPane = null;
      let currentFragEl = null;
      let isOpen = false;
      const pendingTimers = new Set();
      function later(fn, ms) {
        const id = setTimeout(() => { pendingTimers.delete(id); fn(); }, ms);
        pendingTimers.add(id);
        return id;
      }
      function cancelPending() {
        pendingTimers.forEach(id => clearTimeout(id));
        pendingTimers.clear();
      }

      function hardReset() {
        cancelPending();
        document.querySelectorAll('.mask-fragment.active, .mask-fragment.hover')
          .forEach(el => el.classList.remove('active', 'hover'));
        document.querySelectorAll('.service-pane.active')
          .forEach(el => el.classList.remove('active'));
        if (canvas) canvas.classList.remove('has-active');
        if (ghost) ghost.className = '';
        currentFragEl = null;
        currentPane = null;
      }

      // Mobile check — used by openService/closeService to apply
      // inline styles that override the CSS cascade entirely, so
      // no matter what the stylesheet says the pane will scroll
      // natively on iOS Safari.
      const _isMobilePane = () => window.matchMedia(
        '(max-width: 900px), (hover: none) and (pointer: coarse)'
      ).matches;

      // Apply mobile-only inline styles to the overlay + active pane
      // the moment it opens. This bypasses the CSS cascade entirely —
      // inline style beats any !important in a stylesheet. We also
      // force every pane-content descendant visible (cancels the
      // content-stagger reveal opacity:0 on mobile) and reset the
      // desktop flex centring that otherwise pushes tall content's
      // top above the viewport.
      function applyMobileScrollStyles(paneEl) {
        if (!_isMobilePane() || !paneEl) return;
        // Overlay = scroll container
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.overflowY = 'auto';
        overlay.style.overflowX = 'hidden';
        overlay.style.webkitOverflowScrolling = 'touch';
        overlay.style.touchAction = 'pan-y';
        overlay.style.overscrollBehavior = 'contain';
        // Active pane = normal block flow
        paneEl.style.display = 'block';
        paneEl.style.position = 'static';
        paneEl.style.inset = 'auto';
        paneEl.style.width = '100%';
        paneEl.style.height = 'auto';
        paneEl.style.minHeight = '100vh';
        paneEl.style.padding = '92px 20px 108px';
        paneEl.style.opacity = '1';
        paneEl.style.pointerEvents = 'auto';
        // pane-content as block, centred horizontally, full width
        const pc = paneEl.querySelector('.pane-content');
        if (pc) {
          pc.style.display = 'block';
          pc.style.position = 'relative';
          pc.style.width = '100%';
          pc.style.maxWidth = '640px';
          pc.style.margin = '0 auto';
          pc.style.padding = '0';
          pc.style.height = 'auto';
          pc.style.minHeight = '0';
          pc.style.maxHeight = 'none';
          pc.style.overflow = 'visible';
          pc.style.textAlign = 'center';
        }
        // Force every content-stagger child visible (no transform,
        // full opacity) so nothing stays hidden on mobile.
        paneEl.querySelectorAll('.content-stagger').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
        // Force results-grid → 1 column, iphone-track → wrap,
        // sites-grid → 1 column on this specific pane
        const rg = paneEl.querySelector('.results-grid');
        if (rg) {
          rg.style.display = 'grid';
          rg.style.gridTemplateColumns = '1fr';
          rg.style.gap = '12px';
        }
        const it = paneEl.querySelector('.iphone-track');
        if (it) {
          it.style.display = 'flex';
          it.style.flexWrap = 'wrap';
          it.style.justifyContent = 'center';
          it.style.gap = '18px';
        }
        const sg = paneEl.querySelector('.sites-grid');
        if (sg) {
          sg.style.display = 'grid';
          sg.style.gridTemplateColumns = '1fr';
          sg.style.gap = '14px';
        }
        // Scroll to top so user starts at the pane label
        overlay.scrollTop = 0;
      }

      function clearMobileScrollStyles(paneEl) {
        overlay.style.cssText = '';
        if (paneEl) paneEl.style.cssText = '';
      }

      function openService(name) {
        const cfg = FRAG_BY_NAME[name];
        if (!cfg) return;

        hardReset();

        currentFragEl = document.getElementById(cfg.id);
        if (currentFragEl) currentFragEl.classList.add('active');
        if (canvas) canvas.classList.add('has-active');

        // Park a giant blurred copy of THIS fragment in its corner so the
        // user always sees which mask piece the open panel belongs to.
        if (ghost) ghost.classList.add('ghost-' + name);

        // Body lock — but on mobile we DON'T stop Lenis because Lenis
        // has touch disabled anyway, and we don't set body overflow
        // because the overlay's own overflow:auto needs touches to
        // reach it directly.
        if (!_isMobilePane()) {
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          window._lenis?.stop();
        } else {
          // On mobile, prevent body from scrolling in the background
          // by fixing its position. Restored in closeService.
          document.body.dataset.serviceOpenScroll = String(window.scrollY || 0);
          document.body.style.position = 'fixed';
          document.body.style.top = '-' + (window.scrollY || 0) + 'px';
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.width = '100%';
        }

        requestAnimationFrame(() => {
          overlay.classList.add('open');
          isOpen = true;
          currentPane = document.getElementById(cfg.pane);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (!currentPane) return;
            currentPane.classList.add('active');
            // Inject mobile inline styles AFTER .active is added so
            // they override any CSS that would otherwise win.
            applyMobileScrollStyles(currentPane);
            const h2 = currentPane.querySelector('.pane-h2');
            if (h2 && window.SplitType) {
              if (h2._st) { h2._st.revert(); delete h2._st; }
              const st = new SplitType(h2, { types: 'chars' });
              h2._st = st;
              // Skip the SplitType animation on mobile — it sometimes
              // leaves chars at opacity:0 if the reveal timing misses,
              // and on mobile we want reliability over polish.
              if (!_isMobilePane()) {
                gsap.from(st.chars, {
                  y: 45, opacity: 0, rotateX: -40,
                  duration: 0.7, stagger: 0.022,
                  ease: 'power3.out', delay: 0.20,
                  transformPerspective: 600,
                });
              } else {
                st.revert();
              }
            }
          }));
        });
      }

      function closeService() {
        if (!isOpen) return;
        cancelPending();
        const closingPane = currentPane;
        if (closingPane) {
          closingPane.classList.remove('active');
          clearMobileScrollStyles(closingPane);
        }

        // Kill the ghost glow immediately
        if (ghost) {
          ghost.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          ghost.style.opacity = '0';
        }

        const isMobileClose = document.body.dataset.serviceOpenScroll !== undefined;

        if (isMobileClose) {
          const savedY = parseInt(document.body.dataset.serviceOpenScroll, 10) || 0;
          const heroEl = document.getElementById('hero');

          // 1. Force hero invisible BEFORE anything else — prevents
          //    the 1-frame flash where iOS shows scroll position 0
          if (heroEl) heroEl.style.opacity = '0';

          // 2. Kill overlay instantly
          overlay.style.transition = 'none';
          overlay.classList.remove('open');
          overlay.style.opacity = '0';

          // 3. Unfix body + restore scroll
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          delete document.body.dataset.serviceOpenScroll;
          window.scrollTo(0, savedY);

          // 4. Cleanup — hero opacity will be restored by tick() via scrollP
          requestAnimationFrame(() => {
            overlay.style.transition = '';
            overlay.style.opacity = '';
            hardReset();
            isOpen = false;
            if (ghost) ghost.style.transition = '';
            if (ghost) ghost.style.opacity = '';
          });
        } else {
          // Desktop path — animated close
          isOpen = false;

          if (currentPane) {
            currentPane.style.transition = 'opacity 0.25s ease, transform 0.3s ease';
            currentPane.style.opacity = '0';
            currentPane.style.transform = 'translateY(14px)';
          }

          later(() => {
            overlay.classList.remove('open');
            overlay.classList.add('closing');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window._lenis?.start();

            later(() => {
              overlay.classList.remove('closing');
              if (currentPane) {
                currentPane.style.cssText = '';
                currentPane.classList.remove('active');
              }
              hardReset();
              if (ghost) ghost.style.transition = '';
              if (ghost) ghost.style.opacity = '';
            }, 520);
          }, 100);
        }
      }

      // ── Annotation highlight ─────────────────────────────
      function litAnnByName(name, on) {
        const cfg = FRAG_BY_NAME[name];
        if (!cfg) return;
        const el = document.getElementById(cfg.ann);
        if (el) el.classList.toggle('lit', on);
      }
      function clearAllAnn() {
        document.querySelectorAll('.ann-group.lit').forEach(el => el.classList.remove('lit'));
      }

      // ── Pointer wiring on the WHOLE servicii section ─────
      // We listen on #servicii (the sticky overlay) so the events fire
      // even after pointer-events:all is enabled by .revealed.
      let lastHover = null;
      let _moveRafPending = false;
      let _lastMoveX = 0, _lastMoveY = 0;
      function _processMove() {
        _moveRafPending = false;
        if (isOpen) return;
        if (!servicii.classList.contains('revealed')) return;
        const name = hitTest(_lastMoveX, _lastMoveY);
        if (name === lastHover) return;
        if (lastHover) {
          const oldId = FRAG_BY_NAME[lastHover].id;
          document.getElementById(oldId).classList.remove('hover');
          litAnnByName(lastHover, false);
        }
        lastHover = name;
        if (name) {
          const newId = FRAG_BY_NAME[name].id;
          document.getElementById(newId).classList.add('hover');
          litAnnByName(name, true);
          servicii.style.cursor = 'pointer';
        } else {
          servicii.style.cursor = 'default';
        }
      }
      function onMove(e) {
        _lastMoveX = e.clientX;
        _lastMoveY = e.clientY;
        if (!_moveRafPending) {
          _moveRafPending = true;
          requestAnimationFrame(_processMove);
        }
      }
      function onClick(e) {
        if (isOpen) return;
        if (!servicii.classList.contains('revealed')) return;
        const name = hitTest(e.clientX, e.clientY);
        if (!name) return;
        clearAllAnn();
        openService(name);
      }
      servicii.addEventListener('mousemove', onMove);
      servicii.addEventListener('click', onClick);
      servicii.addEventListener('mouseleave', () => {
        if (lastHover) {
          document.getElementById(FRAG_BY_NAME[lastHover].id).classList.remove('hover');
          litAnnByName(lastHover, false);
          lastHover = null;
        }
      });

      // Close button + ESC
      closeBtn.addEventListener('click', closeService);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeService();
      });

      // Wheel scroll inside overlay — Lenis is stopped while overlay is open
      // and intercepts wheel events even when stopped (calls preventDefault).
      // This listener runs first (overlay < window in bubble order) and
      // manually scrolls the active pane content.
      overlay.addEventListener('wheel', e => {
        if (!isOpen || !currentPane) return;
        const content = currentPane.querySelector('.pane-content-vp') ||
                        currentPane.querySelector('.pane-content');
        if (!content || content.scrollHeight <= content.clientHeight + 1) return;
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaMode === 1 ? e.deltaY * 40
                    : e.deltaMode === 2 ? e.deltaY * 200
                    : e.deltaY;
        content.scrollTop += delta;
      }, { passive: false });

      // Generic drag-to-scroll wiring (works on any element with the
       // `data-drag-scroll` attribute or matching id list)
      function wireDragScroll(el) {
        if (!el) return;
        let isDown = false, startX = 0, scrollLeft = 0;
        el.addEventListener('mousedown', e => {
          isDown = true;
          el.classList.add('dragging');
          startX = e.pageX - el.offsetLeft;
          scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('dragging'); });
        el.addEventListener('mouseup',    () => { isDown = false; el.classList.remove('dragging'); });
        el.addEventListener('mousemove', e => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - el.offsetLeft;
          el.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
      }
      wireDragScroll(document.getElementById('iphone-carousel'));
      wireDragScroll(document.getElementById('metaScroll'));

      // Auto-demo: MutationObserver because openService lives in this IIFE,
      // not accessible from _scrollScrubInit where 'revealed' is toggled.
      const DEMO_KEY = 'aimf_demo_seen';
      let demoTriggered = false;
      const _demoObserver = new MutationObserver(() => {
        if (!servicii.classList.contains('revealed')) return;
        if (sessionStorage.getItem(DEMO_KEY) || demoTriggered) return;
        demoTriggered = true;
        setTimeout(() => {
          if (isOpen) return;
          openService('ochi-stang');
          sessionStorage.setItem(DEMO_KEY, '1');
          setTimeout(() => { if (isOpen) closeService(); }, 3200);
        }, 1500);
      });
      _demoObserver.observe(servicii, { attributes: true, attributeFilter: ['class'] });
    })();

    // ── Phone zoom + image lightbox (pane 01) ────────────
    (function () {
      // Phone zoom — clicking any iPhone mockup pops a giant version
      // of itself into the centre of the screen + autoplays the video.
      const phoneZoom = document.getElementById('phone-zoom-overlay');
      const zoomClose = document.getElementById('phoneZoomClose');
      // Parent <div class="iphone-screen"> where the iframe lives.
      // We intentionally DO NOT cache the iframe element — we rebuild
      // it from scratch every open, because YT.Player.destroy() mangles
      // the original iframe node and any cached reference becomes dead.
      const zoomScreen = phoneZoom
        ? phoneZoom.querySelector('.iphone-screen')
        : null;

      // Track the YT.Player instance so we can tear it down on close
      let ytPlayer = null;

      // Try to nudge the player to the highest available quality.
      // YouTube no longer reliably honours setPlaybackQuality (it's
      // deprecated), but combined with the vq=hd1080 URL hint and the
      // explicit setPlaybackQualityRange call it works in most cases.
      function pushHighestQuality(player) {
        try {
          const levels = player.getAvailableQualityLevels && player.getAvailableQualityLevels();
          let target = 'hd1080';
          if (levels && levels.length) {
            // Prefer the first level (YouTube returns highest -> lowest)
            target = levels[0];
          }
          if (player.setPlaybackQualityRange) player.setPlaybackQualityRange(target, target);
          if (player.setPlaybackQuality) player.setPlaybackQuality(target);
        } catch (e) { /* API may have changed; safe to ignore */ }
      }

      // Rip out any previous iframe (dead or alive) and build a fresh
      // one each time. This is the only reliable way to reopen after a
      // YT.Player.destroy() — reusing the same node gives a black screen.
      function buildFreshIframe() {
        if (!zoomScreen) return null;
        // Nuke any leftover iframe from the previous open
        const old = zoomScreen.querySelector('iframe');
        if (old) old.remove();
        const iframe = document.createElement('iframe');
        iframe.id = 'zoom-iframe';
        iframe.frameBorder = '0';
        iframe.setAttribute('allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        zoomScreen.appendChild(iframe);
        return iframe;
      }

      const IS_MOBILE_ZOOM = window.matchMedia(
        '(max-width: 900px), (hover: none) and (pointer: coarse)'
      ).matches;

      function openPhoneZoom(src) {
        if (!phoneZoom || !zoomScreen || !src) return;
        // Add the HD hints; skip the JS API on mobile because the
        // YT.Player wrapper tends to leave stale state between
        // opens on iOS, which caused the 2nd-open black screen.
        if (!IS_MOBILE_ZOOM && !/[?&]enablejsapi=/.test(src)) src += '&enablejsapi=1';
        if (!/[?&]vq=/.test(src))  src += '&vq=hd1080';
        if (!/[?&]hd=/.test(src))  src += '&hd=1';
        // Extra autoplay/mute-related hints for iOS Safari
        if (!/[?&]autoplay=/.test(src)) src += '&autoplay=1';
        if (!/[?&]playsinline=/.test(src)) src += '&playsinline=1';

        // Aggressive cleanup of any leftover state before opening
        // a new video. Any previous YT.Player instance is destroyed,
        // any previous iframe is stopped (about:blank) then removed,
        // and a forced reflow makes sure the DOM change has landed
        // before the new iframe goes in.
        if (ytPlayer && ytPlayer.destroy) {
          try { ytPlayer.destroy(); } catch (e) {}
          ytPlayer = null;
        }
        if (zoomScreen) {
          const stale = zoomScreen.querySelector('iframe');
          if (stale) {
            try { stale.src = 'about:blank'; } catch (e) {}
            stale.remove();
          }
          // Force layout flush so the removal is committed before
          // the new iframe is appended (iOS Safari was sometimes
          // reusing the removed element's internal media state).
          void zoomScreen.offsetHeight;
        }

        const iframe = buildFreshIframe();
        if (!iframe) return;
        iframe.src = src;
        phoneZoom.classList.add('open');

        // YT.Player wrapper is DESKTOP-ONLY. On mobile it's pure
        // overhead — iOS Safari ignores setPlaybackQualityRange
        // anyway, and the wrapper + destroy cycle leaves stale
        // internal state that breaks subsequent opens.
        // Lazy-load the YouTube IFrame API on first use (not at page load).
        if (!IS_MOBILE_ZOOM && !window._ytApiLoaded) {
          window._ytApiLoaded = true;
          const s = document.createElement('script');
          s.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(s);
        }
        if (!IS_MOBILE_ZOOM) {
          iframe.onload = function () {
            if (!window.YT || !window.YT.Player) return;
            try {
              ytPlayer = new window.YT.Player('zoom-iframe', {
                events: {
                  onReady: function (e) { pushHighestQuality(e.target); },
                  onPlaybackQualityChange: function (e) {
                    pushHighestQuality(e.target);
                  },
                },
              });
            } catch (e) { /* ignore — quality bump is best-effort */ }
          };
        }
      }
      function closePhoneZoom() {
        if (!phoneZoom) return;
        phoneZoom.classList.remove('open');
        // After the fade-out, tear the iframe out completely. Next
        // open will build a brand-new one from scratch. On mobile
        // we also set the src to about:blank first so YouTube
        // releases its audio context cleanly — otherwise iOS was
        // holding on to the last stream.
        setTimeout(() => {
          if (ytPlayer && ytPlayer.destroy) {
            try { ytPlayer.destroy(); } catch (e) {}
            ytPlayer = null;
          }
          if (zoomScreen) {
            const iframe = zoomScreen.querySelector('iframe');
            if (iframe) {
              try { iframe.src = 'about:blank'; } catch (e) {}
              iframe.remove();
            }
          }
        }, 450);
      }
      // Click on any carousel iPhone -> open zoom with that video.
      // Now uses static <img> thumbnails (no iframes in carousel) and
      // reads the YouTube ID from data-yt-id, so click capture is
      // bullet-proof — img elements never swallow events.
      function handlePhoneClick(e) {
        const mockup = e.target.closest && e.target.closest('#pane-left-eye .iphone-mockup');
        if (!mockup) return;
        e.preventDefault();
        e.stopPropagation();
        const ytId = mockup.dataset.ytId;
        if (!ytId) return;

        // MOBILE: open the video directly in a new tab (YouTube app
        // or mobile site). The custom phone-zoom overlay + iframe
        // embed has too many iOS quirks — 2nd-open black screens,
        // the whole page reloading when the iframe fails autoplay,
        // memory pressure from destroy/recreate cycles. Native
        // YouTube on iOS just works, and the tap context is a
        // valid user gesture so the new tab is allowed.
        if (IS_MOBILE_ZOOM) {
          window.open('https://www.youtube.com/watch?v=' + ytId, '_blank', 'noopener');
          return;
        }

        // DESKTOP: keep the fancy phone-zoom overlay
        const src = 'https://www.youtube-nocookie.com/embed/' + ytId
                  + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
        openPhoneZoom(src);
      }
      const carouselEl = document.getElementById('iphone-carousel');
      if (carouselEl) carouselEl.addEventListener('click', handlePhoneClick);
      if (zoomClose) zoomClose.addEventListener('click', closePhoneZoom);
      if (phoneZoom) phoneZoom.addEventListener('click', e => {
        if (e.target === phoneZoom) closePhoneZoom();
      });

      // Image lightbox — clicking any result screenshot opens it full-screen
      const lightbox    = document.getElementById('image-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightboxClose');

      function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('open');
      }
      function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
      }
      document.querySelectorAll('#pane-left-eye .result-card').forEach(card => {
        card.addEventListener('click', e => {
          e.stopPropagation();
          const img = card.querySelector('img');
          if (img) openLightbox(img.src, img.alt);
        });
      });
      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      if (lightbox) lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
      });

      // ESC closes lightbox first, then phone zoom
      document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (lightbox && lightbox.classList.contains('open')) { closeLightbox(); return; }
        if (phoneZoom && phoneZoom.classList.contains('open')) closePhoneZoom();
      });
    })();