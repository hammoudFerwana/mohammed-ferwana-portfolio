'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { soundFx } from '@/lib/soundFx';

// Architectural hierarchy: 3-Tier Isometric Monolith
const ARCHITECTURE_TIERS = [
  {
    id: 'ingress',
    name: 'Edge & Ingress Tier',
    shortName: 'EDGE / INGRESS',
    tag: 'TIER 1 · EDGE',
    description: 'Reverse proxying, SSL termination, DDoS rate limiting, and stateless JWT authorization.',
    yLevel: -110,
    accentColor: '#8b5cf6',
    nodes: [
      {
        id: 'gw',
        name: 'API Gateway & Ingress',
        label: 'API GATEWAY',
        role: 'Reverse Proxy & Traffic Router',
        tierId: 'ingress',
        color: '#8b5cf6',
        pos: [-90, -110, 0],
        metrics: { latency: '1.2ms', throughput: '2,400 req/s', status: 'HEALTHY' },
        details: 'Handles SSL termination, IP throttling, and routing to authenticated micro-services with zero cold-starts.',
        protocol: 'HTTP/2 & TLS 1.3',
      },
      {
        id: 'auth',
        name: 'Stateless RBAC Guard',
        label: 'AUTH / RBAC',
        role: 'JWT & Permission Matrix',
        tierId: 'ingress',
        color: '#ec4899',
        pos: [90, -110, 0],
        metrics: { latency: '0.8ms', throughput: '1,950 req/s', status: 'SHIELDED' },
        details: 'Validates cryptographic bearer tokens and declarative role privileges before requests touch business logic.',
        protocol: 'RS256 JWT Verify',
      },
    ],
  },
  {
    id: 'core',
    name: 'Atomic Core & Cache Tier',
    shortName: 'ATOMIC CORE',
    tag: 'TIER 2 · EXECUTION',
    description: 'Finite State Machine coordination, atomic transactional consistency, and sub-millisecond query acceleration.',
    yLevel: 0,
    accentColor: '#a855f7',
    nodes: [
      {
        id: 'fsm',
        name: 'Claim FSM Lifecycle Engine',
        label: 'FSM CORE',
        role: 'Finite State Machine Coordinator',
        tierId: 'core',
        color: '#a855f7',
        pos: [-70, 0, 0],
        metrics: { latency: '3.4ms', states: '10 Valid States', status: 'ATOMIC' },
        details: 'Guarantees valid transitions across claim states; strictly rejects unauthorized stage skipping with deterministic audit logs.',
        protocol: 'Atomic In-Memory FSM',
      },
      {
        id: 'cache',
        name: 'Distributed Redis Cache',
        label: 'REDIS CACHE',
        role: 'In-Memory Sub-millisecond Store',
        tierId: 'core',
        color: '#3b82f6',
        pos: [90, 0, 0],
        metrics: { latency: '0.4ms', hitRate: '94.2%', status: 'WARM' },
        details: 'Caches idempotent GET endpoints and session counters with automated TTL eviction and cluster replication.',
        protocol: 'RESP3 / In-Memory',
      },
    ],
  },
  {
    id: 'persistence',
    name: 'Persistence & Event Tier',
    shortName: 'STORAGE & EVENTS',
    tag: 'TIER 3 · DURABILITY',
    description: 'ACID database guarantees, compound index clustering, and non-blocking asynchronous event distribution.',
    yLevel: 110,
    accentColor: '#10b981',
    nodes: [
      {
        id: 'db',
        name: 'MongoDB Replica Shard',
        label: 'MONGODB SHARD',
        role: 'Document Store & Compound Indices',
        tierId: 'persistence',
        color: '#10b981',
        pos: [-80, 110, 0],
        metrics: { latency: '4.8ms', pool: '128 pooled', status: 'INDEXED' },
        details: 'Optimized schema models with compound indexes ({ orgId: 1, status: 1, createdAt: -1 }) ensuring zero unindexed collection scans.',
        protocol: 'MongoDB WiredTiger',
      },
      {
        id: 'queue',
        name: 'Async Event Queue Worker',
        label: 'EVENT WORKER',
        role: 'Transactional Outbox & Notifications',
        tierId: 'persistence',
        color: '#f59e0b',
        pos: [80, 110, 0],
        metrics: { latency: '1.1ms', ackRate: '99.9%', status: 'DRAINING' },
        details: 'Asynchronous event worker decoupling audit logs, third-party webhooks, and email dispatch from primary HTTP request loops.',
        protocol: 'AMQP / RabbitMQ',
      },
    ],
  },
];

