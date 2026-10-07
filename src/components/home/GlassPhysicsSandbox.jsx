'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';
import { soundFx } from '@/lib/soundFx';

// ==========================================
// 3D GEOMETRIC SHAPES & VERTEX DEFINITIONS
// ==========================================

// 1. Octahedron (Diamond / Double Pyramid)
const OCTAHEDRON = {
  type: 'octahedron',
  vertices: [
    [0, -1, 0],   // 0: top
    [1, 0, 0],    // 1: right
    [0, 0, 1],    // 2: front
    [-1, 0, 0],   // 3: left
    [0, 0, -1],   // 4: back
    [0, 1, 0],    // 5: bottom
  ],
  faces: [
    [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], // top pyramid
    [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4], // bottom pyramid
  ],
};

// 2. Icosahedron (20-Sided Cut Gem)
const PHI = (1 + Math.sqrt(5)) / 2;
const ICOSAHEDRON = {
  type: 'icosahedron',
  vertices: [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
  ].map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return [x / len, y / len, z / len];
  }),
  faces: [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ],
};

// 3. Hexagonal Crystal Prism (Quartz)
const createHexPrism = () => {
  const verts = [];
  const h = 1.3;
  const r = 0.8;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    verts.push([Math.cos(angle) * r, -h / 2, Math.sin(angle) * r]);
  }
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    verts.push([Math.cos(angle) * r, h / 2, Math.sin(angle) * r]);
  }
  verts.push([0, -h * 0.8, 0]); // top point
  verts.push([0, h * 0.8, 0]);  // bottom point

  const faces = [];
  // side quads split into triangles
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    faces.push([i, next, next + 6]);
    faces.push([i, next + 6, i + 6]);
  }
  // top cap
  for (let i = 0; i < 6; i++) {
    faces.push([12, (i + 1) % 6, i]);
  }
  // bottom cap
  for (let i = 0; i < 6; i++) {
    faces.push([13, i + 6, ((i + 1) % 6) + 6]);
  }
  return { type: 'hex_prism', vertices: verts, faces };
};
const HEX_PRISM = createHexPrism();

// 4. Tetrahedron (Sharp Prism)
const TETRAHEDRON = {
  type: 'tetrahedron',
  vertices: [
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ].map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return [x / len, y / len, z / len];
  }),
  faces: [
    [0, 1, 2],
    [0, 3, 1],
    [0, 2, 3],
    [1, 3, 2],
  ],
};

// 5. Glass Orb / Spherical Lens (rendered dynamically with layered glass shaders)
const GLASS_ORB = {
  type: 'orb',
  radius: 1,
};

const GEOMETRY_CHOICES = [OCTAHEDRON, ICOSAHEDRON, HEX_PRISM, TETRAHEDRON, GLASS_ORB];

