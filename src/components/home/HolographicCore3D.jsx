'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

// ==========================================
// 3D THEMES & VISUAL PRESETS
// ==========================================
const VISUAL_MODES = [
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    icon: '🌌',
    description: 'Bioluminescent violet and electric cyan particle matrix with gravitational web.',
    primaryColor: '#8b5cf6', // Violet
    secondaryColor: '#06b6d4', // Cyan
    accentGlow: 'rgba(139, 92, 246, 0.25)',
    particleCount: 320,
    connectDistance: 48,
    speed: 1.0,
  },
  {
    id: 'quantum',
    name: 'Quantum Core',
    icon: '⚡',
    description: 'High-frequency emerald and deep indigo lattice with orbital energy rings.',
    primaryColor: '#10b981', // Emerald
    secondaryColor: '#6366f1', // Indigo
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    particleCount: 280,
    connectDistance: 54,
    speed: 1.25,
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    icon: '🔥',
    description: 'Kinetic amber and radiant ruby particle storm with pulsating coronal flares.',
    primaryColor: '#f59e0b', // Amber
    secondaryColor: '#ef4444', // Red
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    particleCount: 340,
    connectDistance: 44,
    speed: 1.1,
  },
];

export default function HolographicCore3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Active theme
  const [activeMode, setActiveMode] = useState(VISUAL_MODES[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [fps, setFps] = useState(60);

  // 3D Rotation & Physics Refs
  const rotRef = useRef({ x: 0.2, y: 0.4 });
  const targetRotRef = useRef({ x: 0.2, y: 0.4 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });
  const shockwavesRef = useRef([]);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Generate 3D Fibonacci Sphere Particles
  const initParticles = useCallback((mode) => {
    const pts = [];
    const count = mode.particleCount;
    const radius = 175; // Sphere base radius

    const phi = Math.PI * (Math.sqrt(5) - 1); // Golden ratio angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radAtY;
      const z = Math.sin(theta) * radAtY;

      // Color variation between primary & secondary
      const ratio = i / count;
      const baseRadius = radius * (0.92 + Math.random() * 0.16);

      pts.push({
        origX: x * baseRadius,
        origY: y * baseRadius,
        origZ: z * baseRadius,
        x: x * baseRadius,
        y: y * baseRadius,
        z: z * baseRadius,
        vx: 0,
        vy: 0,
        vz: 0,
        size: 1.8 + Math.random() * 1.6,
        ratio,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = pts;
  }, []);

  // Update particles on mode switch
  useEffect(() => {
    initParticles(activeMode);
  }, [activeMode, initParticles]);

  // Main Canvas 3D Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // FPS Counter
      frameCounter++;
      if (time - fpsTimer > 1000) {
        setFps(Math.round((frameCounter * 1000) / (time - fpsTimer)));
        frameCounter = 0;
        fpsTimer = time;
      }

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Auto-rotation when not dragging
      if (!isDraggingRef.current) {
        targetRotRef.current.y += 0.45 * dt * activeMode.speed;
        targetRotRef.current.x += Math.sin(time * 0.0008) * 0.08 * dt;

        // Apply inertia decay
        targetRotRef.current.y += velocityRef.current.x;
        targetRotRef.current.x += velocityRef.current.y;
        velocityRef.current.x *= 0.94;
        velocityRef.current.y *= 0.94;
      }

      // Smooth damping toward target rotation
      rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * 0.08;
      rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * 0.08;

      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);

      const fov = 420;
      const mouse = mousePosRef.current;

      // 1. Draw Central Volumetric Core Glow
      const coreBreath = 1 + Math.sin(time * 0.003) * 0.08;
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        140 * coreBreath
      );
      coreGrad.addColorStop(0, `${activeMode.primaryColor}35`);
      coreGrad.addColorStop(0.4, `${activeMode.secondaryColor}15`);
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 140 * coreBreath, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // 2. Project Particles to 3D Space & Apply Elastic Physics
      const projected = [];
      const pts = particlesRef.current;

      // Update Shockwaves
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 280 * dt;
        sw.opacity -= 1.1 * dt;
        if (sw.opacity <= 0 || sw.radius > 320) {
          shockwavesRef.current.splice(s, 1);
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Harmonic organic breathing on vertices
        const breath = Math.sin(time * 0.002 + p.pulseOffset) * 4.5;
        const targetX = p.origX + (p.origX / 175) * breath;
        const targetY = p.origY + (p.origY / 175) * breath;
        const targetZ = p.origZ + (p.origZ / 175) * breath;

        // Shockwave impact
        for (let s = 0; s < shockwavesRef.current.length; s++) {
          const sw = shockwavesRef.current[s];
          const distFromCenter = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
          const diff = Math.abs(distFromCenter - sw.radius);
          if (diff < 28) {
            const push = (1 - diff / 28) * 35 * sw.opacity;
            p.x += (p.x / distFromCenter) * push;
            p.y += (p.y / distFromCenter) * push;
            p.z += (p.z / distFromCenter) * push;
          }
        }

        // Spring restitution toward origin
        p.vx = (p.vx + (targetX - p.x) * 0.08) * 0.88;
        p.vy = (p.vy + (targetY - p.y) * 0.08) * 0.88;
        p.vz = (p.vz + (targetZ - p.z) * 0.08) * 0.88;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 3D Rotation Matrix Calculation
        // Rotate around X
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;
        // Rotate around Y
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;

        // Perspective Projection
        const scale = fov / (fov + z2);
        const projX = centerX + x2 * scale;
        const projY = centerY + y1 * scale;

        // Mouse displacement on 2D plane
        let mouseDist = 999;
        if (mouse.active) {
          const dx = projX - mouse.x;
          const dy = projY - mouse.y;
          mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < 85) {
            const factor = (1 - mouseDist / 85) * 18;
            p.vx += (dx / mouseDist) * factor;
            p.vy += (dy / mouseDist) * factor;
          }
        }

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          scale,
          size: p.size * scale,
          ratio: p.ratio,
          mouseDist,
        });
      }

      // Depth sort (Back-to-front rendering for crisp occlusion)
      projected.sort((a, b) => a.z - b.z);

      // 3. Draw Connecting Luminous Constellation Lines
      ctx.lineWidth = 0.75;
      const maxDist = activeMode.connectDistance;

      for (let i = 0; i < projected.length; i += 2) {
        const p1 = projected[i];
        if (p1.z < -60) continue; // Skip deep background lines for crisp clarity

        for (let j = i + 1; j < Math.min(i + 14, projected.length); j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 4. Render Orbital Energy Ring (Cyber Gyroscope)
      const ringRadius = 195;
      const ringSteps = 64;
      ctx.beginPath();
      for (let r = 0; r <= ringSteps; r++) {
        const theta = (r / ringSteps) * Math.PI * 2;
        const rx = Math.cos(theta) * ringRadius;
        const ry = 0;
        const rz = Math.sin(theta) * ringRadius;

        // Inclined 35-degree tilt
        const tiltX = rx;
        const tiltY = ry * Math.cos(0.55) - rz * Math.sin(0.55);
        const tiltZ = ry * Math.sin(0.55) + rz * Math.cos(0.55);

        // Apply main sphere rotation
        const yRot1 = tiltY * cosX - tiltZ * sinX;
        const zRot1 = tiltY * sinX + tiltZ * cosX;
        const xRot2 = tiltX * cosY + zRot1 * sinY;
        const zRot2 = -tiltX * sinY + zRot1 * cosY;

        const rScale = fov / (fov + zRot2);
        const px = centerX + xRot2 * rScale;
        const py = centerY + yRot1 * rScale;

        if (r === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `${activeMode.secondaryColor}28`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 5. Draw Glowing 3D Particles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(Math.max((p.z + 180) / 360, 0.15), 1);

        // Choose color blend based on node ratio
        const color = p.ratio > 0.5 ? activeMode.primaryColor : activeMode.secondaryColor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;

        // Add soft glow aura to prominent foreground nodes
        if (p.z > 40) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10 * p.scale;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // 6. Draw Shockwaves Expanding in 3D Space
      for (let s = 0; s < shockwavesRef.current.length; s++) {
        const sw = shockwavesRef.current[s];
        ctx.beginPath();
        ctx.arc(centerX, centerY, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${activeMode.primaryColor}${Math.floor(sw.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeMode]);

  // Pointer Interaction Handlers (Mouse Drag & Orbit)
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotRef.current.x,
      rotY: rotRef.current.y,
    };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };

    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newRotY = dragStartRef.current.rotY + deltaX * 0.0075;
      const newRotX = dragStartRef.current.rotX - deltaY * 0.0075;

      velocityRef.current = {
        x: (newRotY - targetRotRef.current.y) * 0.35,
        y: (newRotX - targetRotRef.current.x) * 0.35,
      };

      targetRotRef.current.y = newRotY;
      targetRotRef.current.x = Math.max(Math.min(newRotX, Math.PI / 2.2), -Math.PI / 2.2);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    mousePosRef.current.active = false;
    setIsHovered(false);
  };

  // Click Trigger Shockwave Pulse
  const triggerPulse = () => {
    setPulseCount((prev) => prev + 1);
    shockwavesRef.current.push({
      radius: 20,
      opacity: 1,
    });
  };

  return (
    <section id="creative-lab" className="py-20 md:py-28 relative overflow-hidden bg-bg-primary">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] blur-[160px] rounded-full transition-colors duration-700"
          style={{ backgroundColor: activeMode.accentGlow }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <RevealOnScroll delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <SectionHeading
                eyebrow="CREATIVE LAB · 3D INTERACTIVE"
                title="Curiosity in Motion"
                description="An interactive 3D playground celebrating creative engineering, fluid motion, and continuous learning. Drag to rotate, click to pulse, or switch particle modes."
              />
            </div>

            {/* Performance Indicators */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="inline-flex items-center gap-2 bg-bg-secondary/80 border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse" />
                <span className="text-text-primary font-medium">{fps} FPS Smooth</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-bg-secondary/80 border border-border-default px-3.5 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="text-accent">✦</span>
                <span className="text-text-primary font-semibold">{activeMode.particleCount} Nodes</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* ========================================================
            MAIN 3D INTERACTIVE STAGE & WORKSPACE
        ======================================================== */}
        <RevealOnScroll delay={0.1}>
          <div
            ref={containerRef}
            className="relative rounded-3xl bg-bg-secondary/70 border border-border-default shadow-2xl backdrop-blur-xl overflow-hidden p-6 sm:p-8"
          >
            {/* Top Interactive Mode Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                  Visual Particle Preset:
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {VISUAL_MODES.map((mode) => {
                  const isSelected = mode.id === activeMode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setActiveMode(mode)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all duration-300 flex items-center gap-2 border',
                        isSelected
                          ? 'bg-accent/15 border-accent text-text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.03]'
                          : 'bg-bg-tertiary/60 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-bg-tertiary'
                      )}
                    >
                      <span>{mode.icon}</span>
                      <span>{mode.name}</span>
                    </button>
                  );
                })}

                {/* Shockwave Trigger Button */}
                <button
                  onClick={triggerPulse}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold bg-accent text-white hover:bg-accent-hover shadow-accent transition-all duration-200 active:scale-95 flex items-center gap-2 ml-auto sm:ml-2"
                >
                  <span>✦</span>
                  <span>Pulse Shockwave</span>
                </button>
              </div>
            </div>

            {/* 3D Canvas Viewport */}
            <div
              className="relative w-full h-[460px] sm:h-[520px] rounded-2xl bg-[#08080d] border border-white/[0.04] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              onMouseEnter={() => setIsHovered(true)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onClick={triggerPulse}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />

              {/* Floating Interaction Hint */}
              <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 font-mono text-[11px] text-text-muted bg-bg-secondary/70 border border-border-subtle px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>Drag to orbit · Click to trigger kinetic shockwave</span>
              </div>

              {/* Active Mode Details Badge */}
              <div className="absolute top-4 right-4 pointer-events-none hidden sm:flex items-center gap-2 font-mono text-xs text-text-secondary bg-bg-secondary/80 border border-border-subtle px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <span>Mode:</span>
                <span className="text-text-primary font-bold">{activeMode.name}</span>
              </div>
            </div>

            {/* Footer Summary / Personality Notes */}
            <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-text-secondary">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-accent font-semibold">{activeMode.icon} {activeMode.name}:</span>
                <span className="text-text-muted line-clamp-1">{activeMode.description}</span>
              </div>

              <div className="font-mono text-text-muted text-[11px] shrink-0">
                Shockwaves Dispatched: <span className="text-text-primary font-semibold">{pulseCount}</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
