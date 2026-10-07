'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

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
    name: 'Persistence & Async Fabric',
    shortName: 'DATA & EVENTS',
    tag: 'TIER 3 · STORAGE',
    description: 'High-availability document persistence with compound indexing and asynchronous message queues.',
    yLevel: 110,
    accentColor: '#10b981',
    nodes: [
      {
        id: 'db',
        name: 'MongoDB Sharded Cluster',
        label: 'MONGODB PERSISTENCE',
        role: 'Document Store & Compound Indexes',
        tierId: 'persistence',
        color: '#10b981',
        pos: [-90, 110, 0],
        metrics: { latency: '4.8ms', connections: '128 pooled', status: 'SYNCED' },
        details: 'Stores domain documents with compound indices and zero collection scans. Backed by automated replica set failovers.',
        protocol: 'WiredTiger / ACID',
      },
      {
        id: 'queue',
        name: 'Async Event Queue',
        label: 'EVENT WORKER',
        role: 'Asynchronous Task Dispatcher',
        tierId: 'persistence',
        color: '#f59e0b',
        pos: [90, 110, 0],
        metrics: { lag: '0.0ms', throughput: '850 msg/s', status: 'DRAINING' },
        details: 'Offloads notification dispatches, PDF generation, and webhook broadcasts asynchronously without blocking the API thread.',
        protocol: 'AMQP / Async Pipe',
      },
    ],
  },
];

// Flat list of all system nodes
const ALL_NODES = ARCHITECTURE_TIERS.flatMap((t) => t.nodes);

// Architectural structured data pipelines (conduits)
const SYSTEM_CONDUITS = [
  // Tier 1 horizontal
  { from: 'gw', to: 'auth', type: 'peer', label: 'Token Verification' },
  // Vertical Ingress to Core
  { from: 'gw', to: 'fsm', type: 'vertical', label: 'Command Dispatch' },
  { from: 'auth', to: 'fsm', type: 'vertical', label: 'Verified Claims' },
  // Tier 2 horizontal
  { from: 'fsm', to: 'cache', type: 'peer', label: 'Fast Query Cache' },
  // Vertical Core to Persistence & Queue
  { from: 'fsm', to: 'db', type: 'vertical', label: 'Atomic Mutation' },
  { from: 'fsm', to: 'queue', type: 'vertical', label: 'State Audit Event' },
  // Tier 3 horizontal
  { from: 'queue', to: 'db', type: 'peer', label: 'Persist Audit' },
];

