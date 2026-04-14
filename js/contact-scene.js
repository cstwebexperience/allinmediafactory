/* ── Contact Section — Three.js animation ── */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Same contact scene visuals on every device — only pixelRatio adapts.
const C_IS_MOBILE = window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;
const C_HW = navigator.hardwareConcurrency || 4;
// Same rule as the hero: modern mobile with HW>=6 gets full quality.
const C_LOW_POWER = (C_IS_MOBILE && C_HW < 6) || C_HW <= 4 || !!window._lowPowerGpu;

const contactArea  = document.getElementById('contact');
const cCanvas      = document.getElementById('contact-canvas');
const renderer2    = new THREE.WebGLRenderer({ canvas: cCanvas, antialias: true, powerPreference: C_LOW_POWER ? 'low-power' : 'high-performance' });
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, C_LOW_POWER ? 1.5 : 2));
renderer2.setSize(window.innerWidth, window.innerHeight);

const scene2  = new THREE.Scene();
scene2.background = new THREE.Color(0x030305);

const camera2 = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera2.position.set(0, 0, 4);

const pmrem2 = new THREE.PMREMGenerator(renderer2);
scene2.environment = pmrem2.fromScene(new RoomEnvironment(), 0.04).texture;


// ── Load textures ──
const loader = new THREE.TextureLoader();
let clipMesh = null, waMesh = null;

// Mesh target positions depend on viewport aspect. On a portrait
// phone (aspect < 0.8) the clipboard + WhatsApp meshes stack
// vertically because the camera's horizontal FOV can't fit the
// desktop side-by-side layout (waMesh at x=1.5 is OUTSIDE the
// ~±0.67 horizontal view at z=4 on a narrow portrait). On
// desktop/tablet landscape they stay side-by-side as designed.
const C_PORTRAIT = window.innerWidth / window.innerHeight < 0.8;

// Mesh scale is also smaller on mobile so the two stacked meshes
// don't collide in the middle of the screen.
const C_MESH_SCALE = C_PORTRAIT ? 0.72 : 1.0;

const clipFinal = C_PORTRAIT
  ? { x: 0,    y:  0.62 }   // top-center on portrait
  : { x: -0.45, y: 0 };     // left on desktop
const waFinal   = C_PORTRAIT
  ? { x: 0,    y: -0.62 }   // bottom-center on portrait
  : { x: 1.5,  y: -0.1 };   // right on desktop
const clipStart = C_PORTRAIT
  ? { x: 0, y:  5.0 }       // fly down from top
  : { x: -5.5, y: 0.5 };
const waStart   = C_PORTRAIT
  ? { x: 0, y: -5.0 }       // fly up from bottom
  : { x: 5.5, y: 0.3 };

