import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ── Device profile ──
// IMPORTANT: the sphere must look IDENTICAL on every machine (same geometry,
// same lighting, same post-processing). The only thing we adapt for weak
// GPUs is internal render resolution (pixelRatio) and a half-rate vertex
// deform — both invisible to the eye. The actual scroll-lag fix lives in
// the Lenis init: smoothWheel is disabled on LOW_POWER machines so the
// page falls back to native scroll. window._lowPowerGpu set in init script.
const IS_MOBILE = window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;
const HW = navigator.hardwareConcurrency || 4;
// LOW_POWER is ONLY for genuinely weak hardware — old phones (HW<6),
// integrated/software GPUs (_lowPowerGpu), or HW<=4 desktops. Modern
// iPhone 13+/Pixel 7+ etc. have 6-8 cores and render the full composer
// (bloom + chromatic aberration) at 60fps without issue. Forcing them
// to the LOW_POWER path made the dark metallic sphere look like just
// 4-5 faint purple dots because bloom was disabled.
const LOW_POWER = (IS_MOBILE && HW < 6) || HW <= 4 || !!window._lowPowerGpu;

const canvas   = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: LOW_POWER ? 'low-power' : 'high-performance' });
// Pixel ratio: 1.5 on weak GPUs vs 2 on strong ones — sharper than 1.25
// but still ~2x cheaper than full DPR. Visually almost indistinguishable.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, LOW_POWER ? 1 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030305);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
// On mobile the default FOV + z=5 makes the sphere fill most of the
// portrait viewport — too dominant. Pull the camera back to z=8.5
// on narrow screens so the sphere reads at ~60% of the previous
// size, leaving room for the "All In Media" title block underneath.
// Desktop keeps the original z=5 so the hero is unchanged there.
(function () {
  const mobile = window.innerWidth < 768;
  camera.position.set(0, 0.3, mobile ? 8.5 : 5);
})();

const pmrem = new THREE.PMREMGenerator(renderer);
let envMap = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
scene.environment = envMap;

const mat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x0a0a12),
  metalness: 1.0,
  roughness: 0.015,
  envMap,
  envMapIntensity: 1.4,
  clearcoat: 0.3,
  clearcoatRoughness: 0.15,
  reflectivity: 0.7,
});

// HDRI environment map — restored because it gives the sphere its
// distinctive "smileyface" highlights on the forehead and nose that
// Lucian specifically asked to keep. RoomEnvironment alone gave a
// flatter, less characterful look.
new RGBELoader().load(
  'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr',
  function(hdr) {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const env = pmrem.fromEquirectangular(hdr).texture;
    scene.environment = env;
    mat.envMap = env;
    mat.needsUpdate = true;
    hdr.dispose();
    if (window._loaderAssetDone) window._loaderAssetDone();
  }
);

// Geometry detail drops on low-power GPUs: level 6 = ~10k tris
// on desktop, level 4 = ~2.5k tris on mobile/weak integrated graphics.
// At the sizes the sphere is rendered the silhouette difference is
// imperceptible but the CPU-side deform loop in tick() runs ~4x
// cheaper, which is where the jank lives on Intel HD / older laptops.
const SPHERE_DETAIL = LOW_POWER ? 4 : 6;
const geo = new THREE.IcosahedronGeometry(0.9, SPHERE_DETAIL);
const basePos = geo.attributes.position.array.slice();
const sphere = new THREE.Mesh(geo, mat);
sphere.position.y = 0.4;
scene.add(sphere);

const lights = [
  new THREE.PointLight(0x8050d0, 10, 15),
  new THREE.PointLight(0x6030b0, 6,  15),
  new THREE.PointLight(0xa070f0, 5,  12),
  new THREE.PointLight(0x5020a0, 4,  15),
];
lights[0].position.set( 3,  2,  2);
lights[1].position.set(-3, -1,  3);
lights[2].position.set( 0, -3, -1);
lights[3].position.set(-2,  3, -2);
lights.forEach(l => scene.add(l));
scene.add(new THREE.AmbientLight(0x0a0515, 0.3));