// ==========================================
// COLOR PALETTES & OPTICAL THEMES
// ==========================================
const PALETTES = {
  prismatic: {
    id: 'prismatic',
    name: 'Prismatic Sol',
    desc: 'High-dispersion optical crystal with chromatic rainbow flares',
    primary: '#38bdf8',     // sky blue
    secondary: '#c084fc',   // violet
    accent: '#f472b6',      // pink
    glow: 'rgba(56, 189, 248, 0.25)',
    borderGlow: 'rgba(192, 132, 252, 0.4)',
    specular: '#ffffff',
    dispersionA: 'rgba(56, 189, 248, 0.8)',
    dispersionB: 'rgba(236, 72, 153, 0.8)',
    bgGradient: 'radial-gradient(ellipse at 50% 40%, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.03) 60%, transparent 100%)',
  },
  aurora: {
    id: 'aurora',
    name: 'Nordic Aurora',
    desc: 'Deep ethereal emerald, glacial cyan, and boreal luminescence',
    primary: '#10b981',     // emerald
    secondary: '#06b6d4',   // cyan
    accent: '#8b5cf6',      // violet
    glow: 'rgba(16, 185, 129, 0.25)',
    borderGlow: 'rgba(6, 182, 212, 0.4)',
    specular: '#ffffff',
    dispersionA: 'rgba(16, 185, 129, 0.8)',
    dispersionB: 'rgba(6, 182, 212, 0.8)',
    bgGradient: 'radial-gradient(ellipse at 50% 40%, rgba(16, 185, 129, 0.07) 0%, rgba(6, 182, 212, 0.04) 60%, transparent 100%)',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Cyber Obsidian',
    desc: 'Smoked titanium crystal, dark glass, and electric magenta glints',
    primary: '#f43f5e',     // rose
    secondary: '#a855f7',   // purple
    accent: '#3b82f6',      // blue
    glow: 'rgba(244, 63, 94, 0.22)',
    borderGlow: 'rgba(168, 85, 247, 0.45)',
    specular: '#ffffff',
    dispersionA: 'rgba(244, 63, 94, 0.85)',
    dispersionB: 'rgba(168, 85, 247, 0.85)',
    bgGradient: 'radial-gradient(ellipse at 50% 40%, rgba(244, 63, 94, 0.06) 0%, rgba(168, 85, 247, 0.04) 60%, transparent 100%)',
  },
  champagne: {
    id: 'champagne',
    name: 'Rose Champagne',
    desc: 'Warm peach quartz, crystalline rose gold, and sunset amber',
    primary: '#fb923c',     // orange/peach
    secondary: '#f43f5e',   // rose
    accent: '#facc15',      // gold
    glow: 'rgba(251, 146, 60, 0.22)',
    borderGlow: 'rgba(244, 63, 94, 0.4)',
    specular: '#ffffff',
    dispersionA: 'rgba(251, 146, 60, 0.85)',
    dispersionB: 'rgba(244, 63, 94, 0.85)',
    bgGradient: 'radial-gradient(ellipse at 50% 40%, rgba(251, 146, 60, 0.07) 0%, rgba(244, 63, 94, 0.04) 60%, transparent 100%)',
  },
};

// ==========================================
// 3D VECTOR MATH & MATRIX TRANSFORMATIONS
// ==========================================
function rotatePoint(p, rx, ry, rz) {
  let [x, y, z] = p;

  // Rotate around X
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;

  // Rotate around Y
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;

  // Rotate around Z
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return [x3, y3, z2];
}

function computeNormal(p0, p1, p2) {
  const ax = p1[0] - p0[0];
  const ay = p1[1] - p0[1];
  const az = p1[2] - p0[2];

  const bx = p2[0] - p0[0];
  const by = p2[1] - p0[1];
  const bz = p2[2] - p0[2];

  const nx = ay * bz - az * by;
  const ny = az * bx - ax * bz;
  const nz = ax * by - ay * bx;

  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
}

// Light source vector in 3D (top-right-front)
const LIGHT_DIR = [0.45, -0.65, 0.61];
const lenL = Math.hypot(...LIGHT_DIR);
const L = LIGHT_DIR.map((v) => v / lenL);

