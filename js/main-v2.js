// ═══════════════════════════════════════════════════════
// AllInMedia Factory v2 — INSANE Interactions
// Sketchfab 3D (mask + scarf), GSAP cinematic reveals,
// custom cursor, magnetic buttons, counters, language
// ═══════════════════════════════════════════════════════

(function () {
  'use strict';

  // ═══════════════════════════════════
  // PRELOADER
  // ═══════════════════════════════════
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('done');
        // Start hero animation after preloader
        animateHeroEntrance();
      }, 2000);
    });

    // Fallback — remove after 4s no matter what
    setTimeout(() => {
      preloader.classList.add('done');
      animateHeroEntrance();
    }, 4000);
  }

  // ═══════════════════════════════════
  // HERO ENTRANCE ANIMATION
  // ═══════════════════════════════════
  let heroAnimated = false;

  function animateHeroEntrance() {
    if (heroAnimated || typeof gsap === 'undefined') return;
    heroAnimated = true;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Title words — clip-path reveal
    tl.to('.title-word', {
      y: 0,
      duration: 1.2,
      stagger: 0.1,
    })
    .to('.hero-tag', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.8')
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.5')
    .to('.hero-ctas', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.5')
    .to('.scroll-indicator', {
      opacity: 1,
      duration: 0.6,
    }, '-=0.3');
  }

  // ═══════════════════════════════════
  // SKETCHFAB 3D — MASK + SCARF
  // ═══════════════════════════════════
  const MASK_MODEL_ID = '0e4993d9a0684d03b76644a5253c28a3';
  // Scarf model — overlaid on mask
  // const SCARF_MODEL_ID = '663a82ac08384c46808d32bbfbcfcf17';

  function initSketchfab() {
    const iframe = document.getElementById('mask-viewer');
    const hero3d = document.getElementById('hero-3d');
    if (!iframe || typeof Sketchfab === 'undefined') return;

    // Set src to load the mask model via embed with params
    const params = [
      'autostart=1',
      'ui_stop=0',
      'ui_inspector=0',
      'ui_infos=0',
      'ui_controls=0',
      'ui_watermark=0',
      'ui_annotations=0',
      'ui_help=0',
      'ui_settings=0',
      'ui_vr=0',
      'ui_fullscreen=0',
      'ui_loading=0',
      'transparent=0',
      'autospin=0.15',
      'camera=0',
      'preload=1',
      'scrollwheel=0',
      'dnt=1',
    ].join('&');

    iframe.src = 'https://sketchfab.com/models/' + MASK_MODEL_ID + '/embed?' + params;

    // Show when loaded
    iframe.addEventListener('load', () => {
      setTimeout(() => {
        hero3d.classList.add('loaded');
      }, 500);
    });

    // Fallback show after 5s
    setTimeout(() => {
      hero3d.classList.add('loaded');
    }, 5000);
  }

  // ═══════════════════════════════════
  // SMOOTH SCROLL — Lenis
  // ═══════════════════════════════════
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ═══════════════════════════════════
  // GSAP SCROLL ANIMATIONS — Cinematic
  // ═══════════════════════════════════
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Section tags — fade in
    gsap.utils.toArray('.section-tag').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 0, y: 20, duration: 0.6,
      });
    });

    // Section titles — reveal from bottom
    gsap.utils.toArray('.section-title').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
      });
    });

    // Section subtitles
    gsap.utils.toArray('.section-sub').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 0, y: 30, duration: 0.7, delay: 0.15,
      });
    });

    // Service cards — staggered from bottom
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length) {
      gsap.from(serviceCards, {
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%', once: true },
        opacity: 0, y: 50, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });
    }

    // Metric blocks — count up triggered by GSAP
    const metricBlocks = gsap.utils.toArray('.metric-block');
    if (metricBlocks.length) {
      gsap.from(metricBlocks, {
        scrollTrigger: { trigger: '.metrics-grid', start: 'top 80%', once: true },
        opacity: 0, y: 40, duration: 0.7, stagger: 0.12,
        onStart: initCounters,
      });
    }

    // Phone mockups — stagger from right with rotation
    const phones = gsap.utils.toArray('#rezultate .phone-mockup');
    if (phones.length) {
      gsap.from(phones, {
        scrollTrigger: { trigger: '#rezultate .phone-carousel', start: 'top 80%', once: true },
        opacity: 0, x: 60, rotateY: 15, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });
    }

    // Portfolio cards
    const portfolioCards = gsap.utils.toArray('.portfolio-card');
    if (portfolioCards.length) {
      gsap.from(portfolioCards, {
        scrollTrigger: { trigger: '.portfolio-grid', start: 'top 80%', once: true },
        opacity: 0, y: 50, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      });
    }

    // Video wrapper — scale up reveal
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
      gsap.from(videoWrapper, {
        scrollTrigger: { trigger: videoWrapper, start: 'top 80%', once: true },
        opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out',
      });
    }

    // Contact form + quick
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
      gsap.from('.contact-form', {
        scrollTrigger: { trigger: contactGrid, start: 'top 80%', once: true },
        opacity: 0, x: -40, duration: 0.8,
      });
      gsap.from('.contact-quick', {
        scrollTrigger: { trigger: contactGrid, start: 'top 80%', once: true },
        opacity: 0, x: 40, duration: 0.8, delay: 0.15,
      });
    }

    // Filmari cards
    const filmariCards = gsap.utils.toArray('.filmari-card');
    if (filmariCards.length) {
      gsap.from(filmariCards, {
        scrollTrigger: { trigger: '.filmari-grid', start: 'top 80%', once: true },
        opacity: 0, y: 40, duration: 0.7, stagger: 0.1,
      });
    }

    // Parallax on hero orbs
    gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
      gsap.to(orb, {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: (i + 1) * -80,
      });
    });

    // Hero 3D parallax — mask moves up slightly on scroll
    const hero3d = document.getElementById('hero-3d');
    if (hero3d) {
      gsap.to(hero3d, {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: -100, opacity: 0.3,
      });
    }
  }

  // ═══════════════════════════════════
  // COUNTER ANIMATION
  // ═══════════════════════════════════
  let countersStarted = false;

  function initCounters() {
    if (countersStarted) return;
    countersStarted = true;

    document.querySelectorAll('.metric-num').forEach((el) => {
      animateCounter(el);
    });
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000000) {
        el.textContent = (current / 1000000).toFixed(1) + 'M+';
      } else if (target >= 1000) {
        el.textContent = Math.floor(current / 1000) + 'K+';
      } else {
        el.textContent = current + (suffix || '+');
      }

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════
  // CUSTOM CURSOR
  // ═══════════════════════════════════
  function initCursor() {
    // Only on devices with fine pointer (desktop)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let cx = -100, cy = -100, fx = -100, fy = -100;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
    }, { passive: true });

    function render() {
      // Cursor — instant
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';

      // Follower — lerp
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // Hover states
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio-card, .phone-mockup, .video-facade, .tab');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  // ═══════════════════════════════════
  // MAGNETIC BUTTONS
  // ═══════════════════════════════════
  function initMagnetic() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════
  // SERVICE CARD GLOW FOLLOW
  // ═══════════════════════════════════
  function initCardGlow() {
    document.querySelectorAll('.service-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ═══════════════════════════════════
  // STICKY HEADER
  // ═══════════════════════════════════
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll > 500) {
        header.classList.add('show');
      } else {
        header.classList.remove('show');
      }
      lastScroll = scroll;
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          // Close mobile nav if open
          const mobileNav = document.getElementById('mobileNav');
          const hamburger = document.getElementById('hamburger');
          if (mobileNav && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('open');
          }

          if (lenis) lenis.scrollTo(target, { offset: -60 });
          else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ═══════════════════════════════════
  // HAMBURGER MENU
  // ═══════════════════════════════════
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // ═══════════════════════════════════
  // PORTFOLIO TABS
  // ═══════════════════════════════════
  function initTabs() {
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
        tab.classList.add('active');
        const content = document.getElementById('tab-' + tab.dataset.tab);
        if (content) content.classList.add('active');
      });
    });
  }

  // ═══════════════════════════════════
  // VIDEO FACADE
  // ═══════════════════════════════════
  function initVideo() {
    const facade = document.getElementById('videoFacade');
    if (!facade) return;

    facade.addEventListener('click', () => {
      const wrapper = facade.parentElement;
      // Replace with video element
      wrapper.innerHTML = '<video src="assets/video/campanie.mp4" controls autoplay playsinline style="width:100%;height:100%;object-fit:cover;border-radius:20px"></video>';
    });
  }

  // ═══════════════════════════════════
  // CONTACT FORM
  // ═══════════════════════════════════
  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.classList.add('sending');
      const btn = form.querySelector('button[type="submit"]');
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<span>Se trimite...</span>';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.classList.remove('sending');
          form.classList.add('sent');
          btn.innerHTML = '<span>Trimis cu succes!</span>';
          form.reset();
          setTimeout(() => {
            btn.innerHTML = origHTML;
            form.classList.remove('sent');
          }, 3000);
        } else {
          throw new Error('fail');
        }
      } catch {
        form.classList.remove('sending');
        btn.innerHTML = origHTML;
        alert('Eroare la trimitere. Încearcă prin WhatsApp.');
      }
    });
  }

  // ═══════════════════════════════════
  // LANGUAGE SWITCH
  // ═══════════════════════════════════
  let currentLang = 'ro';

  function initLang() {
    const toggle = document.getElementById('lang-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      currentLang = currentLang === 'ro' ? 'en' : 'ro';
      toggle.textContent = currentLang === 'ro' ? 'EN' : 'RO';
      applyLang();
    });
  }

  function applyLang() {
    // Text content
    document.querySelectorAll('[data-' + currentLang + ']').forEach((el) => {
      if (el.tagName === 'OPTION') {
        el.textContent = el.dataset[currentLang];
      } else {
        el.textContent = el.dataset[currentLang];
      }
    });

    // Placeholders
    const placeholderKey = 'placeholder' + currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
    document.querySelectorAll('[data-placeholder-' + currentLang + ']').forEach((el) => {
      el.placeholder = el.dataset[placeholderKey];
    });

    // HTML lang
    document.documentElement.lang = currentLang;
  }

  // ═══════════════════════════════════
  // INIT ALL
  // ═══════════════════════════════════
  function init() {
    initPreloader();
    initLenis();
    initSketchfab();
    initScrollAnimations();
    initHeader();
    initHamburger();
    initTabs();
    initVideo();
    initForm();
    initLang();
    initCursor();
    initMagnetic();
    initCardGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
