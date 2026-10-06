'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

// Architectural node definition for distributed backend topology
const SYSTEM_NODES = [
  {
    id: 'gw',
    name: 'API Gateway & Ingress',
    label: 'API GATEWAY',
    role: 'Reverse Proxy & Rate Limiter',
    color: '#8b5cf6',
    pos: [0, -140, 20],
    metrics: { latency: '1.2ms', throughput: '2,400 req/s', status: 'HEALTHY' },
    details: 'Handles SSL termination, IP throttling, and routing to authenticated micro-services.',
  },
  {
    id: 'auth',
    name: 'RBAC Security Guard',
    label: 'AUTH / RBAC',
    role: 'Stateless JWT & Permission Matrix',
    color: '#ec4899',
    pos: [-170, -40, -50],
    metrics: { latency: '0.8ms', throughput: '1,950 req/s', status: 'SHIELDED' },
    details: 'Validates bearer tokens and declarative role privileges before touching business logic.',
  },
  {
    id: 'fsm',
    name: 'Claim FSM Lifecycle Engine',
    label: 'FSM CORE',
    role: 'Finite State Machine Coordinator',
    color: '#a855f7',
    pos: [0, 15, 80],
    metrics: { latency: '3.4ms', states: '10 Valid States', status: 'ATOMIC' },
    details: 'Guarantees valid transitions across claim states; strictly rejects unauthorized stage skipping.',
  },
  {
    id: 'cache',
    name: 'Distributed Redis Cache',
    label: 'CACHE TIER',
    role: 'In-Memory Query Acceleration',
    color: '#3b82f6',
    pos: [170, -70, 30],
    metrics: { latency: '0.4ms', hitRate: '94.2%', status: 'WARM' },
    details: 'Caches idempotent GET endpoints and session counters with automated TTL eviction.',
  },
  {
    id: 'db',
    name: 'MongoDB Sharded Cluster',
    label: 'MONGODB PERSISTENCE',
    role: 'Document Store & Compound Indexes',
    color: '#22c55e',
    pos: [160, 110, -60],
    metrics: { latency: '4.8ms', connections: '128 pooled', status: 'SYNCED' },
    details: 'Stores domain documents with compound indices and zero collection scans.',
  },
  {
    id: 'queue',
    name: 'Async Event Queue',
    label: 'EVENT WORKER',
    role: 'Asynchronous Task Dispatcher',
    color: '#f59e0b',
    pos: [-150, 110, 40],
    metrics: { lag: '0.0ms', throughput: '850 msg/s', status: 'DRAINING' },
    details: 'Offloads notification dispatches, PDF generation, and webhook broadcasts asynchronously.',
  },
];

// Edges connecting nodes
const SYSTEM_EDGES = [
  { from: 'gw', to: 'auth', label: 'Authenticate' },
  { from: 'gw', to: 'fsm', label: 'Direct Command' },
  { from: 'gw', to: 'cache', label: 'Cache Lookup' },
  { from: 'auth', to: 'fsm', label: 'Verified Claims' },
  { from: 'fsm', to: 'db', label: 'Atomic Mutation' },
  { from: 'fsm', to: 'queue', label: 'State Audit Event' },
  { from: 'queue', to: 'db', label: 'Persist Audit' },
];