// Secondary backlight
const BACKLIGHT_DIR = [-0.6, 0.5, -0.62];
const lenBL = Math.hypot(...BACKLIGHT_DIR);
const BL = BACKLIGHT_DIR.map((v) => v / lenBL);

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function GlassPhysicsSandbox() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // UI State
  const [activePalette, setActivePalette] = useState('prismatic');
  const [gravityMode, setGravityMode] = useState('zero_g'); // 'zero_g' | 'antigravity' | 'vortex'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [crystalCount, setCrystalCount] = useState(12);
  const [interactionHint, setInteractionHint] = useState('Click & drag crystals to fling them in zero gravity');

  // Interactive Refs
  const mousePosRef = useRef({ x: 0, y: 0, isDown: false, vx: 0, vy: 0, prevX: 0, prevY: 0 });
  const draggedCrystalRef = useRef(null);
  const crystalsRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const isVisibleRef = useRef(true);
  const ripplesRef = useRef([]);
  const lastChimeTimeRef = useRef(0);

  const palette = PALETTES[activePalette];

  // Initialize Crystals
  const initCrystals = useCallback((width, height, count = 12) => {
    const list = [];
    const minDim = Math.min(width, height);
    const baseRadius = Math.max(34, Math.min(62, minDim * 0.08));

    for (let i = 0; i < count; i++) {
      const geo = GEOMETRY_CHOICES[i % GEOMETRY_CHOICES.length];
      const scale = baseRadius * (0.65 + Math.random() * 0.75);
      const angle = Math.random() * Math.PI * 2;
      const dist = (Math.random() * 0.38 + 0.05) * minDim;

      list.push({
        id: i,
        geo,
        scale,
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        z: (Math.random() - 0.5) * 160,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.4,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        avx: (Math.random() - 0.5) * 0.025,
        avy: (Math.random() - 0.5) * 0.025,
        avz: (Math.random() - 0.5) * 0.025,
        mass: scale / 40,
        radius: scale,
        colorPhase: Math.random() * Math.PI * 2,
        ambientDriftAngle: Math.random() * Math.PI * 2,
      });
    }
    crystalsRef.current = list;
  }, []);

  // Trigger Acoustic Crystal Chime
  const triggerCrystalChime = useCallback((scale) => {
    if (isAudioMuted) return;
    const now = performance.now();
    if (now - lastChimeTimeRef.current < 85) return; // Audio throttle
    lastChimeTimeRef.current = now;

    // Pitch is inversely proportional to crystal mass/scale
    const pitch = Math.max(0.65, Math.min(2.1, 55 / scale));
    soundFx.playCrystalChime(pitch);
  }, [isAudioMuted]);

  // Gravitational Wave Pulse
  const triggerGravitationalWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / (window.devicePixelRatio || 1) / 2;
    const cy = canvas.height / (window.devicePixelRatio || 1) / 2;

    soundFx.playSuccess();

    ripplesRef.current.push({
      x: cx,
      y: cy,
      radius: 10,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.8,
      opacity: 1,
      color: palette.primary,
    });

    crystalsRef.current.forEach((c) => {
      const dx = c.x - cx;
      const dy = c.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const force = 12 + Math.random() * 8;
      c.vx += (dx / dist) * force;
      c.vy += (dy / dist) * force;
      c.vz += (Math.random() - 0.5) * 8;
      c.avx += (Math.random() - 0.5) * 0.15;
      c.avy += (Math.random() - 0.5) * 0.15;
    });

    setInteractionHint('Gravitational Wave Released • Crystals scattering in zero-G');
  }, [palette]);

  // Main Canvas Setup & Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      if (crystalsRef.current.length === 0) {
        initCrystals(width, height, crystalCount);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause when not in screen (saving 100% CPU/GPU)
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    let lastTime = performance.now();

    // Render & Physics Loop
    const renderLoop = (time) => {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
      if (!isVisibleRef.current) return;

      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Track cursor velocity
      const mouse = mousePosRef.current;
      mouse.vx = mouse.x - mouse.prevX;
      mouse.vy = mouse.y - mouse.prevY;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      const dragged = draggedCrystalRef.current;

      // 1. Process Gravitational Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.radius += 520 * dt;
        rip.opacity -= 1.1 * dt;

        if (rip.opacity <= 0 || rip.radius > rip.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color;
        ctx.globalAlpha = Math.max(0, rip.opacity * 0.6);
        ctx.lineWidth = 2.5;
        ctx.shadowColor = rip.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      const crystals = crystalsRef.current;
      const numCrystals = crystals.length;

      // 2. Physics & Forces Update
      for (let i = 0; i < numCrystals; i++) {
        const c = crystals[i];

        if (c === dragged) {
          // Locked to cursor with spring damping
          const targetX = mouse.x;
          const targetY = mouse.y;
          c.vx = (targetX - c.x) * 18;
          c.vy = (targetY - c.y) * 18;
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.z += -c.z * 6 * dt; // Pull slightly forward in 3D
          c.rx += c.avx;
          c.ry += c.avy;
          c.rz += c.avz;
        } else {
          // Ambient organic micro-currents in zero-G
          c.ambientDriftAngle += 0.4 * dt;
          const driftX = Math.cos(c.ambientDriftAngle) * 0.25;
          const driftY = Math.sin(c.ambientDriftAngle * 0.8) * 0.25;

          // Apply Gravity Modes
          if (gravityMode === 'antigravity' && (mouse.x > 0 || mouse.y > 0)) {
            const dx = c.x - mouse.x;
            const dy = c.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 260 && dist > 1) {
              const repelForce = (1 - dist / 260) * 45;
              c.vx += (dx / dist) * repelForce * dt * 25;
              c.vy += (dy / dist) * repelForce * dt * 25;
            }
          } else if (gravityMode === 'vortex' && (mouse.x > 0 || mouse.y > 0)) {
            const dx = mouse.x - c.x;
            const dy = mouse.y - c.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 20) {
              // Pull toward vortex + tangential spin
              const attract = Math.min(30, (350 / dist) * 18);
              c.vx += (dx / dist) * attract * dt * 20;
              c.vy += (dy / dist) * attract * dt * 20;
              // Swirl
              c.vx += (-dy / dist) * 14 * dt * 20;
              c.vy += (dx / dist) * 14 * dt * 20;
            }
          }

          // Inertial Integration
          c.vx += driftX * dt * 10;
          c.vy += driftY * dt * 10;
          c.x += c.vx * dt * 60;
          c.y += c.vy * dt * 60;
          c.z += c.vz * dt * 60;

          // Angular momentum
          c.rx += c.avx;
          c.ry += c.avy;
          c.rz += c.avz;

          // Soft air damping
          c.vx *= 0.985;
          c.vy *= 0.985;
          c.vz *= 0.985;
          c.avx *= 0.992;
          c.avy *= 0.992;
          c.avz *= 0.992;

          // Soft Boundary Bounces (Left, Right, Top, Bottom, Z)
          const pad = c.radius * 0.9;
          const bounceRestitution = -0.78;

          if (c.x < pad) {
            c.x = pad;
            c.vx *= bounceRestitution;
            c.avz += 0.04;
          } else if (c.x > width - pad) {
            c.x = width - pad;
            c.vx *= bounceRestitution;
            c.avz -= 0.04;
          }

          if (c.y < pad) {
            c.y = pad;
            c.vy *= bounceRestitution;
            c.avx += 0.04;
          } else if (c.y > height - pad) {
            c.y = height - pad;
            c.vy *= bounceRestitution;
            c.avx -= 0.04;
          }

          if (c.z < -140) {
            c.z = -140;
            c.vz *= bounceRestitution;
          } else if (c.z > 140) {
            c.z = 140;
            c.vz *= bounceRestitution;
          }
        }
      }

      // 3. Pairwise Elastic Collisions
      for (let i = 0; i < numCrystals; i++) {
        for (let j = i + 1; j < numCrystals; j++) {
          const c1 = crystals[i];
          const c2 = crystals[j];

          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const dz = c2.z - c1.z;
          const dist = Math.hypot(dx, dy, dz);
          const minDist = (c1.radius + c2.radius) * 0.78;

          if (dist < minDist && dist > 0.001) {
            // Collision normal
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = dz / dist;

            // Separate bodies to prevent sticking
            const overlap = (minDist - dist) * 0.5;
            if (c1 !== dragged) {
              c1.x -= nx * overlap;
              c1.y -= ny * overlap;
              c1.z -= nz * overlap;
            }
            if (c2 !== dragged) {
              c2.x += nx * overlap;
              c2.y += ny * overlap;
              c2.z += nz * overlap;
            }

            // Relative velocity
            const kx = c1.vx - c2.vx;
            const ky = c1.vy - c2.vy;
            const kz = c1.vz - c2.vz;
            const p = 2 * (nx * kx + ny * ky + nz * kz) / (c1.mass + c2.mass);

            const impactSpeed = Math.hypot(kx, ky, kz);

            if (c1 !== dragged) {
              c1.vx -= p * c2.mass * nx * 0.88;
              c1.vy -= p * c2.mass * ny * 0.88;
              c1.vz -= p * c2.mass * nz * 0.88;
              c1.avx += (Math.random() - 0.5) * 0.04;
              c1.avy += (Math.random() - 0.5) * 0.04;
            }
            if (c2 !== dragged) {
              c2.vx += p * c1.mass * nx * 0.88;
              c2.vy += p * c1.mass * ny * 0.88;
              c2.vz += p * c1.mass * nz * 0.88;
              c2.avx += (Math.random() - 0.5) * 0.04;
              c2.avy += (Math.random() - 0.5) * 0.04;
            }

            // Audio chime & visual spark on noticeable impact
            if (impactSpeed > 1.2) {
              triggerCrystalChime((c1.scale + c2.scale) / 2);

              // Optical shockwave ripple at impact center
              ripplesRef.current.push({
                x: (c1.x + c2.x) / 2,
                y: (c1.y + c2.y) / 2,
                radius: 4,
                maxRadius: 38 + Math.min(50, impactSpeed * 8),
                opacity: 0.8,
                color: palette.secondary,
              });
            }
          }
        }
      }

      // 4. Render Crystals with Depth Sort (Painter's Algorithm)
      const sortedCrystals = [...crystals].sort((a, b) => a.z - b.z);

      for (let i = 0; i < sortedCrystals.length; i++) {
        const c = sortedCrystals[i];
        const isTarget = c === dragged;

        // Camera perspective factor
        const fov = 480;
        const perspective = fov / (fov + c.z);
        const screenX = c.x;
        const screenY = c.y;
        const currentScale = c.scale * perspective * (isTarget ? 1.08 : 1.0);

        ctx.save();
        ctx.translate(screenX, screenY);

        if (c.geo.type === 'orb') {
          // RENDER SPHERICAL GLASS ORB
          const r = currentScale * 0.95;

          // Ambient outer glass glow
          const outerGlow = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 1.3);
          outerGlow.addColorStop(0, 'rgba(0,0,0,0)');
          outerGlow.addColorStop(0.8, palette.glow);
          outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = outerGlow;
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
          ctx.fill();

          // Glass Body Gradient (Frosted & Refractive Core)
          const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.08, 0, 0, r);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.12)');
          grad.addColorStop(0.7, palette.glow);
          grad.addColorStop(0.92, 'rgba(255, 255, 255, 0.28)');
          grad.addColorStop(1, palette.secondary);

          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Prismatic Dispersion Rim Stroke
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = palette.dispersionA;
          ctx.stroke();

          // High Specular Reflection Glare
          ctx.beginPath();
          ctx.ellipse(-r * 0.35, -r * 0.38, r * 0.35, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
          ctx.fill();

          // Subtle Caustic Ring
          ctx.beginPath();
          ctx.ellipse(r * 0.25, r * 0.25, r * 0.45, r * 0.2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fill();

        } else {
          // RENDER FACETED 3D CRYSTAL
          const { vertices, faces } = c.geo;

          // Rotate and project 3D vertices
          const transformedVerts = vertices.map((v) => {
            const rot = rotatePoint(v, c.rx, c.ry, c.rz);
            return [rot[0] * currentScale, rot[1] * currentScale, rot[2] * currentScale];
          });

          // Sort faces by Z-depth (back-to-front rendering)
          const sortedFaces = faces
            .map((faceIndices) => {
              const p0 = transformedVerts[faceIndices[0]];
              const p1 = transformedVerts[faceIndices[1]];
              const p2 = transformedVerts[faceIndices[2]];

              const normal = computeNormal(p0, p1, p2);
              const avgZ = (p0[2] + p1[2] + p2[2]) / 3;

              return { faceIndices, normal, avgZ, p0, p1, p2 };
            })
            .sort((a, b) => a.avgZ - b.avgZ);

          // Draw Ambient Prismatic Core Aura
          const auraRadius = currentScale * 1.15;
          const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, auraRadius);
          auraGrad.addColorStop(0, palette.glow);
          auraGrad.addColorStop(0.7, 'rgba(255,255,255,0.02)');
          auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
          ctx.fill();

          // Render each crystalline facet
          sortedFaces.forEach(({ faceIndices, normal, p0 }) => {
            // Lighting calculation
            const dotL = normal[0] * L[0] + normal[1] * L[1] + normal[2] * L[2];
            const dotBL = normal[0] * BL[0] + normal[1] * BL[1] + normal[2] * BL[2];

            // Camera view vector is [0, 0, 1]
            const viewDot = Math.max(0, normal[2]);

            // Fresnel refraction effect (rim is more reflective than center)
            const fresnel = 0.2 + 0.8 * Math.pow(1 - Math.abs(normal[2]), 3);

            // Specular highlight exponent
            const spec = Math.pow(Math.max(0, dotL), 24);
            const fillLight = Math.max(0, dotBL) * 0.35;
            const diffuse = Math.max(0.08, dotL * 0.6 + 0.15) + fillLight;

            // Generate chromatic facet tone
            const alpha = Math.min(0.85, Math.max(0.18, 0.28 + fresnel * 0.45));
            const baseColor = normal[0] > 0 ? palette.primary : palette.secondary;

            // Draw Facet Polygon
            ctx.beginPath();
            ctx.moveTo(p0[0], p0[1]);
            for (let k = 1; k < faceIndices.length; k++) {
              const pt = transformedVerts[faceIndices[k]];
              ctx.lineTo(pt[0], pt[1]);
            }
            ctx.closePath();

            // Facet Surface Fill (Glass Shader)
            const facetGrad = ctx.createLinearGradient(p0[0], p0[1], -p0[0], -p0[1]);
            facetGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.75, 0.15 + spec * 0.8)})`);
            facetGrad.addColorStop(0.5, `${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            facetGrad.addColorStop(1, `rgba(15, 23, 42, ${Math.min(0.65, 0.2 + fresnel * 0.3)})`);

            ctx.fillStyle = facetGrad;
            ctx.fill();

            // Prismatic Edge Strokes with Chromatic Dispersion
            ctx.lineWidth = 1.1;
            ctx.strokeStyle = spec > 0.4 ? palette.specular : (normal[2] > 0.3 ? palette.dispersionA : palette.dispersionB);
            ctx.stroke();

            // Specular Glint Star on dominant highlight
            if (spec > 0.82 && normal[2] > 0.4) {
              ctx.save();
              ctx.translate(p0[0], p0[1]);
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.arc(0, 0, 2.5 + spec * 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          });
        }

        ctx.restore();
      }
    };

    renderLoop(performance.now());

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [initCrystals, triggerCrystalChime, palette, gravityMode, crystalCount]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    mousePosRef.current = {
      x,
      y,
      isDown: true,
      vx: 0,
      vy: 0,
      prevX: x,
      prevY: y,
    };

    // Find nearest crystal under cursor
    let found = null;
    let minDist = Infinity;

    crystalsRef.current.forEach((c) => {
      const dist = Math.hypot(c.x - x, c.y - y);
      if (dist < c.radius * 1.25 && dist < minDist) {
        minDist = dist;
        found = c;
      }
    });

    if (found) {
      draggedCrystalRef.current = found;
      soundFx.playClick();
      setInteractionHint('Crystal captured • Drag to position, release to fling with momentum');
    } else {
      // Tap on empty space creates water ripple
      ripplesRef.current.push({
        x,
        y,
        radius: 5,
        maxRadius: 180,
        opacity: 0.9,
        color: palette.primary,
      });
      soundFx.playClick();
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    mousePosRef.current.x = x;
    mousePosRef.current.y = y;
  };

  const handlePointerUp = () => {
    const dragged = draggedCrystalRef.current;
    if (dragged) {
      // Impart throw momentum
      const mouse = mousePosRef.current;
      dragged.vx = Math.max(-28, Math.min(28, mouse.vx * 0.75));
      dragged.vy = Math.max(-28, Math.min(28, mouse.vy * 0.75));
      dragged.vz = (Math.random() - 0.5) * 8;
      dragged.avx = (Math.random() - 0.5) * 0.12;
      dragged.avy = (Math.random() - 0.5) * 0.12;

      triggerCrystalChime(dragged.scale);
      draggedCrystalRef.current = null;
      setInteractionHint('Crystal flung into zero gravity • Watch light refract as it drifts');
    }
    mousePosRef.current.isDown = false;
  };

  // Add extra crystal
  const handleAddCrystal = () => {
    soundFx.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const geo = GEOMETRY_CHOICES[crystalsRef.current.length % GEOMETRY_CHOICES.length];
    const baseRadius = Math.max(34, Math.min(62, Math.min(w, h) * 0.08));
    const scale = baseRadius * (0.7 + Math.random() * 0.7);

    crystalsRef.current.push({
      id: Date.now(),
      geo,
      scale,
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: h / 2 + (Math.random() - 0.5) * 80,
      z: 0,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      vz: (Math.random() - 0.5) * 3,
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      avx: (Math.random() - 0.5) * 0.04,
      avy: (Math.random() - 0.5) * 0.04,
      avz: (Math.random() - 0.5) * 0.04,
      mass: scale / 40,
      radius: scale,
      colorPhase: Math.random() * Math.PI * 2,
      ambientDriftAngle: Math.random() * Math.PI * 2,
    });

    setCrystalCount(crystalsRef.current.length);
    triggerCrystalChime(scale);
    setInteractionHint('New optical crystal materialized in zero-G void');
  };

  return (
    <section
      id="crystal-sanctuary"
      ref={containerRef}
      className={cn(
        'py-20 md:py-32 relative overflow-hidden bg-bg-primary transition-all duration-300',
        isFullscreen && 'fixed inset-0 z-50 py-4 md:py-6 h-screen w-screen bg-bg-primary/95 backdrop-blur-2xl'
      )}
    >
      {/* Background Volumetric Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-500" style={{ background: palette.bgGradient }} />

      <div className={cn('max-w-7xl mx-auto px-5 sm:px-8 relative z-10', isFullscreen && 'h-full flex flex-col max-w-none px-4 sm:px-6')}>
        
        {/* Section Header */}
        {!isFullscreen && (
          <RevealOnScroll delay={0.05}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
              <div>
                <SectionHeading
                  eyebrow="ZERO-GRAVITY KINETIC ART"
                  title="Floating Glass & Crystal Sanctuary"
                  description="A purely sensory, non-technical optical sandbox. Direct physics manipulation in weightless space—grab, fling, and collide refractive crystals, prisms, and gems to watch light scatter in real time."
                />
              </div>

              {/* Status Indicator */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0">
                <div className="inline-flex items-center gap-2 bg-bg-secondary/90 border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-text-primary font-medium">Physics: Weightless Zero-G</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-bg-secondary/90 border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary shadow-sm">
                  <span className="text-accent">Crystals:</span>
                  <span className="text-text-primary font-semibold">{crystalCount}</span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* Interactive Controls Bar */}
        <RevealOnScroll delay={0.08}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4 p-3 rounded-2xl bg-bg-secondary/80 border border-border-default backdrop-blur-xl shadow-lg">
            
            {/* Color Palette Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider mr-1 hidden sm:inline">
                Light Spectrum:
              </span>
              {Object.values(PALETTES).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActivePalette(p.id);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl font-mono text-xs font-medium transition-all duration-200 flex items-center gap-2 border',
                    activePalette === p.id
                      ? 'bg-bg-tertiary text-text-primary border-accent shadow-sm'
                      : 'bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-tertiary/50'
                  )}
                  title={p.desc}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Gravity & Interaction Modes */}
            <div className="flex items-center gap-2 flex-wrap ml-auto">
              {/* Gravity Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-bg-tertiary/70 border border-border-subtle">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setGravityMode('zero_g');
                    setInteractionHint('Zero-G mode: Crystals float freely and conserve momentum');
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-mono transition-colors',
                    gravityMode === 'zero_g' ? 'bg-bg-primary text-text-primary font-semibold shadow-xs' : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  Zero-G
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setGravityMode('antigravity');
                    setInteractionHint('Antigravity field: Move cursor to push crystals away');
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-mono transition-colors',
                    gravityMode === 'antigravity' ? 'bg-bg-primary text-text-primary font-semibold shadow-xs' : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  Repel Shield
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setGravityMode('vortex');
                    setInteractionHint('Singularity vortex: Move cursor to pull crystals into orbit');
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-mono transition-colors',
                    gravityMode === 'vortex' ? 'bg-bg-primary text-text-primary font-semibold shadow-xs' : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  Vortex
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={triggerGravitationalWave}
                className="px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 font-mono text-xs transition-all flex items-center gap-1.5 active:scale-95"
                title="Release an explosive gravitational wave across space"
              >
                <span>💥</span>
                <span className="hidden sm:inline">Gravity Pulse</span>
              </button>

              <button
                type="button"
                onClick={handleAddCrystal}
                className="px-3 py-1.5 rounded-xl bg-bg-tertiary border border-border-default text-text-primary hover:border-accent/40 font-mono text-xs transition-all flex items-center gap-1.5 active:scale-95"
                title="Materialize a new crystal"
              >
                <span>✨</span>
                <span>+ Gem</span>
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  const newMuted = !isAudioMuted;
                  setIsAudioMuted(newMuted);
                  soundFx.setMuted(newMuted);
                  if (!newMuted) {
                    soundFx.playCrystalChime(1.2);
                  }
                }}
                className={cn(
                  'p-2 rounded-xl border font-mono text-xs transition-all',
                  !isAudioMuted
                    ? 'bg-functional-success/15 border-functional-success/35 text-functional-success'
                    : 'bg-bg-tertiary border-border-default text-text-muted hover:text-text-primary'
                )}
                title={isAudioMuted ? 'Unmute crystalline collision chimes' : 'Mute collision audio'}
                aria-label="Toggle crystalline sound effects"
              >
                {!isAudioMuted ? '🔔' : '🔕'}
              </button>

              {/* Fullscreen Zen Mode */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setIsFullscreen((prev) => !prev);
                }}
                className="p-2 rounded-xl bg-bg-tertiary border border-border-default text-text-secondary hover:text-text-primary transition-all font-mono text-xs"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Zen Sanctuary'}
                aria-label="Toggle fullscreen zen mode"
              >
                {isFullscreen ? '✕' : '⛶'}
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3D Glass Physics Canvas Container */}
        <div
          className={cn(
            'relative rounded-[2rem] overflow-hidden border border-border-default bg-bg-secondary/40 shadow-2xl backdrop-blur-2xl transition-all duration-300',
            isFullscreen ? 'flex-1 h-full min-h-0' : 'h-[520px] sm:h-[620px]'
          )}
        >
          {/* Subtle Ambient Corner Accents */}
          <div className="absolute top-4 left-6 z-20 pointer-events-none flex items-center gap-3 font-mono text-xs text-text-muted select-none">
            <span className="w-2 h-2 rounded-full bg-accent/80 animate-pulse" />
            <span className="uppercase tracking-widest text-[11px] font-semibold text-text-secondary">
              Zero-G Physics Space
            </span>
            <span className="text-text-muted/60">·</span>
            <span className="text-[11px] text-accent/90">{interactionHint}</span>
          </div>

          {/* Canvas Element */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none block"
            style={{ touchAction: 'none' }}
          />

          {/* Bottom Floating Helper Touch Bar */}
          <div className="absolute bottom-4 inset-x-6 z-20 pointer-events-none flex items-center justify-between font-mono text-[11px] text-text-muted select-none">
            <div className="flex items-center gap-2 bg-bg-primary/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-subtle shadow-xs">
              <span>✦</span>
              <span>Refractive Facets & Caustic Dispersion Engine</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-bg-primary/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-subtle shadow-xs">
              <span>🖱️ Fling with mouse momentum</span>
              <span className="text-border-default">|</span>
              <span>🎵 Crystalline Harmonics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