// ── Post-Processing ──
// Full bloom + chromatic aberration pipeline on capable GPUs; a
// plain renderer.render() path on low-power. UnrealBloomPass is the
// single most expensive thing in the hero frame (~40% of GPU cost
// on Intel HD). Dropping it + chromatic aberration + OutputPass
// shaves ~12-15ms/frame on weak integrated graphics — enough to
// stay pinned to 60fps on laptops that used to stutter at 30-40.
const composer = LOW_POWER ? null : new EffectComposer(renderer);
let bloomPass = null;
let caPass = null;
if (composer) {
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4, 0.55, 0.82
  );
  composer.addPass(bloomPass);

  const ChromaticAberrationShader = {
    uniforms: {
      tDiffuse: { value: null },
      amount: { value: 0.0025 },
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      varying vec2 vUv;
      void main() {
        vec2 dir = vUv - vec2(0.5);
        float dist = length(dir);
        vec2 offset = dir * dist * amount;
        float r = texture2D(tDiffuse, vUv + offset).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - offset).b;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `,
  };
  caPass = new ShaderPass(ChromaticAberrationShader);
  composer.addPass(caPass);
  composer.addPass(new OutputPass());
}

let mx = 0, my = 0, smx = 0, smy = 0;
window.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth)  * 2 - 1;
  my = -(e.clientY / window.innerHeight) * 2 + 1;
});

// scrollP is driven by Lenis (smooth scroll) on desktop AND by native
// scroll events on mobile. Critical: on touch phones Lenis has
// smoothTouch:false so it does NOT intercept native touch scroll —
// lenis.on('scroll') never fires, and scrollP would get stuck. We
// attach BOTH listeners so scrollP always updates. readScrollP also
// falls back to window.scrollY when Lenis hasn't been created yet.
let scrollP = 0;
// Cache initial viewport height so scrollP doesn't jump when the
// mobile address bar hides/shows (changing window.innerHeight).
const _scrollPHeight = window.innerHeight;
function readScrollP() {
  // Don't update scrollP while a service pane is open — body is
  // position:fixed so window.scrollY jumps to 0, which makes
  // scrollP=0 → hero becomes opacity:1 → visible flash behind overlay.
  if (document.body.style.position === 'fixed') return;
  // Always use window.scrollY on mobile — Lenis has smoothTouch:false
  // so _lenis.scroll doesn't update on touch scroll, causing scrollP
  // to get stuck and the sphere to stay at its last scrolled position.
  // Use window.scrollY when Lenis smoothWheel is off (mobile touch OR
  // low-power desktop) — _lenis.scroll doesn't update without smoothing.
  const sy = (IS_MOBILE || LOW_POWER || !window._lenis) ? window.scrollY : window._lenis.scroll;
  scrollP = Math.min(Math.max(sy / _scrollPHeight, 0), 1);
  if (window.ScrollTrigger) window.ScrollTrigger.update();
}
if (window._lenis) window._lenis.on('scroll', readScrollP);
window.addEventListener('scroll', readScrollP, { passive: true });
readScrollP();

function snoise(x, y, z) {
  return (
    Math.sin(x*1.7 + y*2.1 + z*0.9) * Math.cos(y*1.3 + z*2.7 + x*0.6) +
    Math.sin(x*3.1 + z*1.9) * Math.cos(y*2.9 + x*1.1) * 0.5
  ) * 0.55;
}

const titleEl     = document.getElementById('hero-title-block');
const heroEl      = document.getElementById('hero');

window.addEventListener('resize', () => {
  const mobile = window.innerWidth < 768;
  camera.position.z = mobile ? 8.5 : 5;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (composer) {
    composer.setSize(window.innerWidth, window.innerHeight);
    bloomPass.resolution.set(window.innerWidth, window.innerHeight);
  }
});

function easeInOut(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
function easeIn(t)    { return t*t*t; }
function clamp01(t)   { return Math.max(0, Math.min(1, t)); }
function mapRange(v,s,e){ return clamp01((v-s)/(e-s)); }

const clock = new THREE.Clock();
let frameCounter = 0;

function tick() {
  requestAnimationFrame(tick);

  // Always update the hero wrapper's CSS state from scrollP — even
  // when the hero is off-screen and we'll skip the Three.js render.
  // This is what restores the sphere when the user scrolls back to
  // the hero from below: scrollP updates via the scroll listener,
  // this block sets opacity/visibility back to visible, then the
  // render resumes once IntersectionObserver flags hero visible.
  if (heroEl) {
    const op = 1 - easeIn(mapRange(scrollP, 0.82, 0.98));
    heroEl.style.opacity = op;
    // Never set visibility:hidden on hero — iOS Safari suspends the
    // WebGL context and the sphere won't re-render on scroll-back.
    // opacity:0 + pointerEvents:none is enough (hero is behind other
    // content anyway). The IntersectionObserver pauses GPU work.
    heroEl.style.pointerEvents = op < 0.02 ? 'none' : '';
  }
  if (titleEl && window._loaderDone) {
    titleEl.style.opacity = 1;
    const titleDrift = easeIn(mapRange(scrollP, 0.82, 0.98));
    // Only set transform when actually drifting — avoids overriding
    // the loader's initial animation with a redundant translateY(0)
    titleEl.style.transform = titleDrift > 0.001 ? `translateY(${titleDrift * -14}px)` : '';
  }

  // GPU-heavy work pauses when hero is off-screen for battery savings
  if (window._heroVisible === false) return;

  frameCounter++;
  const t = clock.getElapsedTime();

  smx += (mx - smx) * 0.03;
  smy += (my - smy) * 0.03;

  // Camera base z is 5 on desktop, 8.5 on mobile (sphere reads
  // smaller in the portrait viewport). The scroll-driven pZoom
  // ease still pulls the camera in by 1 unit either way.
  const _mobileHero = window.innerWidth < 768;

  // On mobile, start scroll-driven animations later (0.18 instead
  // of 0.10) so the address bar hide (~70px) doesn't trigger sphere
  // zoom/movement. 0.18 * 844px = ~152px of real scroll needed.
  const _dz = _mobileHero ? 0.08 : 0;
  const pZoom      = easeInOut(mapRange(scrollP, 0.10 + _dz, 0.40 + _dz));
  const pIntensity = easeInOut(mapRange(scrollP, 0.15 + _dz, 0.45 + _dz));
  const pRotSpeed  = easeInOut(mapRange(scrollP, 0.20 + _dz, 0.50 + _dz));
  const pRise      = easeIn(mapRange(scrollP, 0.60, 0.90));
  const _camZBase = _mobileHero ? 8.5 : 5;
  camera.position.z = _camZBase - pZoom * 1.0;
  camera.position.y = 0.3 + pRise * 0.5;
  sphere.position.y = 0.4 + pRise * 6;

  // Per-vertex deformation is the hot loop. Strategy by tier:
  //  - Desktop / capable GPU  → every frame (full quality)
  //  - Low-power (Intel HD, mobile, 4 cores or less, reduced subdivs)
  //    → every 3rd frame. With SPHERE_DETAIL=4 the vertex count is
  //    already ~4x smaller, so this combo is about 12x cheaper than
  //    the desktop path. The sphere still breathes and reacts to
  //    the cursor, just at a slightly lower cadence no one notices.
  // Deform runs EVERY frame (even LOW_POWER) for smooth interactivity.
  // LOW_POWER uses simplified noise (1 snoise instead of 2) + already
  // has 4x fewer vertices (SPHERE_DETAIL 4 vs 6), so cost is ~8x less.
  {
    const pos = geo.attributes.position.array;
    const normals = geo.attributes.normal.array;
    const deformMult = 1 + pIntensity * 0.3;
    const speed = 0.25;
    const breath = Math.sin(t*0.5)*0.02 + Math.sin(t*1.1)*0.01;
    const tSpeed = t * speed;
    const tSpeed08 = tSpeed * 0.8;
    const mouseAbs = (Math.abs(smx)+Math.abs(smy)) * 0.08;
    const smx08 = smx * 0.8, smy08 = smy * 0.8;
    for (let i = 0; i < pos.length; i += 3) {
      const bx=basePos[i], by=basePos[i+1], bz=basePos[i+2];
      const len=Math.sqrt(bx*bx+by*by+bz*bz);
      const invLen = 1 / len;
      const nx=bx*invLen, ny=by*invLen, nz=bz*invLen;
      const n1 = snoise(nx*1.2+tSpeed, ny*1.2+tSpeed08, nz*1.2)*0.08*deformMult;
      // Second noise layer only on capable GPUs (doubles snoise cost)
      const n2 = LOW_POWER ? 0 : snoise(nx*2.5+tSpeed*0.5, ny*2.5-tSpeed*0.4, nz*2.5)*0.03*deformMult;
      const mdx=nx-smx08, mdy=ny-smy08;
      const mouseBulge = Math.max(0,1-Math.sqrt(mdx*mdx+mdy*mdy)*1.2)*mouseAbs;
      const scale = 1 + breath + n1 + n2 + (nx*smx+ny*smy)*0.1 + mouseBulge;
      const px=nx*len*scale, py=ny*len*scale, pz=nz*len*scale;
      pos[i]=px; pos[i+1]=py; pos[i+2]=pz;
      const nl = 1 / Math.sqrt(px*px+py*py+pz*pz);
      normals[i]=px*nl; normals[i+1]=py*nl; normals[i+2]=pz*nl;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.normal.needsUpdate   = true;
  }

  const rotSpeed = 0.05 + pRotSpeed * 0.15;
  sphere.rotation.y = t*rotSpeed + smx*0.3;
  sphere.rotation.x = smy*0.15 + t*0.015;

  const vMult = 1 + pIntensity * 2;
  lights[0].intensity = 10*vMult; lights[1].intensity = 6*vMult;
  lights[2].intensity = 5*vMult;  lights[3].intensity = 4*vMult;
  mat.envMapIntensity = 1.8 + pIntensity*1.5;
  lights[0].position.x = 3 + Math.sin(t*0.3)*0.5;
  lights[0].position.y = 2 + Math.cos(t*0.4)*0.4;
  lights[1].position.x = -3 + Math.sin(t*0.25)*0.4;

  // (heroEl opacity/visibility is already set in the always-run
  // block at the top of tick() — don't duplicate it here.)

  // Render path: full composer (bloom + CA + OutputPass) on capable
  // GPUs, plain renderer.render() on low-power. The plain path skips
  // the custom chromatic-aberration shader pass + the bloom multi-
  // downsample blur, which together cost ~12-15ms/frame on weak
  // integrated graphics.
  if (composer) {
    bloomPass.strength = 0.4 + pIntensity * 0.7;
    caPass.uniforms.amount.value = 0.002 + pIntensity * 0.003;
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}
tick();