loader.load('clipboard-t.png', (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  const aspect = tex.image.width / tex.image.height;
  const h = 1.6 * C_MESH_SCALE;
  clipMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(h * aspect, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  clipMesh.position.set(clipStart.x, clipStart.y, 0);
  scene2.add(clipMesh);
});

loader.load('whatsapp-t.png', (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  const aspect = tex.image.width / tex.image.height;
  const h = 0.85 * C_MESH_SCALE;
  waMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(h * aspect, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  waMesh.position.set(waStart.x, waStart.y, 0.2);
  scene2.add(waMesh);
});


// ── Lights ──
const clipGlow = new THREE.PointLight(0x8050d0, 4, 8);
clipGlow.position.set(-0.5, 0, 1.5);
scene2.add(clipGlow);
const waGlow = new THREE.PointLight(0x25d366, 3, 6);
waGlow.position.set(1.5, 0, 1.5);
scene2.add(waGlow);
scene2.add(new THREE.PointLight(0x6030b0, 3, 15));
scene2.add(new THREE.AmbientLight(0x080410, 0.4));

// ── Scroll (Lenis on desktop + native on mobile) ──
// Both listeners are attached because Lenis doesn't fire its scroll
// event on native touch scroll (smoothTouch:false). Without the
// native listener cScrollP freezes and the clipboard + WhatsApp
// meshes never animate in on phones.
let cScrollP = 0;
function updateContactScroll() {
  if (document.body.style.position === 'fixed') return;
  const sy = (C_IS_MOBILE || !window._lenis) ? window.scrollY : window._lenis.scroll;
  const scrollable = contactArea.offsetHeight - window.innerHeight;
  const scrolled   = sy - contactArea.offsetTop;
  cScrollP = Math.min(Math.max(scrolled / scrollable, 0), 1);
}
if (window._lenis) window._lenis.on('scroll', updateContactScroll);
window.addEventListener('scroll', updateContactScroll, { passive: true });
updateContactScroll();

// ── Helpers ──
function easeOutCubic(t) { return 1 - Math.pow(1-t, 3); }
function clamp01c(t) { return Math.max(0, Math.min(1, t)); }
function mapRange2(v, s, e) { return clamp01c((v-s)/(e-s)); }
function lerp(a, b, t) { return a + (b-a)*t; }

// ── Mouse ──
let cmx=0, cmy=0, csmx=0, csmy=0;
window.addEventListener('mousemove', e => {
  cmx = (e.clientX/window.innerWidth)*2-1;
  cmy = -(e.clientY/window.innerHeight)*2+1;
});

// ── Raycaster ──
const raycaster2 = new THREE.Raycaster();
const pointer2   = new THREE.Vector2();
let cfOpen = false, hClip = false, hWa = false, hClipS = 0, hWaS = 0;

const formOverlay = document.getElementById('contactFormOverlay');
const cfCloseBtn  = document.getElementById('cfCloseBtn');
const cfForm      = document.getElementById('cfForm');

function openCF() { cfOpen=true; formOverlay.classList.add('active'); window._lenis?.stop(); }
function closeCF() { cfOpen=false; formOverlay.classList.remove('active'); window._lenis?.start(); }
cfCloseBtn.addEventListener('click', closeCF);
formOverlay.addEventListener('click', e => { if (e.target===formOverlay) closeCF(); });
cfForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = cfForm.querySelector('.cf-submit');
  btn.textContent = 'Se trimite...'; btn.disabled = true;
  try {
    await fetch('https://formsubmit.co/ajax/leaveyoucontact@gmail.com',
      { method:'POST', body: new FormData(cfForm) });
    cfForm.style.display = 'none';
    const s = document.createElement('div'); s.className = 'cf-success';
    s.innerHTML = '<span class="cf-check">&#10003;</span>Multumim! Te contactam in curand.';
    cfForm.parentElement.appendChild(s);
    setTimeout(closeCF, 3500);
  } catch(err) { btn.textContent='Eroare'; btn.disabled=false; }
});

cCanvas.addEventListener('click', e => {
  if (cfOpen) return;
  pointer2.x = (e.clientX/window.innerWidth)*2-1;
  pointer2.y = -(e.clientY/window.innerHeight)*2+1;
  raycaster2.setFromCamera(pointer2, camera2);
  if (waMesh && raycaster2.intersectObject(waMesh).length > 0) {
    window.open('https://wa.me/40743391581', '_blank'); return;
  }
  if (clipMesh && raycaster2.intersectObject(clipMesh).length > 0) openCF();
});
cCanvas.addEventListener('mousemove', e => {
  pointer2.x = (e.clientX/window.innerWidth)*2-1;
  pointer2.y = -(e.clientY/window.innerHeight)*2+1;
  raycaster2.setFromCamera(pointer2, camera2);
  hClip = !!(clipMesh && raycaster2.intersectObject(clipMesh).length > 0);
  hWa   = !!(waMesh   && raycaster2.intersectObject(waMesh).length > 0);
  cCanvas.style.cursor = (hClip || hWa) ? 'pointer' : 'default';
});

window.addEventListener('resize', () => {
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();
  renderer2.setSize(window.innerWidth, window.innerHeight);
});

