import * as THREE from 'three';
import { GROUPS, SKILLS, type SkillGroup } from '@/lib/skills';

type Options = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  tip: HTMLElement;
  isReduced: () => boolean;
  isDark: () => boolean;
};

export type SceneApi = {
  setGroup(group: SkillGroup | null): void;
  readTheme(): void;
  dispose(): void;
};

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// 3D constellation of skills on a sphere. Throws if WebGL is unavailable, so the caller can fall back.
export function createScene({ canvas, container, tip, isReduced, isDark }: Options): SceneApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 10;
  const group = new THREE.Group();
  group.position.y = 0.35;
  scene.add(group);

  let activeGroup: SkillGroup | null = null;

  // Soft glow texture shared by every node.
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g2 = c.getContext('2d')!;
  const grd = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.16, 'rgba(255,255,255,.95)');
  grd.addColorStop(0.38, 'rgba(255,255,255,.32)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g2.fillStyle = grd;
  g2.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);

  // Nodes spread evenly on a Fibonacci sphere.
  const N = SKILLS.length, R = 3.2, golden = Math.PI * (3 - Math.sqrt(5));
  const nodes = SKILLS.map(([name, grp], i) => {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.position.set(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
    s.userData = { name, grp, scale: 0.62, op: 1 };
    s.scale.setScalar(0.62);
    group.add(s);
    return s;
  });

  // Lines between nearby nodes.
  const pairs: [number, number][] = [];
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    if (nodes[i].position.distanceTo(nodes[j].position) < 2.6) pairs.push([i, j]);
  }
  const lPos = new Float32Array(pairs.length * 6), lCol = new Float32Array(pairs.length * 6);
  pairs.forEach(([a, b], k) => { nodes[a].position.toArray(lPos, k * 6); nodes[b].position.toArray(lPos, k * 6 + 3); });
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false });
  group.add(new THREE.LineSegments(lGeo, lMat));

  // Background dust.
  const dPos = new Float32Array(500 * 3);
  for (let k = 0; k < 500; k++) {
    const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, rr = 5 + Math.random() * 10, q = Math.sqrt(1 - u * u);
    dPos[k * 3] = Math.cos(a) * q * rr; dPos[k * 3 + 1] = u * rr; dPos[k * 3 + 2] = Math.sin(a) * q * rr - 4;
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dMat = new THREE.PointsMaterial({ size: 0.045, transparent: true, opacity: 0.5, depthWrite: false });
  const dust = new THREE.Points(dGeo, dMat);
  scene.add(dust);

  // Colours come from the CSS tokens, so they follow the theme.
  const colors = {} as Record<SkillGroup, THREE.Color>;
  let bg = new THREE.Color('#060914');
  function paintLines() {
    const cA = new THREE.Color(), cB = new THREE.Color();
    pairs.forEach(([a, b], k) => {
      const ga = nodes[a].userData.grp as SkillGroup, gb = nodes[b].userData.grp as SkillGroup;
      let f = 0.75;
      if (activeGroup) f = ga === activeGroup && gb === activeGroup ? 1 : ga === activeGroup || gb === activeGroup ? 0.3 : 0.08;
      cA.copy(colors[ga]).lerp(bg, 1 - f).toArray(lCol, k * 6);
      cB.copy(colors[gb]).lerp(bg, 1 - f).toArray(lCol, k * 6 + 3);
    });
    lGeo.attributes.color.needsUpdate = true;
  }
  function readTheme() {
    (Object.keys(GROUPS) as SkillGroup[]).forEach(k => { colors[k] = new THREE.Color(cssVar(GROUPS[k].token) || '#ffffff'); });
    bg = new THREE.Color(cssVar('--bg') || '#060914');
    // Additive glow looks right on dark; on light it washes out, so blend normally.
    const blend = isDark() ? THREE.AdditiveBlending : THREE.NormalBlending;
    nodes.forEach(s => { s.material.color.copy(colors[s.userData.grp as SkillGroup]); s.material.blending = blend; s.material.needsUpdate = true; });
    lMat.blending = blend; lMat.needsUpdate = true;
    dMat.color = new THREE.Color(cssVar('--muted') || '#8A93B8'); dMat.blending = blend; dMat.needsUpdate = true;
    paintLines();
  }
  readTheme();

  function size() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = Math.max(10, 4.2 / (Math.tan(Math.PI / 8) * camera.aspect));
    camera.updateProjectionMatrix();
  }
  size();
  const ro = new ResizeObserver(size);
  ro.observe(container);

  // Drag to rotate, hover for a tooltip.
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(), tmp = new THREE.Vector3();
  const rot = { x: 0.22, y: 0 };
  let drag = false, lx = 0, ly = 0, vx = 0, vy = 0;
  let hover: THREE.Sprite | null = null;

  function showTip(s: THREE.Sprite | null) {
    if (s) {
      tip.replaceChildren(s.userData.name, Object.assign(document.createElement('small'), { textContent: GROUPS[s.userData.grp as SkillGroup].label }));
      tip.classList.add('show');
    } else tip.classList.remove('show');
  }
  function pick(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const obj = (ray.intersectObjects(nodes)[0]?.object as THREE.Sprite | undefined) ?? null;
    if (obj !== hover) { hover = obj; showTip(hover); }
  }
  const onDown = (e: PointerEvent) => {
    drag = true; lx = e.clientX; ly = e.clientY; vx = vy = 0;
    canvas.classList.add('grabbing');
    try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    pick(e);
  };
  const onMove = (e: PointerEvent) => {
    if (drag) {
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      vy = dx * 0.005; vx = dy * 0.005; rot.y += vy; rot.x += vx;
    }
    pick(e);
  };
  const endDrag = () => { drag = false; canvas.classList.remove('grabbing'); };
  const onLeave = (e: PointerEvent) => { if (e.pointerType === 'mouse') { hover = null; showTip(null); } };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', onLeave);

  // Render loop, paused while the hero is off screen.
  let raf = 0, running = false;
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!drag) {
      rot.y += vy; rot.x += vx; vy *= 0.94; vx *= 0.94;
      if (!isReduced()) rot.y += 0.0018;
    }
    rot.x = clamp(rot.x, -0.9, 0.9);
    group.rotation.set(rot.x, rot.y, 0);
    dust.rotation.y = rot.y * 0.25; dust.rotation.x = rot.x * 0.25;
    for (const s of nodes) {
      const d = s.userData, inG = !activeGroup || d.grp === activeGroup;
      let ts = activeGroup ? (inG ? 0.88 : 0.36) : 0.62;
      if (s === hover) ts = Math.max(ts, 1.08);
      d.scale += (ts - d.scale) * 0.15; d.op += ((inG ? 1 : 0.22) - d.op) * 0.15;
      s.scale.setScalar(d.scale); s.material.opacity = d.op;
    }
    renderer.render(scene, camera);
    if (hover) {
      hover.getWorldPosition(tmp).project(camera);
      const x = (tmp.x + 1) / 2 * container.clientWidth, y = (1 - tmp.y) / 2 * container.clientHeight;
      tip.style.transform = `translate(${x}px, ${y}px) translate(-50%, calc(-100% - 18px))`;
    }
  }
  const start = () => { if (!running) { running = true; frame(); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const io = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? start() : stop())));
  io.observe(container);

  return {
    setGroup(g) { activeGroup = g; paintLines(); },
    readTheme,
    dispose() {
      stop(); io.disconnect(); ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', endDrag);
      canvas.removeEventListener('pointercancel', endDrag);
      canvas.removeEventListener('pointerleave', onLeave);
      nodes.forEach(s => s.material.dispose());
      tex.dispose(); lGeo.dispose(); lMat.dispose(); dGeo.dispose(); dMat.dispose();
      renderer.dispose();
    },
  };
}