// High-speed interconnected 3D topology conduit links
const TOPOLOGY_CONDUITS = [
  { from: 'gw', to: 'auth', color: '#8b5cf6' },
  { from: 'auth', to: 'fsm', color: '#ec4899' },
  { from: 'fsm', to: 'cache', color: '#a855f7' },
  { from: 'fsm', to: 'db', color: '#10b981' },
  { from: 'fsm', to: 'queue', color: '#f59e0b' },
  { from: 'cache', to: 'db', color: '#3b82f6' },
];

const ALL_NODES = ARCHITECTURE_TIERS.flatMap((t) => t.nodes);

export default function DistributedSystem3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // States
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState('fsm');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [telemetryTick, setTelemetryTick] = useState(0);

  // 3D Isometric Projection & Physics Refs
  const rotRef = useRef({ x: 0.28, y: 0.45 });
  const targetRotRef = useRef({ x: 0.28, y: 0.45 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, time: 0 });
  const lastPointerPosRef = useRef({ x: 0, y: 0, time: 0 });

  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);
  const shockwavesRef = useRef([]);

  const selectedNode = useMemo(
    () => ALL_NODES.find((n) => n.id === selectedNodeId) || ALL_NODES[2],
    [selectedNodeId]
  );

  useEffect(() => {
    setIsClient(true);
    setIsMuted(soundFx.isMuted());
  }, []);

  // Cycle telemetry clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 1000);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Initialize photon particles flowing along conduits
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 40; i++) {
      const conduit = TOPOLOGY_CONDUITS[i % TOPOLOGY_CONDUITS.length];
      particles.push({
        conduit,
        progress: Math.random(),
        speed: 0.0035 + Math.random() * 0.0035,
        size: 2.2 + Math.random() * 1.6,
        trail: [], // Comet history
      });
    }
    particlesRef.current = particles;
  }, []);

  // Main 3D Canvas Isometric Rendering Engine
  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Isometric projection math
    const project = (x, y, z, width, height) => {
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);
      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);

      // Rotate around Y
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate around X
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      // Isometric camera distance
      const cameraDist = 650;
      const scale = cameraDist / (cameraDist + z2);
      const projX = width / 2 + x1 * scale;
      const projY = height / 2 + y2 * scale;

      return { x: projX, y: projY, z: z2, scale };
    };

    let lastTime = performance.now();

    // Render Loop
    const render = (time) => {
      animFrameRef.current = requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Physics: Throw Inertia & Momentum Damping
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
          rotRef.current.x += velocityRef.current.x;
          rotRef.current.y += velocityRef.current.y;
          targetRotRef.current.x = rotRef.current.x;
          targetRotRef.current.y = rotRef.current.y;

          // Clamp X elevation angle
          rotRef.current.x = Math.max(0.08, Math.min(0.62, rotRef.current.x));

          // Exponential friction damping
          velocityRef.current.x *= 0.94;
          velocityRef.current.y *= 0.94;
        } else if (isAutoRotating) {
          targetRotRef.current.y += 0.0028;
          rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * 0.08;
          rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * 0.08;
        } else {
          rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * 0.08;
          rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * 0.08;
        }
      }

      // 1. Draw 3D Floating Glass Tier Slabs
      ARCHITECTURE_TIERS.forEach((tier) => {
        const isTierActive = selectedTier === 'all' || selectedTier === tier.id;
        const opacity = isTierActive ? 1 : 0.22;

        const slabWidth = 240;
        const slabDepth = 140;
        const y = tier.yLevel;

        const p1 = project(-slabWidth, y, -slabDepth, width, height);
        const p2 = project(slabWidth, y, -slabDepth, width, height);
        const p3 = project(slabWidth, y, slabDepth, width, height);
        const p4 = project(-slabWidth, y, slabDepth, width, height);

        // Glass Slab Surface Fill
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        ctx.fillStyle = isTierActive ? 'rgba(255, 255, 255, 0.015)' : 'rgba(255, 255, 255, 0.004)';
        ctx.fill();

        // Glowing Tier Edge
        ctx.strokeStyle = tier.accentColor;
        ctx.lineWidth = isTierActive ? 1.2 : 0.6;
        ctx.globalAlpha = isTierActive ? 0.35 : 0.1;
        ctx.stroke();

        // 3D Gridlines across slab
        for (let i = -2; i <= 2; i++) {
          const gx = (slabWidth / 3) * i;
          const gp1 = project(gx, y, -slabDepth, width, height);
          const gp2 = project(gx, y, slabDepth, width, height);
          ctx.beginPath();
          ctx.moveTo(gp1.x, gp1.y);
          ctx.lineTo(gp2.x, gp2.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
          ctx.stroke();
        }

        // Tier Holographic Monospace Tag
        ctx.font = '10px var(--font-geist-mono), monospace';
        ctx.fillStyle = tier.accentColor;
        ctx.globalAlpha = isTierActive ? 0.75 : 0.2;
        ctx.fillText(tier.tag, p1.x + 8, p1.y - 6);
        ctx.restore();
      });

      // 2. Draw 3D Conduits & Interconnections
      TOPOLOGY_CONDUITS.forEach((conduit) => {
        const fromNode = ALL_NODES.find((n) => n.id === conduit.from);
        const toNode = ALL_NODES.find((n) => n.id === conduit.to);
        if (!fromNode || !toNode) return;

        const isConduitActive =
          (selectedTier === 'all' ||
            selectedTier === fromNode.tierId ||
            selectedTier === toNode.tierId) &&
          (!hoveredNodeId || hoveredNodeId === fromNode.id || hoveredNodeId === toNode.id);

        const pFrom = project(fromNode.pos[0], fromNode.pos[1], fromNode.pos[2], width, height);
        const pTo = project(toNode.pos[0], toNode.pos[1], toNode.pos[2], width, height);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);

        // Curved 3D Bezier conduit
        const midY = (pFrom.y + pTo.y) / 2 + 12;
        ctx.quadraticCurveTo((pFrom.x + pTo.x) / 2, midY, pTo.x, pTo.y);

        ctx.strokeStyle = conduit.color;
        ctx.lineWidth = isConduitActive ? 1.5 : 0.8;
        ctx.globalAlpha = isConduitActive ? 0.4 : 0.12;
        ctx.stroke();
        ctx.restore();
      });

      // 3. Draw Kinetic Photon Streams with Comet Trails
      particlesRef.current.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.trail = [];
        }

        const fromNode = ALL_NODES.find((n) => n.id === particle.conduit.from);
        const toNode = ALL_NODES.find((n) => n.id === particle.conduit.to);
        if (!fromNode || !toNode) return;

        const curX = fromNode.pos[0] + (toNode.pos[0] - fromNode.pos[0]) * particle.progress;
        const curY = fromNode.pos[1] + (toNode.pos[1] - fromNode.pos[1]) * particle.progress;
        const curZ = fromNode.pos[2] + (toNode.pos[2] - fromNode.pos[2]) * particle.progress;

        const p = project(curX, curY, curZ, width, height);

        // Track comet trail
        particle.trail.push({ x: p.x, y: p.y, scale: p.scale });
        if (particle.trail.length > 5) particle.trail.shift();

        // Draw Comet Tail
        ctx.save();
        for (let t = 0; t < particle.trail.length - 1; t++) {
          const pt = particle.trail[t];
          const trailAlpha = (t / particle.trail.length) * 0.4;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (particle.size * 0.6) * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = particle.conduit.color;
          ctx.globalAlpha = trailAlpha;
          ctx.fill();
        }

        // Draw Head Photon Orb
        ctx.beginPath();
        ctx.arc(p.x, p.y, particle.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = particle.conduit.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.restore();
      });

      // 4. Draw Active Energy Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 2.4;
        sw.opacity -= 0.035;

        if (sw.opacity <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        const p = project(sw.x, sw.y, sw.z, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, sw.radius * p.scale, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = sw.opacity;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Draw 3D Nodes (Sorted by depth Z)
      const sortedNodes = [...ALL_NODES].sort((a, b) => {
        const za = project(a.pos[0], a.pos[1], a.pos[2], width, height).z;
        const zb = project(b.pos[0], b.pos[1], b.pos[2], width, height).z;
        return zb - za;
      });

      sortedNodes.forEach((node) => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;

        const p = project(node.pos[0], node.pos[1], node.pos[2], width, height);
        const radius = (isSelected ? 11 : isHovered ? 9.5 : 8) * p.scale;

        ctx.save();

        // Pulsing Orbital Halo for Active / Selected Node
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2.3, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Multi-Layer Volumetric Ambient Node Bloom
        const gradient = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, radius * 2.5);
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.4, 'rgba(0,0,0,0.5)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Solid Core Orb
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#ffffff' : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isSelected ? 18 : 8;
        ctx.fill();

        // Node Monospace Label & Latency Badge
        ctx.font = `${Math.max(9, Math.round(11 * p.scale))}px var(--font-geist-mono), monospace`;
        ctx.fillStyle = isSelected ? '#ffffff' : '#a1a1aa';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.95;
        ctx.fillText(node.label, p.x + radius + 7, p.y + 4);

        // Latency tag below label
        ctx.font = `${Math.max(8, Math.round(9 * p.scale))}px var(--font-geist-mono), monospace`;
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.8;
        ctx.fillText(node.metrics.latency, p.x + radius + 7, p.y + 16);

        ctx.restore();
      });
    };

    render(performance.now());

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [isClient, isAutoRotating, selectedTier, selectedNodeId, hoveredNodeId]);

  // Pointer Interaction Handlers for Orbit Drag & Velocity Tracking
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: targetRotRef.current.x,
      rotY: targetRotRef.current.y,
      time: performance.now(),
    };
    lastPointerPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const now = performance.now();

    if (isDraggingRef.current) {
      const dt = Math.max(1, now - lastPointerPosRef.current.time);
      const dx = e.clientX - lastPointerPosRef.current.x;
      const dy = e.clientY - lastPointerPosRef.current.y;

      // Track angular velocity for inertia throw
      velocityRef.current = {
        y: (dx / dt) * 0.05,
        x: -(dy / dt) * 0.04,
      };

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      targetRotRef.current.y = dragStartRef.current.rotY + deltaX * 0.007;
      targetRotRef.current.x = Math.max(
        0.08,
        Math.min(0.62, dragStartRef.current.rotX - deltaY * 0.006)
      );

      lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      return;
    }

    // Raycast hit testing
    const cosY = Math.cos(rotRef.current.y);
    const sinY = Math.sin(rotRef.current.y);
    const cosX = Math.cos(rotRef.current.x);
    const sinX = Math.sin(rotRef.current.x);
    const cameraDist = 650;

    let closest = null;
    let minDist = 28;

    ALL_NODES.forEach((node) => {
      const x1 = node.pos[0] * cosY - node.pos[2] * sinY;
      const z1 = node.pos[2] * cosY + node.pos[0] * sinY;
      const y2 = node.pos[1] * cosX - z1 * sinX;
      const z2 = z1 * cosX + node.pos[1] * sinX;
      const scale = cameraDist / (cameraDist + z2);

      const px = rect.width / 2 + x1 * scale;
      const py = rect.height / 2 + y2 * scale;

      const dist = Math.hypot(mouseX - px, mouseY - py);
      if (dist < minDist) {
        minDist = dist;
        closest = node.id;
      }
    });

    setHoveredNodeId(closest);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = () => {
    if (hoveredNodeId) {
      setSelectedNodeId(hoveredNodeId);
      const targetNode = ALL_NODES.find((n) => n.id === hoveredNodeId);
      if (targetNode) {
        soundFx.playClick();
        shockwavesRef.current.push({
          x: targetNode.pos[0],
          y: targetNode.pos[1],
          z: targetNode.pos[2],
          radius: 4,
          opacity: 1,
          color: targetNode.color,
        });
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundFx.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* 3D Canvas Viewport Shell */}
      <div
        ref={containerRef}
        className="rounded-[2rem] bg-[#09090f]/95 border border-white/10 overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl"
      >
        {/* Top HUD Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border-subtle bg-bg-primary/60 text-xs font-mono">
          {/* Status & Instructions */}
          <div className="flex items-center gap-2.5 text-text-muted">
            <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse" />
            <span className="text-text-primary font-semibold tracking-wide">3D ISOMETRIC TOPOLOGY</span>
            <span className="hidden sm:inline text-text-tertiary">· Drag to throw · Click node to inspect</span>
          </div>

          {/* Controls: Audio Toggle, Reset, Auto-rotate */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className={cn(
                'px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all',
                !isMuted
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-bg-tertiary border-border-default text-text-muted hover:text-text-primary'
              )}
              title={isMuted ? 'Enable tactical sound effects' : 'Mute sound effects'}
            >
              <span>{isMuted ? '🔇' : '🔊'}</span>
              <span>{isMuted ? 'SFX: OFF' : 'SFX: ON'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAutoRotating((prev) => !prev)}
              className={cn(
                'px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all',
                isAutoRotating
                  ? 'bg-bg-tertiary border-border-strong text-text-primary'
                  : 'bg-bg-primary border-border-subtle text-text-muted hover:text-text-primary'
              )}
            >
              {isAutoRotating ? '⏸ Pause Orbit' : '▶ Auto Orbit'}
            </button>

            <button
              type="button"
              onClick={() => {
                targetRotRef.current = { x: 0.28, y: 0.45 };
                velocityRef.current = { x: 0, y: 0 };
                soundFx.playClick();
              }}
              className="px-2.5 py-1 rounded-lg border border-border-subtle bg-bg-tertiary text-text-muted hover:text-text-primary transition-all text-[11px]"
            >
              ↺ Reset Cam
            </button>
          </div>
        </div>

        {/* 3D Canvas Stage */}
        <div className="relative w-full h-[440px] sm:h-[500px] cursor-grab active:cursor-grabbing select-none">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={handleCanvasClick}
            className="w-full h-full block"
          />

          {/* Floating Live Telemetry HUD Overlays */}
          <div className="absolute top-4 left-4 pointer-events-none hidden sm:flex flex-col gap-1.5 font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-bg-primary/80 border border-border-subtle backdrop-blur-md space-y-1 shadow-lg">
              <div className="flex items-center gap-2 text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-ping" />
                <span>CLUSTER TELEMETRY</span>
              </div>
              <div className="text-text-primary font-semibold">
                Event Loop Lag: <span className="text-functional-success">0.18ms</span>
              </div>
              <div className="text-text-secondary text-[10px]">
                Heap: 52.4 MB · Active Sockets: 412
              </div>
            </div>
          </div>

          {/* Selected Node Quick Inspector Overlay */}
          <div className="absolute bottom-4 right-4 max-w-xs pointer-events-auto">
            <div className="p-3.5 rounded-xl bg-bg-secondary/90 border border-border-default backdrop-blur-md shadow-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-accent font-semibold uppercase">
                  {selectedNode.role}
                </span>
                <span className="text-[10px] font-mono text-functional-success bg-functional-success/10 px-2 py-0.5 rounded border border-functional-success/20">
                  {selectedNode.metrics.status || 'OK'}
                </span>
              </div>
              <h5 className="font-bold text-text-primary text-sm">{selectedNode.name}</h5>
              <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                {selectedNode.details}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-text-muted border-t border-border-subtle">
                <span>Latency: {selectedNode.metrics.latency}</span>
                <span>{selectedNode.protocol}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