export default function DistributedSystem3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Selected state
  const [selectedTier, setSelectedTier] = useState('all'); // 'all' | 'ingress' | 'core' | 'persistence'
  const [selectedNode, setSelectedNode] = useState(ALL_NODES[2]); // Default: FSM CORE
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [transactionLog, setTransactionLog] = useState([]);
  const [activePulse, setActivePulse] = useState(null); // Active transaction visual shockwave
  const [isClient, setIsClient] = useState(false);

  // Isometric orbital angles (constrained range for pristine readability)
  const rotRef = useRef({ x: 0.22, y: 0.35 });
  const targetRotRef = useRef({ x: 0.22, y: 0.35 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);
  const shockwavesRef = useRef([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize kinetic photon streams along structured conduits
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 28; i++) {
      const conduit = SYSTEM_CONDUITS[i % SYSTEM_CONDUITS.length];
      const fromNode = ALL_NODES.find((n) => n.id === conduit.from);
      particles.push({
        conduit,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: 2.2 + Math.random() * 1.5,
        color: fromNode?.color || '#8b5cf6',
      });
    }
    particlesRef.current = particles;
  }, []);

  // Dispatch interactive simulated transaction
  const dispatchTransaction = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString();
    const transitions = [
      { from: 'NEW', to: 'PENDING_ACCEPTANCE', latency: '2.8ms', id: 'TX-9041' },
      { from: 'ASSIGNED', to: 'IN_PROGRESS', latency: '3.1ms', id: 'TX-9042' },
      { from: 'SUBMITTED', to: 'UNDER_REVIEW', latency: '3.4ms', id: 'TX-9043' },
      { from: 'UNDER_REVIEW', to: 'APPROVED', latency: '2.9ms', id: 'TX-9044' },
      { from: 'APPROVED', to: 'SETTLED', latency: '3.6ms', id: 'TX-9045' },
    ];
    const picked = transitions[Math.floor(Math.random() * transitions.length)];

    // Trigger visual energy pulse travelling from Gateway to FSM to DB
    setActivePulse({
      progress: 0,
      path: ['gw', 'auth', 'fsm', 'db'],
      picked,
    });

    // Add shockwave to FSM Core
    shockwavesRef.current.push({
      x: -70,
      y: 0,
      z: 0,
      radius: 0,
      maxRadius: 75,
      opacity: 1,
      color: '#a855f7',
    });

    setTransactionLog((prev) => [
      {
        id: Date.now(),
        txId: picked.id,
        time: timestamp,
        method: 'POST',
        endpoint: '/api/v1/claims/transition',
        latency: picked.latency,
        text: `FSM Transition ${picked.from} ➔ ${picked.to} verified atomically.`,
      },
      ...prev.slice(0, 4),
    ]);
  }, []);

  // Canvas 2D Isometric Rendering Engine
  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save battery when off-screen
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

    // 3D Isometric Projection with smooth angle constraint
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

      // Perspective scale
      const cameraDist = 580;
      const scale = cameraDist / (cameraDist + z2);
      const projX = width / 2 + x1 * scale;
      const projY = height / 2 + y2 * scale;

      return { x: projX, y: projY, z: z2, scale };
    };

    let lastTime = performance.now();

    const render = (time) => {
      animFrameRef.current = requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth auto-orbiting with gentle oscillation
      if (isAutoRotating && !isDraggingRef.current) {
        targetRotRef.current.y += 0.0032;
      }

      // Smooth damping interpolation
      rotRef.current.x += (targetRotRef.current.x - rotRef.current.x) * 0.08;
      rotRef.current.y += (targetRotRef.current.y - rotRef.current.y) * 0.08;

      // Compute projected coordinates for tiers & nodes
      const projectedNodes = {};
      ALL_NODES.forEach((node) => {
        // Calculate vertical elevation if tier is focused
        let yOffset = node.pos[1];
        if (selectedTier !== 'all') {
          if (node.tierId === selectedTier) {
            yOffset -= 12; // Elevate selected tier
          } else {
            yOffset += 8; // Mute non-selected
          }
        }

        projectedNodes[node.id] = {
          ...node,
          proj: project(node.pos[0], yOffset, node.pos[2], width, height),
        };
      });

      // ─────────────────────────────────────────────────────────────
      // 1. Draw 3-Tier Isometric Floating Glass Slabs
      // ─────────────────────────────────────────────────────────────
      ARCHITECTURE_TIERS.forEach((tier) => {
        let tierY = tier.yLevel;
        const isTierActive = selectedTier === 'all' || selectedTier === tier.id;
        if (selectedTier === tier.id) tierY -= 12;

        const slabWidth = 260;
        const slabDepth = 150;

        // 4 corners in 3D space
        const p1 = project(-slabWidth / 2, tierY, -slabDepth / 2, width, height);
        const p2 = project(slabWidth / 2, tierY, -slabDepth / 2, width, height);
        const p3 = project(slabWidth / 2, tierY, slabDepth / 2, width, height);
        const p4 = project(-slabWidth / 2, tierY, slabDepth / 2, width, height);

        // Draw translucent glass platform
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        // Fill with soft cyber-glass gradient
        const fillAlpha = isTierActive ? (selectedTier === tier.id ? 0.09 : 0.04) : 0.015;
        ctx.fillStyle = `rgba(255, 255, 255, ${fillAlpha})`;
        ctx.fill();

        // Border with tier accent glow
        ctx.strokeStyle = isTierActive
          ? `${tier.accentColor}${selectedTier === tier.id ? '55' : '25'}`
          : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = selectedTier === tier.id ? 1.8 : 1;
        ctx.stroke();

        // Blueprint corner tick marks
        const drawTick = (pt) => {
          ctx.strokeStyle = isTierActive ? `${tier.accentColor}80` : 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.stroke();
        };
        drawTick(p1);
        drawTick(p2);
        drawTick(p3);
        drawTick(p4);

        // Tier Label watermark in 3D
        const labelPos = project(-slabWidth / 2 + 18, tierY + 4, slabDepth / 2 - 14, width, height);
        ctx.font = `600 ${Math.round(9 * labelPos.scale)}px monospace`;
        ctx.fillStyle = isTierActive ? `${tier.accentColor}99` : 'rgba(255, 255, 255, 0.2)';
        ctx.textAlign = 'left';
        ctx.fillText(tier.tag, labelPos.x, labelPos.y);
      });

      // ─────────────────────────────────────────────────────────────
      // 2. Draw Structured Architectural Laser Conduits
      // ─────────────────────────────────────────────────────────────
      SYSTEM_CONDUITS.forEach((conduit) => {
        const from = projectedNodes[conduit.from];
        const to = projectedNodes[conduit.to];
        if (!from || !to) return;

        const isConnected =
          hoveredNode === conduit.from ||
          hoveredNode === conduit.to ||
          selectedNode?.id === conduit.from ||
          selectedNode?.id === conduit.to;

        ctx.beginPath();
        ctx.moveTo(from.proj.x, from.proj.y);

        if (conduit.type === 'vertical') {
          // Smooth vertical bus routing
          const midY = (from.proj.y + to.proj.y) / 2;
          ctx.bezierCurveTo(
            from.proj.x,
            midY,
            to.proj.x,
            midY,
            to.proj.x,
            to.proj.y
          );
        } else {
          ctx.lineTo(to.proj.x, to.proj.y);
        }

        if (isConnected) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // ─────────────────────────────────────────────────────────────
      // 3. Draw Kinetic Photon Data Packets
      // ─────────────────────────────────────────────────────────────
      particlesRef.current.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const from = projectedNodes[p.conduit.from];
        const to = projectedNodes[p.conduit.to];
        if (!from || !to) return;

        let currX, currY, currScale;
        if (p.conduit.type === 'vertical') {
          const midY = (from.proj.y + to.proj.y) / 2;
          // Cubic Bezier interpolation
          const t = p.progress;
          const u = 1 - t;
          currX = u * u * u * from.proj.x + 3 * u * u * t * from.proj.x + 3 * u * t * t * to.proj.x + t * t * t * to.proj.x;
          currY = u * u * u * from.proj.y + 3 * u * u * t * midY + 3 * u * t * t * midY + t * t * t * to.proj.y;
          currScale = from.proj.scale + (to.proj.scale - from.proj.scale) * t;
        } else {
          currX = from.proj.x + (to.proj.x - from.proj.x) * p.progress;
          currY = from.proj.y + (to.proj.y - from.proj.y) * p.progress;
          currScale = from.proj.scale + (to.proj.scale - from.proj.scale) * p.progress;
        }

        ctx.beginPath();
        ctx.arc(currX, currY, p.size * currScale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 9;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ─────────────────────────────────────────────────────────────
      // 4. Draw Simulated Transaction Packet & Shockwaves
      // ─────────────────────────────────────────────────────────────
      if (activePulse) {
        activePulse.progress += dt * 0.85;
        if (activePulse.progress >= 1) {
          setActivePulse(null);
        } else {
          const totalLegs = activePulse.path.length - 1;
          const legIndex = Math.min(Math.floor(activePulse.progress * totalLegs), totalLegs - 1);
          const legProgress = activePulse.progress * totalLegs - legIndex;
          const fromNode = projectedNodes[activePulse.path[legIndex]];
          const toNode = projectedNodes[activePulse.path[legIndex + 1]];

          if (fromNode && toNode) {
            const bx = fromNode.proj.x + (toNode.proj.x - fromNode.proj.x) * legProgress;
            const by = fromNode.proj.y + (toNode.proj.y - fromNode.proj.y) * legProgress;

            // Bright Golden Photon Comet
            ctx.beginPath();
            ctx.arc(bx, by, 7.5, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 24;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw expanding core shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += dt * 90;
        sw.opacity -= dt * 1.2;

        if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        const centerProj = project(sw.x, sw.y, sw.z, width, height);
        ctx.beginPath();
        ctx.ellipse(
          centerProj.x,
          centerProj.y,
          sw.radius * centerProj.scale,
          (sw.radius * 0.55) * centerProj.scale,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(168, 85, 247, ${sw.opacity * 0.8})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // ─────────────────────────────────────────────────────────────
      // 5. Render 3D Architectural Nodes & Pedestals
      // ─────────────────────────────────────────────────────────────
      const sortedNodes = Object.values(projectedNodes).sort(
        (a, b) => a.proj.z - b.proj.z
      );

      sortedNodes.forEach((node) => {
        const { x, y, scale } = node.proj;
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode === node.id;
        const isTierActive = selectedTier === 'all' || selectedTier === node.tierId;

        const baseRadius = isSelected ? 18 : isHovered ? 16 : 13;
        const radius = baseRadius * scale;
        const alpha = isTierActive ? 1 : 0.35;

        // 3D Isometric Puck Pedestal (Depth extrusion)
        const pedestalHeight = 6 * scale;
        ctx.beginPath();
        ctx.ellipse(x, y + pedestalHeight, radius, radius * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 10, 15, ${alpha * 0.9})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer Halo on Hover / Select
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.ellipse(x, y, radius + 11 * scale, (radius + 11 * scale) * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? `rgba(168, 85, 247, ${alpha * 0.22})`
            : `rgba(255, 255, 255, ${alpha * 0.1})`;
          ctx.fill();
        }

        // Top Surface Rim
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.58, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17, 17, 24, ${alpha})`;
        ctx.fill();
        ctx.strokeStyle = isSelected
          ? node.color
          : isHovered
          ? 'rgba(255, 255, 255, 0.6)'
          : `rgba(255, 255, 255, ${alpha * 0.16})`;
        ctx.lineWidth = isSelected ? 2.2 : 1.2;
        ctx.stroke();

        // Glowing Core LED Gem
        const gemRadius = radius * 0.42;
        ctx.beginPath();
        ctx.ellipse(x, y, gemRadius, gemRadius * 0.58, 0, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 14 * scale;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label (Crisp Monospace Badge)
        ctx.font = `600 ${Math.round(10 * scale)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected
          ? '#ffffff'
          : `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fillText(node.label, x, y + radius * 0.58 + 15 * scale);
      });
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [isClient, isAutoRotating, selectedTier, selectedNode, hoveredNode, activePulse]);

  // Pointer drag to orbit 3D space with damping
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: targetRotRef.current.x,
      rotY: targetRotRef.current.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      targetRotRef.current.y = dragStartRef.current.rotY + deltaX * 0.007;
      targetRotRef.current.x = Math.max(
        0.05,
        Math.min(0.65, dragStartRef.current.rotX - deltaY * 0.006)
      );
      return;
    }

    // Raycast hit testing for hovering
    const cosY = Math.cos(rotRef.current.y);
    const sinY = Math.sin(rotRef.current.y);
    const cosX = Math.cos(rotRef.current.x);
    const sinX = Math.sin(rotRef.current.x);
    const cameraDist = 580;

    let closest = null;
    let minDist = 32;

    ALL_NODES.forEach((node) => {
      let yOffset = node.pos[1];
      if (selectedTier !== 'all') {
        if (node.tierId === selectedTier) yOffset -= 12;
        else yOffset += 8;
      }

      const x1 = node.pos[0] * cosY - node.pos[2] * sinY;
      const z1 = node.pos[2] * cosY + node.pos[0] * sinY;
      const y2 = yOffset * cosX - z1 * sinX;
      const z2 = z1 * cosX + yOffset * sinX;
      const scale = cameraDist / (cameraDist + z2);
      const px = rect.width / 2 + x1 * scale;
      const py = rect.height / 2 + y2 * scale;

      const dist = Math.hypot(mouseX - px, mouseY - py);
      if (dist < minDist) {
        minDist = dist;
        closest = node.id;
      }
    });

    setHoveredNode(closest);
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
      const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
      if (deltaX < 6 && deltaY < 6 && hoveredNode) {
        const found = ALL_NODES.find((n) => n.id === hoveredNode);
        if (found) {
          setSelectedNode(found);
          setSelectedTier(found.tierId);
        }
      }
    }
    isDraggingRef.current = false;
  };

  // Find tier of selected node
  const currentTierInfo = useMemo(() => {
    return ARCHITECTURE_TIERS.find((t) => t.id === selectedNode?.tierId) || ARCHITECTURE_TIERS[1];
  }, [selectedNode]);

  return (
    <section
      id="system-architecture"
      ref={containerRef}
      className="py-20 md:py-28 border-t border-border-subtle relative overflow-hidden bg-bg-primary"
    >
      {/* Background Volumetric Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/6 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-secondary/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <SectionHeading
          eyebrow="DISTRIBUTED TOPOLOGY"
          title="Living 3D System Architecture"
          description="An interactive 3-tier isometric visualization of my distributed backend architecture: stateless edge ingress, atomic FSM lifecycle state coordination, and sharded persistence."
        />

        {/* 3D Viewer Glass Box */}
        <RevealOnScroll delay={0.1}>
          <div className="rounded-[2rem] bg-white/[0.02] ring-1 ring-white/[0.08] p-2 sm:p-3 shadow-2xl backdrop-blur-md">
            <div className="rounded-[calc(2rem-0.5rem)] bg-bg-secondary/90 border border-border-default overflow-hidden relative">
              {/* Top HUD Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border-subtle bg-bg-primary/50 text-xs font-mono">
                {/* Status Indicator */}
                <div className="flex items-center gap-2.5 text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse-ring" />
                  <span className="text-text-primary font-semibold tracking-wide">ISOMETRIC MONOLITH</span>
                  <span className="hidden md:inline text-text-tertiary">· Drag to tilt orbit</span>
                </div>

                {/* Tier Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-bg-tertiary/70 border border-border-subtle text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedTier('all')}
                    className={cn(
                      'px-2.5 py-0.5 rounded-full transition-all font-mono',
                      selectedTier === 'all'
                        ? 'bg-accent text-white shadow-sm font-semibold'
                        : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    All Tiers
                  </button>
                  {ARCHITECTURE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setSelectedTier(tier.id);
                        setSelectedNode(tier.nodes[0]);
                      }}
                      className={cn(
                        'px-2 py-0.5 rounded-full transition-all font-mono',
                        selectedTier === tier.id
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      {tier.shortName}
                    </button>
                  ))}
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoRotating((prev) => !prev)}
                    className={cn(
                      'px-2.5 py-1 rounded-full border transition-colors',
                      isAutoRotating
                        ? 'bg-accent/15 text-accent border-accent/30'
                        : 'bg-bg-tertiary text-text-muted border-border-default hover:text-text-primary'
                    )}
                    aria-label="Toggle auto rotation"
                  >
                    {isAutoRotating ? 'Orbit: ON' : 'Orbit: OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      targetRotRef.current = { x: 0.22, y: 0.35 };
                      setSelectedTier('all');
                      setSelectedNode(ALL_NODES[2]);
                    }}
                    className="px-2.5 py-1 rounded-full bg-bg-tertiary hover:bg-bg-elevated border border-border-default text-text-muted hover:text-text-primary transition-colors"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={dispatchTransaction}
                    className="px-3.5 py-1 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <span>⚡</span>
                    <span>Fire Transaction</span>
                  </button>
                </div>
              </div>

              {/* Main Content Grid: 3D Stage (8 cols) + Telemetry HUD (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] relative">
                {/* 3D Canvas Stage */}
                <div className="lg:col-span-8 relative min-h-[440px] lg:min-h-[540px] bg-gradient-to-b from-bg-primary/20 to-bg-primary/60 cursor-grab active:cursor-grabbing select-none flex flex-col justify-between">
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="w-full h-full block absolute inset-0"
                    style={{ touchAction: 'none' }}
                    aria-label="Interactive 3D distributed architecture topology viewer"
                  />

                  {/* Top-left Tier Legend */}
                  <div className="relative z-10 m-4 p-2.5 rounded-xl bg-bg-primary/75 backdrop-blur-md border border-border-subtle max-w-fit space-y-1 font-mono text-[11px] pointer-events-none">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="w-2 h-0.5 bg-[#8b5cf6] rounded-full inline-block" />
                      <span>Tier 1: Edge Ingress & Shield</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="w-2 h-0.5 bg-[#a855f7] rounded-full inline-block" />
                      <span>Tier 2: FSM Core & Cache Engine</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="w-2 h-0.5 bg-[#10b981] rounded-full inline-block" />
                      <span>Tier 3: Persistence & Event Bus</span>
                    </div>
                  </div>

                  {/* Bottom Navigation Hint */}
                  <div className="relative z-10 m-4 flex items-center justify-between pointer-events-none">
                    <span className="font-mono text-[11px] text-text-muted bg-bg-primary/80 backdrop-blur px-3 py-1 rounded-md border border-border-subtle">
                      Drag to orbit · Click node or tier to inspect
                    </span>
                    <span className="font-mono text-[10px] text-accent/80 bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                      Zero WebGL Bloat · 60 FPS Canvas
                    </span>
                  </div>
                </div>

                {/* Live Node Telemetry Panel (4 cols) */}
                <div className="lg:col-span-4 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-border-subtle bg-bg-primary/40 flex flex-col justify-between space-y-6">
                  <AnimatePresence mode="wait">
                    {selectedNode && (
                      <motion.div
                        key={selectedNode.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-4"
                      >
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="font-mono text-xs px-2.5 py-0.5 rounded-full border font-semibold"
                            style={{
                              color: selectedNode.color,
                              borderColor: `${selectedNode.color}45`,
                              backgroundColor: `${selectedNode.color}15`,
                            }}
                          >
                            {selectedNode.label}
                          </span>
                          <span className="font-mono text-[11px] text-functional-success flex items-center gap-1.5 bg-functional-success/10 px-2 py-0.5 rounded-full border border-functional-success/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse" />
                            {selectedNode.metrics.status}
                          </span>
                        </div>

                        {/* Title & Role */}
                        <div>
                          <h3 className="text-xl font-bold text-text-primary tracking-tight">
                            {selectedNode.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-accent">
                              {selectedNode.role}
                            </span>
                            <span className="text-text-muted text-xs">·</span>
                            <span className="font-mono text-[11px] text-text-tertiary">
                              {selectedNode.protocol}
                            </span>
                          </div>
                        </div>

                        {/* Tier Context Summary */}
                        <div className="p-3 rounded-xl bg-bg-secondary/60 border border-border-subtle space-y-1.5">
                          <div className="font-mono text-[10px] uppercase text-text-muted tracking-wider">
                            {currentTierInfo.name}
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {selectedNode.details}
                          </p>
                        </div>

                        {/* Telemetry Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {Object.entries(selectedNode.metrics).map(([key, val]) => (
                            <div
                              key={key}
                              className="p-2.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle hover:border-border-default transition-colors"
                            >
                              <span className="font-mono text-[10px] text-text-muted uppercase block">
                                {key}
                              </span>
                              <span className="font-mono text-xs font-semibold text-text-primary">
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Real-time Telemetry Stream */}
                  <div className="pt-4 border-t border-border-subtle space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block">
                        Live Telemetry Stream
                      </span>
                      <span className="font-mono text-[10px] text-accent/80">
                        {transactionLog.length} Events Logged
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {transactionLog.length === 0 ? (
                        <p className="font-mono text-[11px] text-text-tertiary italic p-2 rounded bg-bg-secondary/40 border border-dashed border-border-subtle">
                          Click &quot;Fire Transaction&quot; to test FSM atomic dispatch...
                        </p>
                      ) : (
                        transactionLog.map((log) => (
                          <div
                            key={log.id}
                            className="font-mono text-[10px] p-2 rounded-lg bg-bg-secondary border border-border-subtle text-text-secondary animate-in fade-in space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-text-muted">
                              <span className="text-accent font-semibold">{log.txId}</span>
                              <span className="text-[9px]">{log.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-text-primary">
                              <span className="text-functional-success font-semibold">{log.method}</span>
                              <span className="text-text-muted">{log.endpoint}</span>
                              <span className="text-accent ml-auto">({log.latency})</span>
                            </div>
                            <div className="text-[10px] text-text-secondary pt-0.5">{log.text}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Accessibility Screen-Reader Fallback Table */}
        <div className="sr-only">
          <table>
            <caption>Mohammed Ferwana Distributed Architecture System Tiers</caption>
            <thead>
              <tr>
                <th scope="col">Tier</th>
                <th scope="col">Service Name</th>
                <th scope="col">Role</th>
                <th scope="col">Protocol</th>
                <th scope="col">Latency</th>
              </tr>
            </thead>
            <tbody>
              {ALL_NODES.map((node) => (
                <tr key={node.id}>
                  <td>{node.tierId}</td>
                  <td>{node.name}</td>
                  <td>{node.role}</td>
                  <td>{node.protocol}</td>
                  <td>{node.metrics.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