export default function DistributedSystem3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(SYSTEM_NODES[2]); // Default: FSM CORE
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [transactionLog, setTransactionLog] = useState([]);
  const [burstPacket, setBurstPacket] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Rotation angles in radians
  const rotRef = useRef({ x: 0.18, y: 0.42 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize data particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      const edge = SYSTEM_EDGES[i % SYSTEM_EDGES.length];
      particles.push({
        edge,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.005,
        size: 2 + Math.random() * 2,
        color: SYSTEM_NODES.find((n) => n.id === edge.from)?.color || '#8b5cf6',
      });
    }
    particlesRef.current = particles;
  }, []);

  // Trigger simulated request burst
  const dispatchTransaction = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString();
    const transitions = [
      { from: 'NEW', to: 'PENDING_ACCEPTANCE' },
      { from: 'ASSIGNED', to: 'IN_PROGRESS' },
      { from: 'SUBMITTED', to: 'UNDER_REVIEW' },
      { from: 'UNDER_REVIEW', to: 'APPROVED' },
    ];
    const picked = transitions[Math.floor(Math.random() * transitions.length)];

    setBurstPacket({
      progress: 0,
      path: ['gw', 'auth', 'fsm', 'db'],
      label: `${picked.from} → ${picked.to}`,
    });

    setTransactionLog((prev) => [
      {
        id: Date.now(),
        time: timestamp,
        method: 'POST',
        path: `/api/v1/claims/transition`,
        status: 200,
        text: `FSM transition ${picked.from} → ${picked.to} verified and persisted.`,
      },
      ...prev.slice(0, 4),
    ]);
  }, []);

  // 3D Canvas Rendering Engine
  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport intersection observer to save battery when off-screen
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

    // 3D Math Utilities
    const project = (x, y, z, width, height) => {
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);
      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);

      // Rotate around Y axis
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate around X axis
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      // Perspective projection
      const cameraDist = 480;
      const scale = cameraDist / (cameraDist + z2);
      const projX = width / 2 + x1 * scale;
      const projY = height / 2 + y2 * scale;

      return { x: projX, y: projY, z: z2, scale };
    };

    let lastTime = performance.now();

    const render = (time) => {
      animFrameRef.current = requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Auto rotation in idle
      if (isAutoRotating && !isDraggingRef.current) {
        rotRef.current.y += 0.0035;
      }

      // Compute projected 2D coordinates for all nodes
      const projectedNodes = {};
      SYSTEM_NODES.forEach((node) => {
        projectedNodes[node.id] = {
          ...node,
          proj: project(node.pos[0], node.pos[1], node.pos[2], width, height),
        };
      });

      // 1. Draw connecting 3D edges
      SYSTEM_EDGES.forEach((edge) => {
        const fromNode = projectedNodes[edge.from];
        const toNode = projectedNodes[edge.to];
        if (!fromNode || !toNode) return;

        const isHighlighted =
          hoveredNode === edge.from ||
          hoveredNode === edge.to ||
          selectedNode?.id === edge.from ||
          selectedNode?.id === edge.to;

        ctx.beginPath();
        ctx.moveTo(fromNode.proj.x, fromNode.proj.y);
        ctx.lineTo(toNode.proj.x, toNode.proj.y);

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
          ctx.lineWidth = 1.8;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // 2. Draw moving stream particles
      particlesRef.current.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const fromNode = projectedNodes[p.edge.from];
        const toNode = projectedNodes[p.edge.to];
        if (!fromNode || !toNode) return;

        const currX = fromNode.proj.x + (toNode.proj.x - fromNode.proj.x) * p.progress;
        const currY = fromNode.proj.y + (toNode.proj.y - fromNode.proj.y) * p.progress;
        const currScale = fromNode.proj.scale + (toNode.proj.scale - fromNode.proj.scale) * p.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, p.size * currScale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Draw simulated burst transaction packet if active
      if (burstPacket) {
        burstPacket.progress += dt * 0.9;
        if (burstPacket.progress >= 1) {
          setBurstPacket(null);
        } else {
          const totalLegs = burstPacket.path.length - 1;
          const legIndex = Math.floor(burstPacket.progress * totalLegs);
          const legProgress = (burstPacket.progress * totalLegs) - legIndex;
          const fromId = burstPacket.path[legIndex];
          const toId = burstPacket.path[legIndex + 1];

          if (fromId && toId) {
            const fromP = projectedNodes[fromId];
            const toP = projectedNodes[toId];
            if (fromP && toP) {
              const bx = fromP.proj.x + (toP.proj.x - fromP.proj.x) * legProgress;
              const by = fromP.proj.y + (toP.proj.y - fromP.proj.y) * legProgress;

              ctx.beginPath();
              ctx.arc(bx, by, 7, 0, Math.PI * 2);
              ctx.fillStyle = '#f59e0b';
              ctx.shadowColor = '#f59e0b';
              ctx.shadowBlur = 18;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // Sort nodes by Z-depth (Painter's Algorithm)
      const sortedNodes = Object.values(projectedNodes).sort(
        (a, b) => a.proj.z - b.proj.z
      );

      // 4. Render 3D Nodes
      sortedNodes.forEach((node) => {
        const { x, y, scale } = node.proj;
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode === node.id;
        const radius = (isSelected ? 16 : isHovered ? 14 : 11) * scale;

        // Outer Glow Halo
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(x, y, radius + 10 * scale, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? 'rgba(168, 85, 247, 0.18)'
            : 'rgba(255, 255, 255, 0.08)';
          ctx.fill();
        }

        // Concentric Double-Bezel Ring
        ctx.beginPath();
        ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? node.color
          : isHovered
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Node Inner Core
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#111118';
        ctx.fill();

        // Node Colored Core Center
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12 * scale;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Text Badge
        ctx.font = `${Math.round(10 * scale)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
        ctx.fillText(node.label, x, y + radius + 15 * scale);
      });
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [isClient, isAutoRotating, selectedNode, hoveredNode, burstPacket]);

  // Pointer drag to orbit 3D space
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotRef.current.x,
      rotY: rotRef.current.y,
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
      rotRef.current.y = dragStartRef.current.rotY + deltaX * 0.008;
      rotRef.current.x = Math.max(
        -0.8,
        Math.min(0.8, dragStartRef.current.rotX - deltaY * 0.008)
      );
      return;
    }

    // Raycast hit testing for hovering
    const cosY = Math.cos(rotRef.current.y);
    const sinY = Math.sin(rotRef.current.y);
    const cosX = Math.cos(rotRef.current.x);
    const sinX = Math.sin(rotRef.current.x);
    const cameraDist = 480;

    let closest = null;
    let minDist = 30;

    SYSTEM_NODES.forEach((node) => {
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

    setHoveredNode(closest);
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
      const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
      if (deltaX < 5 && deltaY < 5 && hoveredNode) {
        const found = SYSTEM_NODES.find((n) => n.id === hoveredNode);
        if (found) setSelectedNode(found);
      }
    }
    isDraggingRef.current = false;
  };

  return (
    <section
      id="system-architecture"
      ref={containerRef}
      className="py-20 md:py-28 border-t border-border-subtle relative overflow-hidden bg-bg-primary"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/6 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <SectionHeading
          eyebrow="DISTRIBUTED TOPOLOGY"
          title="Living 3D System Architecture"
          description="A real-time, interactive kinetic representation of my backend systems: stateless gateway verification, lifecycle state coordination, and sharded persistence."
        />

        {/* 3D Viewer Container */}
        <RevealOnScroll delay={0.1}>
          <div className="rounded-[2rem] bg-white/[0.02] ring-1 ring-white/[0.08] p-2 sm:p-3 shadow-2xl backdrop-blur-md">
            <div className="rounded-[calc(2rem-0.5rem)] bg-bg-secondary/90 border border-border-default overflow-hidden relative">
              {/* Top HUD Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border-subtle bg-bg-primary/50 text-xs font-mono">
                <div className="flex items-center gap-2 text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse-ring" />
                  <span className="text-text-primary font-semibold">CLUSTER TELEMETRY</span>
                  <span className="hidden sm:inline text-text-tertiary">· Drag to orbit 3D space</span>
                </div>

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
                  >
                    {isAutoRotating ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      rotRef.current = { x: 0.18, y: 0.42 };
                    }}
                    className="px-2.5 py-1 rounded-full bg-bg-tertiary hover:bg-bg-elevated border border-border-default text-text-muted hover:text-text-primary transition-colors"
                  >
                    Reset View
                  </button>

                  <button
                    type="button"
                    onClick={dispatchTransaction}
                    className="px-3 py-1 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-sm active:scale-95"
                  >
                    ⚡ Fire Transaction
                  </button>
                </div>
              </div>

              {/* 3D Canvas Area & Overlay HUD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] relative">
                {/* 3D Canvas (8 cols on large screens) */}
                <div className="lg:col-span-8 relative min-h-[420px] lg:min-h-[520px] bg-gradient-to-b from-bg-primary/20 to-bg-primary/60 cursor-grab active:cursor-grabbing select-none">
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="w-full h-full block"
                    style={{ touchAction: 'none' }}
                  />

                  {/* 3D Instruction watermark */}
                  <div className="absolute bottom-4 left-4 font-mono text-[11px] text-text-muted pointer-events-none bg-bg-primary/80 backdrop-blur px-2.5 py-1 rounded-md border border-border-subtle">
                    Rotate: Drag cursor · Inspect: Click node
                  </div>
                </div>

                {/* Live Node Telemetry Panel (4 cols) */}
                <div className="lg:col-span-4 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-border-subtle bg-bg-primary/40 flex flex-col justify-between space-y-6">
                  <AnimatePresence mode="wait">
                    {selectedNode && (
                      <motion.div
                        key={selectedNode.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-mono text-xs px-2.5 py-0.5 rounded-full border"
                            style={{
                              color: selectedNode.color,
                              borderColor: `${selectedNode.color}40`,
                              backgroundColor: `${selectedNode.color}15`,
                            }}
                          >
                            {selectedNode.label}
                          </span>
                          <span className="font-mono text-[11px] text-functional-success flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-functional-success" />
                            {selectedNode.metrics.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-text-primary tracking-tight">
                            {selectedNode.name}
                          </h3>
                          <p className="font-mono text-xs text-accent mt-0.5">
                            {selectedNode.role}
                          </p>
                        </div>

                        <p className="text-xs text-text-secondary leading-relaxed bg-bg-secondary/60 p-3 rounded-xl border border-border-subtle">
                          {selectedNode.details}
                        </p>

                        {/* Real-time Node Metrics Box */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {Object.entries(selectedNode.metrics).map(([key, val]) => (
                            <div
                              key={key}
                              className="p-2.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle"
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

                  {/* Transaction Feed */}
                  <div className="pt-4 border-t border-border-subtle space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block">
                      Live Telemetry Stream
                    </span>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                      {transactionLog.length === 0 ? (
                        <p className="font-mono text-[11px] text-text-tertiary italic">
                          Click &quot;Fire Transaction&quot; to test FSM atomic dispatch...
                        </p>
                      ) : (
                        transactionLog.map((log) => (
                          <div
                            key={log.id}
                            className="font-mono text-[10px] p-1.5 rounded bg-bg-secondary border border-border-subtle text-text-secondary animate-in fade-in"
                          >
                            <span className="text-accent font-semibold">[{log.time}]</span>{' '}
                            <span className="text-functional-success">{log.method}</span>{' '}
                            <span>{log.text}</span>
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
      </div>
    </section>
  );
}