const clock2 = new THREE.Clock();
const clipLabelEl = document.getElementById('contact-clipLabel');
const waLabelEl   = document.getElementById('contact-waLabel');

function tick2() {
  requestAnimationFrame(tick2);
  if (window._contactVisible === false) return;
  const t = clock2.getElapsedTime();

  csmx += (cmx-csmx)*0.04;
  csmy += (cmy-csmy)*0.04;
  hClipS += ((hClip?1:0) - hClipS)*0.08;
  hWaS   += ((hWa?1:0)   - hWaS)*0.08;

  const clipP = easeOutCubic(mapRange2(cScrollP, 0.0, 0.7));
  const waP   = easeOutCubic(mapRange2(cScrollP, 0.1, 0.75));

  if (clipMesh) {
    clipMesh.position.x = lerp(clipStart.x, clipFinal.x, clipP);
    clipMesh.position.y = lerp(clipStart.y, clipFinal.y, clipP) + Math.sin(t*0.4)*0.06*clipP;
    clipMesh.rotation.y = csmx*0.3 + Math.sin(t*0.2)*0.05 + (1-clipP)*1.2;
    clipMesh.rotation.x = -csmy*0.18 + Math.sin(t*0.15)*0.03;
    clipMesh.rotation.z = csmx*0.06 + Math.sin(t*0.18)*0.02;
    clipMesh.scale.setScalar(1 + Math.sin(t*0.8)*0.008*clipP + hClipS*0.05);
    clipGlow.intensity = (3 + Math.sin(t*1.5)*1.5 + hClipS*5) * clipP;
    clipGlow.position.x = clipMesh.position.x;

    // Label position. On desktop the label sits BELOW the clipboard
    // mesh (negative y offset). On portrait the clipboard mesh is
    // stacked in the top half so the label goes ABOVE it (positive
    // offset) — otherwise it falls into the middle of the screen
    // and overlaps the WhatsApp mesh below.
    const clipLabelOffset = C_PORTRAIT ? 0.75 : -1.05;
    const v1 = clipMesh.position.clone(); v1.y += clipLabelOffset; v1.project(camera2);
    clipLabelEl.style.left = ((v1.x*0.5+0.5)*window.innerWidth) + 'px';
    clipLabelEl.style.top  = ((-v1.y*0.5+0.5)*window.innerHeight) + 'px';
    clipLabelEl.style.opacity = mapRange2(clipP, 0.85, 1) * (0.5 + hClipS*0.5);
  }

  if (waMesh) {
    waMesh.position.x = lerp(waStart.x, waFinal.x, waP);
    waMesh.position.y = lerp(waStart.y, waFinal.y, waP) + Math.sin(t*0.5)*0.05*waP;
    waMesh.rotation.y = csmx*0.2 + Math.sin(t*0.25)*0.12 + (1-waP)*-1.2;
    waMesh.rotation.x = -csmy*0.12 + Math.sin(t*0.3)*0.06;
    waMesh.rotation.z = Math.sin(t*0.35)*0.03;
    waMesh.scale.setScalar(1 + Math.sin(t*0.9)*0.01*waP + hWaS*0.06);
    waGlow.intensity = (2 + Math.sin(t*1.8)*1 + hWaS*4) * waP;
    waGlow.position.x = waMesh.position.x;

    // On portrait waMesh is in bottom half, label sits a touch lower.
    // On desktop waMesh is side-right, label below it.
    const waLabelOffset = C_PORTRAIT ? -0.42 : -0.6;
    const v2 = waMesh.position.clone(); v2.y += waLabelOffset; v2.project(camera2);
    waLabelEl.style.left = ((v2.x*0.5+0.5)*window.innerWidth) + 'px';
    waLabelEl.style.top  = ((-v2.y*0.5+0.5)*window.innerHeight) + 'px';
    waLabelEl.style.opacity = mapRange2(waP, 0.85, 1) * (0.5 + hWaS*0.5);
  }

  renderer2.render(scene2, camera2);
}
tick2();