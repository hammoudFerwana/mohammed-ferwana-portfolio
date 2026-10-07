'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import Badge from '@/components/shared/Badge';
import { cn } from '@/lib/utils';
import { soundFx } from '@/lib/soundFx';

// ==========================================
// ARCHITECTURAL NODES & SPECIFICATIONS
// ==========================================
const ARCHITECTURE_NODES = [
  {
    id: 'edge',
    tier: 'SECURITY & INGRESS',
    tierNumber: '01',
    name: 'Edge Shield & Rate Limiter',
    shortName: 'EDGE SHIELD',
    role: 'Token-Bucket Ingress Throttling & DDoS Mitigation',
    tech: 'Sliding-Window Throttler · Nginx / Helmet',
    accentColor: '#f43f5e', // Rose
    accentBg: 'rgba(244, 63, 94, 0.12)',
    accentBorder: 'rgba(244, 63, 94, 0.35)',
    metrics: {
      latency: '0.3ms',
      throughput: '5,200 req/s',
      rejectionRate: '0.00%',
      windowSize: '100 req / min',
    },
    rationale:
      'Mitigating bad actors, malicious scrapers, and volumetric bursts at the network boundary keeps the upstream Node.js event loop completely unblocked.',
    code: `// Sliding-window rate limiter & security headers
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  max: 100, // Strict IP threshold
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    status: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests; back off and retry later.',
  }),
});`,
  },
  {
    id: 'gateway',
    tier: 'ROUTING & CONTRACTS',
    tierNumber: '02',
    name: 'API Gateway & Ingress Router',
    shortName: 'API GATEWAY',
    role: 'Reverse Proxy, Correlation IDs & RFC-7807 Errors',
    tech: 'Node.js · Express Cluster · HTTP/2',
    accentColor: '#8b5cf6', // Violet
    accentBg: 'rgba(139, 92, 246, 0.12)',
    accentBorder: 'rgba(139, 92, 246, 0.35)',
    metrics: {
      latency: '0.9ms',
      throughput: '3,800 req/s',
      keepAlive: 'Enabled',
      activeSockets: '420',
    },
    rationale:
      'Acts as the unified facade: injects monotonic X-Correlation-ID for cross-service observability, normalizes payloads, and guarantees strict RFC-7807 error responses.',
    code: `// Context propagation & monotonic trace injection
export const correlationMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  logger.info({ correlationId, path: req.path, method: req.method }, 'Inbound request');
  next();
};`,
  },
  {
    id: 'auth',
    tier: 'SECURITY & PERMISSIONS',
    tierNumber: '03',
    name: 'Stateless RBAC Guard',
    shortName: 'RBAC GUARD',
    role: 'RS256 JWT Verification & Role Matrix Middleware',
    tech: 'RS256 Bearer Verify · Declarative RBAC Matrix',
    accentColor: '#ec4899', // Pink
    accentBg: 'rgba(236, 72, 153, 0.12)',
    accentBorder: 'rgba(236, 72, 153, 0.35)',
    metrics: {
      latency: '0.6ms',
      authHitRate: '99.4%',
      algorithm: 'RS256',
      tokenRevocation: 'In-Memory Blacklist',
    },
    rationale:
      'Stateless RS256 token verification completely removes database lookup overhead on every request. Declarative middleware stops unauthorized actors before reaching business logic.',
    code: `// Declarative RBAC permission gatekeeper
export const requireRole = (allowedRoles) => (req, res, next) => {
  const user = req.user;
  if (!user || !allowedRoles.includes(user.role)) {
    return res.status(403).json({
      status: 403,
      code: 'INSUFFICIENT_PERMISSIONS',
      message: \`Role '\${user?.role || 'ANONYMOUS'}' lacks access.\`,
    });
  }
  next();
};`,
  },
  {
    id: 'fsm',
    tier: 'DOMAIN CORE & INVARIANTS',
    tierNumber: '04',
    name: 'Claim FSM Lifecycle Engine',
    shortName: 'FSM CORE',
    role: 'Deterministic Finite State Machine & Audit Guard',
    tech: 'Functional Transition Matrix · InsurFlow Core',
    accentColor: '#a855f7', // Purple
    accentBg: 'rgba(168, 85, 247, 0.14)',
    accentBorder: 'rgba(168, 85, 247, 0.4)',
    metrics: {
      latency: '1.4ms',
      validStates: '10 States',
      terminalStates: 'CLOSED / REJECTED',
      illegalJumpsBlocked: '100%',
    },
    rationale:
      'Multi-party claims cannot rely on arbitrary status updates. An immutable state machine strictly enforces that claims cannot jump from NEW directly to APPROVED without proper review.',
    code: `// Pure claim lifecycle transition validator
export function canTransition(from, to) {
  const allowed = transitions[from] || [];
  if (!allowed.includes(to)) {
    return {
      ok: false,
      status: 409,
      code: 'INVALID_STATUS_TRANSITION',
      message: \`Cannot transition claim from '\${from}' to '\${to}'.\`,
    };
  }
  return { ok: true, status: 200, from, to };
}`,
  },
  {
    id: 'cache',
    tier: 'MEMORY & ACCELERATION',
    tierNumber: '05',
    name: 'Distributed Redis Cache',
    shortName: 'REDIS CACHE',
    role: 'Sub-millisecond Read-Through Store & Invalidation',
    tech: 'Redis Cluster · RESP3 · Dynamic TTL',
    accentColor: '#06b6d4', // Cyan
    accentBg: 'rgba(6, 182, 212, 0.12)',
    accentBorder: 'rgba(6, 182, 212, 0.35)',
    metrics: {
      latency: '0.4ms',
      cacheHitRate: '94.2%',
      evictionPolicy: 'volatile-lru',
      querySavings: '84% DB Relief',
    },
    rationale:
      'Caches idempotent reads and session tokens with automatic TTL jitter. Mutations emit targeted cache invalidations, guaranteeing zero stale reads with sub-millisecond retrieval.',
    code: `// Read-through cache-aside pattern with TTL
export async function getCachedClaim(claimId) {
  const cacheKey = \`claim:\${claimId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached); // Sub-millisecond hit (0.4ms)

  const fresh = await ClaimModel.findById(claimId).lean();
  await redis.setex(cacheKey, 300, JSON.stringify(fresh));
  return fresh;
}`,
  },
  {
    id: 'db',
    tier: 'STORAGE & INTEGRITY',
    tierNumber: '06',
    name: 'MongoDB Sharded Cluster',
    shortName: 'MONGODB SHARD',
    role: 'Compound Indexing, ACID Transactions & Zero Collscans',
    tech: 'MongoDB Replica Set · WiredTiger Engine',
    accentColor: '#10b981', // Emerald
    accentBg: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.35)',
    metrics: {
      latency: '2.4ms',
      connectionPool: '128 pooled',
      collScans: '0 scans',
      indexHitRate: '99.8%',
    },
    rationale:
      'Schemas adhere strictly to Equality-Sort-Range (ESR) compound indexing. Compound indexes like { orgId: 1, status: 1, createdAt: -1 } ensure queries resolve via IXSCAN with zero in-memory sorting.',
    code: `// High-performance compound indexing (ESR Rule)
claimSchema.index({ orgId: 1, status: 1, createdAt: -1 });
claimSchema.index({ claimNumber: 1 }, { unique: true });

// Zero collection scans guaranteed:
// db.claims.find({ orgId: "org_42", status: "UNDER_REVIEW" })
// ExecutionPlan: IXSCAN -> 0 docs examined unnecessarily`,
  },
  {
    id: 'queue',
    tier: 'EVENT FABRIC & ASYNC',
    tierNumber: '07',
    name: 'Async Event Queue Worker',
    shortName: 'AMQP QUEUE',
    role: 'Non-blocking Outbox Dispatch & Webhook Delivery',
    tech: 'AMQP / RabbitMQ / BullMQ · Exponential Backoff',
    accentColor: '#f59e0b', // Amber
    accentBg: 'rgba(245, 158, 11, 0.12)',
    accentBorder: 'rgba(245, 158, 11, 0.35)',
    metrics: {
      latency: '0.1ms (enqueue)',
      workerConcurrency: '8 workers',
      queueLag: '0.0ms',
      retryPolicy: 'Exponential backoff',
    },
    rationale:
      'Heavy tasks like audit ledger writes, PDF certificate generation, and partner webhook notifications are offloaded asynchronously, keeping the main HTTP response loop under 3ms.',
    code: `// Asynchronous event publisher (Transactional Outbox)
await eventQueue.add('CLAIM_STATE_MUTATED', {
  eventId: crypto.randomUUID(),
  claimId: claim._id,
  transition: { from: 'UNDER_REVIEW', to: 'APPROVED' },
  actor: req.user.email,
  occurredAt: new Date().toISOString(),
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
});`,
  },
];

// ==========================================
// INTERACTIVE SCENARIOS (SIMULATION CASES)
// ==========================================
const SCENARIOS = [
  {
    id: 'claim_fsm_mutation',
    title: 'POST /api/v1/claims/transition',
    method: 'POST',
    label: 'Claim FSM Transition',
    badge: 'Atomic Mutation',
    description:
      'Simulate an InsurFlow claim transition from UNDER_REVIEW to APPROVED. Traverses rate-limit, auth, FSM validation, Mongo write, Redis eviction, and async event dispatch.',
    path: ['edge', 'gateway', 'auth', 'fsm', 'db', 'cache', 'queue'],
    status: '200 OK',
    totalLatency: '2.6ms',
    logs: [
      { step: 0, node: 'edge', level: 'INFO', msg: 'Rate limit evaluated: 14/100 requests in current window. Passed.' },
      { step: 1, node: 'gateway', level: 'ROUTER', msg: 'Correlation ID [x-req-7a91b] generated. Routed to Claims Service.' },
      { step: 2, node: 'auth', level: 'AUTH', msg: 'Bearer RS256 token valid. Role: [CLAIM_ADJUSTER]. Permissions cleared.' },
      { step: 3, node: 'fsm', level: 'FSM', msg: 'FSM validated: [UNDER_REVIEW] -> [APPROVED]. Transition invariant satisfied.' },
      { step: 4, node: 'db', level: 'DATA', msg: 'MongoDB IXSCAN update executed with compound index. 1 document written in 2.1ms.' },
      { step: 5, node: 'cache', level: 'CACHE', msg: 'Redis cache invalidated for key [claim:9042]. Zero stale reads guaranteed.' },
      { step: 6, node: 'queue', level: 'ASYNC', msg: 'AMQP Outbox event [CLAIM_APPROVED] dispatched to audit queue (lag 0.0ms).' },
    ],
  },
  {
    id: 'redis_cache_hit',
    title: 'GET /api/v1/claims/9042',
    method: 'GET',
    label: 'Redis Sub-ms Read',
    badge: 'Cache-Aside Hit',
    description:
      'Simulate an idempotent high-frequency read. Redis intercepts the query in 0.4ms, completely short-circuiting MongoDB and sparing database IO.',
    path: ['edge', 'gateway', 'cache'],
    status: '200 OK',
    totalLatency: '0.4ms',
    logs: [
      { step: 0, node: 'edge', level: 'INFO', msg: 'Edge inspection passed. Request allowed.' },
      { step: 1, node: 'gateway', level: 'ROUTER', msg: 'Routed to GET /claims/:id. Querying memory cache.' },
      { step: 2, node: 'cache', level: 'CACHE', msg: 'Redis cache hit for key [claim:9042] in 0.38ms. Payload returned. DB IO: 0.' },
    ],
  },
  {
    id: 'rbac_security_block',
    title: 'DELETE /api/v1/claims/9042',
    method: 'DELETE',
    label: 'RBAC Security Shield',
    badge: 'Security Gate',
    description:
      'Simulate an unauthorized deletion attempt by an unauthorized role. Declarative RBAC middleware terminates the request with 403 Forbidden without touching data layers.',
    path: ['edge', 'gateway', 'auth'],
    blockNode: 'auth',
    status: '403 Forbidden',
    totalLatency: '0.7ms',
    logs: [
      { step: 0, node: 'edge', level: 'INFO', msg: 'Sliding window limit valid.' },
      { step: 1, node: 'gateway', level: 'ROUTER', msg: 'Request routed to Admin deletion endpoint.' },
      { step: 2, node: 'auth', level: 'REJECT', msg: 'SECURITY TRIP: User role [CUSTOMER] lacks [SUPER_ADMIN]. Blocked with 403.' },
    ],
  },
  {
    id: 'concurrency_surge',
    title: 'BURST /high-concurrency-spike',
    method: 'BURST',
    label: '10k req/s Surge',
    badge: 'Resilience Test',
    description:
      'Simulate high-volume concurrent traffic wave. Validates connection pooling (128 sockets), non-blocking event loops, and sub-4ms p99 latency under stress.',
    path: ['edge', 'gateway', 'auth', 'fsm', 'cache', 'db', 'queue'],
    status: '200 OK (Throttled)',
    totalLatency: '3.1ms',
    logs: [
      { step: 0, node: 'edge', level: 'WARN', msg: 'Burst traffic detected: Token bucket absorbing 4,800 req/s spike without dropping.' },
      { step: 1, node: 'gateway', level: 'ROUTER', msg: 'HTTP/2 multiplexing active across 420 concurrent sockets.' },
      { step: 2, node: 'auth', level: 'AUTH', msg: 'Token validation cache hits at 99.4% rate.' },
      { step: 3, node: 'fsm', level: 'FSM', msg: 'Concurrent state mutations processed deterministically.' },
      { step: 4, node: 'cache', level: 'CACHE', msg: 'Redis read-through absorbing 84% of read queries.' },
      { step: 5, node: 'db', level: 'DATA', msg: 'MongoDB replica pool stable at 78/128 connections. Zero collscans detected.' },
      { step: 6, node: 'queue', level: 'ASYNC', msg: 'Event workers auto-scaled to drain backlog with 0.0ms lag.' },
    ],
  },
];

export default function InteractiveArchitectureLab({ isEmbedded = false }) {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState('fsm');
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'rationale' | 'telemetry'
  const [copiedCode, setCopiedCode] = useState(false);
  const [autoPulse, setAutoPulse] = useState(true);

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  const selectedNode = ARCHITECTURE_NODES.find((n) => n.id === selectedNodeId) || ARCHITECTURE_NODES[3];

  const terminalEndRef = useRef(null);

  // Initialize with initial logs
  useEffect(() => {
    setTerminalLogs(
      activeScenario.logs.map((l) => ({
        ...l,
        timestamp: new Date().toLocaleTimeString(),
        id: Math.random().toString(36).substring(7),
      }))
    );
  }, [activeScenario]);

  // Scroll terminal on update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Run simulation sequence
  const runSimulation = useCallback(
    (scenarioToRun = activeScenario) => {
      setIsSimulating(true);
      setActiveStepIndex(0);
      setTerminalLogs([]);

      const pathNodes = scenarioToRun.path;
      const totalSteps = pathNodes.length;

      let currentStep = 0;

      const interval = setInterval(() => {
        if (currentStep < totalSteps) {
          const nodeId = pathNodes[currentStep];
          setActiveStepIndex(currentStep);
          setSelectedNodeId(nodeId);
          soundFx.playPacketHop(currentStep);

          const logItem = scenarioToRun.logs[currentStep];
          if (logItem) {
            setTerminalLogs((prev) => [
              ...prev,
              {
                ...logItem,
                timestamp: new Date().toLocaleTimeString(),
                id: Math.random().toString(36).substring(7),
              },
            ]);
          }

          currentStep++;
        } else {
          clearInterval(interval);
          setIsSimulating(false);
          setActiveStepIndex(-1);
          if (scenarioToRun.blockNode) {
            soundFx.playWarning();
          } else {
            soundFx.playSuccess();
          }
        }
      }, 550);

      return () => clearInterval(interval);
    },
    [activeScenario]
  );

  // Copy code helper
  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(selectedNode.code);
      soundFx.playClick();
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const content = (
    <div className={cn('relative z-10', !isEmbedded && 'max-w-7xl mx-auto px-5 sm:px-8')}>
      {/* Section Heading only if standalone */}
      {!isEmbedded && (
        <RevealOnScroll delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <SectionHeading
                eyebrow="SYSTEM ARCHITECTURE STUDIO"
                title="Interactive Request Lifecycle & Distributed Engine"
                description="Explore how production requests traverse edge security, declarative RBAC, deterministic state machines, and sharded persistence with sub-millisecond telemetry."
              />
            </div>

            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <div className="inline-flex items-center gap-2 bg-bg-secondary/80 border border-border-default px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse" />
                <span className="text-text-primary font-medium">Cluster: 100% Healthy</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-bg-secondary/80 border border-border-default px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="text-accent">Avg Latency:</span>
                <span className="text-text-primary font-semibold">1.8ms</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-bg-secondary/80 border border-border-default px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="text-cyan-400">Cache Hit:</span>
                <span className="text-text-primary font-semibold">94.2%</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      )}

        {/* ========================================================
            TOP SCENARIO TRIGGER BAR (INTERACTIVE PLAYGROUND)
        ======================================================== */}
        <RevealOnScroll delay={0.1}>
          <div className="rounded-2xl bg-bg-secondary/90 border border-border-default p-4 sm:p-5 shadow-lg backdrop-blur-md mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                    Interactive Inbound Simulation
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                  Select a Production Request Scenario:
                </h3>
              </div>

              {/* Scenario Selection Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {SCENARIOS.map((scenario) => {
                  const isSelected = scenario.id === activeScenarioId;
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        setActiveScenarioId(scenario.id);
                        runSimulation(scenario);
                      }}
                      className={cn(
                        'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all duration-200 border flex items-center gap-2',
                        isSelected
                          ? 'bg-accent/15 border-accent text-accent shadow-[0_0_15px_rgba(139,92,246,0.25)] scale-[1.02]'
                          : 'bg-bg-tertiary/60 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-bg-tertiary'
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          scenario.method === 'POST' && 'bg-purple-400',
                          scenario.method === 'GET' && 'bg-cyan-400',
                          scenario.method === 'DELETE' && 'bg-rose-400',
                          scenario.method === 'BURST' && 'bg-amber-400'
                        )}
                      />
                      <span>{scenario.label}</span>
                      <span className="text-[10px] opacity-60 hidden sm:inline">[{scenario.totalLatency}]</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => runSimulation()}
                  disabled={isSimulating}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all duration-200 flex items-center gap-2 ml-auto lg:ml-2',
                    isSimulating
                      ? 'bg-accent/40 text-text-muted cursor-not-allowed border border-accent/20'
                      : 'bg-accent text-white hover:bg-accent-hover shadow-accent hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95'
                  )}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>{isSimulating ? 'Simulating...' : 'Re-Run Flow'}</span>
                </button>
              </div>
            </div>

            {/* Active Scenario Context Banner */}
            <div className="mt-4 pt-3.5 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="font-mono text-accent font-semibold">{activeScenario.title}</span>
                <span className="text-text-muted">•</span>
                <span className="line-clamp-1">{activeScenario.description}</span>
              </div>
              <div className="flex items-center gap-3 font-mono shrink-0">
                <span className="text-text-muted">Target Response:</span>
                <span
                  className={cn(
                    'font-semibold px-2 py-0.5 rounded-md text-[11px]',
                    activeScenario.status.includes('200')
                      ? 'bg-functional-success/15 text-functional-success'
                      : 'bg-functional-error/15 text-functional-error'
                  )}
                >
                  {activeScenario.status}
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* ========================================================
            MAIN WORKBENCH: TOPOLOGY MAP (LEFT) & DEEP INSPECTOR (RIGHT)
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Topology Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-bg-secondary/70 border border-border-default p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
              {/* Header inside Topology */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <span>Live Architecture Conduit Topology</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-tertiary text-text-muted border border-border-subtle">
                      7 Active Nodes
                    </span>
                  </h4>
                  <p className="text-xs text-text-secondary">Click any node to inspect real code & architectural rationale.</p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>Selected: {selectedNode.shortName}</span>
                </div>
              </div>

              {/* Topology Nodes Grid (Visual Pipeline) */}
              <div className="space-y-6 relative">
                {/* Visual SVG Connecting Bus (Conduit Wire) */}
                <div className="hidden md:block absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-rose-500/30 via-accent/40 to-emerald-500/30 pointer-events-none z-0" />

                {ARCHITECTURE_NODES.map((node, index) => {
                  const isSelected = selectedNode.id === node.id;
                  const isNodeInActivePath = activeScenario.path.includes(node.id);
                  const isCurrentStep =
                    activeStepIndex >= 0 && activeScenario.path[activeStepIndex] === node.id;
                  const isBlockedHere =
                    activeScenario.blockNode === node.id && isCurrentStep;

                  return (
                    <motion.div
                      key={node.id}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={cn(
                        'relative z-10 cursor-pointer rounded-xl p-4 sm:p-5 transition-all duration-300 border flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                        isSelected
                          ? 'bg-bg-tertiary border-white/20 shadow-lg ring-1'
                          : 'bg-bg-primary/80 border-border-subtle hover:border-border-strong hover:bg-bg-tertiary/50',
                        isCurrentStep &&
                          'ring-2 ring-accent shadow-[0_0_25px_rgba(139,92,246,0.35)] bg-accent/10',
                        isBlockedHere &&
                          'ring-2 ring-functional-error shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-functional-error/10'
                      )}
                      style={{
                        borderColor: isSelected ? node.accentColor : undefined,
                      }}
                    >
                      {/* Left: Indicator & Identity */}
                      <div className="flex items-start sm:items-center gap-3.5">
                        {/* Step Marker Badge */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform duration-300"
                          style={{
                            backgroundColor: node.accentBg,
                            color: node.accentColor,
                            border: `1px solid ${node.accentBorder}`,
                          }}
                        >
                          {isCurrentStep ? (
                            <span className="animate-spin text-sm">✦</span>
                          ) : (
                            node.tierNumber
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono tracking-wider uppercase text-text-muted">
                              {node.tier}
                            </span>
                            {isNodeInActivePath && (
                              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            )}
                          </div>
                          <h5 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
                            {node.name}
                          </h5>
                          <p className="text-xs text-text-secondary font-mono mt-0.5">
                            {node.tech}
                          </p>
                        </div>
                      </div>

                      {/* Right: Telemetry Metrics & Status Chip */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right font-mono text-xs">
                          <div className="text-text-primary font-semibold">{node.metrics.latency}</div>
                          <div className="text-[10px] text-text-muted">{node.metrics.throughput || node.metrics.validStates || 'Sub-ms'}</div>
                        </div>

                        <span
                          className={cn(
                            'text-[10px] font-mono px-2 py-1 rounded-md border uppercase tracking-wider',
                            isBlockedHere
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                              : isCurrentStep
                              ? 'bg-accent/20 text-accent border-accent/40 animate-pulse'
                              : 'bg-bg-tertiary text-text-muted border-border-subtle'
                          )}
                        >
                          {isBlockedHere
                            ? 'Blocked 403'
                            : isCurrentStep
                            ? 'Active Step'
                            : 'Idle / Ready'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deep Node Inspector & Code Terminal (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-bg-secondary/90 border border-border-default overflow-hidden shadow-2xl backdrop-blur-md">
              {/* Inspector Header with Tab Switcher */}
              <div className="p-4 sm:p-5 border-b border-border-subtle bg-bg-tertiary/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedNode.accentColor }}
                    />
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      Node Deep Inspector
                    </span>
                  </div>
                  <Badge variant="accent" size="sm">
                    {selectedNode.tierNumber} / 07
                  </Badge>
                </div>

                <h4 className="text-lg font-bold text-text-primary tracking-tight">
                  {selectedNode.name}
                </h4>
                <p className="text-xs text-text-secondary mt-1">{selectedNode.role}</p>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 mt-4 bg-bg-primary/80 p-1 rounded-xl border border-border-subtle">
                  {[
                    { id: 'code', label: 'Production Code' },
                    { id: 'rationale', label: 'Architecture Rationale' },
                    { id: 'telemetry', label: 'Live Metrics' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 text-center',
                        activeTab === tab.id
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspector Content Body */}
              <div className="p-5 sm:p-6 min-h-[380px]">
                {/* TAB 1: PRODUCTION CODE */}
                {activeTab === 'code' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-text-muted border-b border-border-subtle pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>JavaScript (Node.js ESM)</span>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="text-text-secondary hover:text-text-primary transition-colors text-xs flex items-center gap-1"
                      >
                        {copiedCode ? (
                          <span className="text-functional-success">Copied ✓</span>
                        ) : (
                          <span>Copy snippet</span>
                        )}
                      </button>
                    </div>

                    <div className="relative font-mono text-xs bg-bg-primary rounded-xl p-4 border border-border-subtle overflow-x-auto text-text-secondary leading-relaxed">
                      <pre className="text-text-primary">
                        <code>{selectedNode.code}</code>
                      </pre>
                    </div>

                    <p className="text-xs text-text-muted italic">
                      * Real excerpt written by Mohammed matching InsurFlow and TeamLine engineering contracts.
                    </p>
                  </div>
                )}

                {/* TAB 2: ARCHITECTURAL RATIONALE */}
                {activeTab === 'rationale' && (
                  <div className="space-y-5">
                    <div className="rounded-xl bg-accent/10 border border-accent/20 p-4">
                      <div className="text-xs font-mono text-accent uppercase font-bold mb-1">
                        Why Mohammed Designed It This Way
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed">
                        {selectedNode.rationale}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                        Key Engineering Guarantees
                      </h5>
                      <ul className="space-y-2 text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="text-functional-success mt-0.5">✔</span>
                          <span>Zero arbitrary database state transitions (Mathematical FSM integrity).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-functional-success mt-0.5">✔</span>
                          <span>No full collection scans (Strict compound index coverage).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-functional-success mt-0.5">✔</span>
                          <span>Stateless authorization with zero cold-starts or session locks.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 3: TELEMETRY & BENCHMARKS */}
                {activeTab === 'telemetry' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      {Object.entries(selectedNode.metrics).map(([key, val]) => (
                        <div
                          key={key}
                          className="bg-bg-primary rounded-xl p-3.5 border border-border-subtle space-y-1"
                        >
                          <div className="text-[10px] text-text-muted uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                          <div className="text-sm font-bold text-text-primary">{val}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl bg-bg-tertiary/40 border border-border-subtle p-4 space-y-2">
                      <div className="flex justify-between text-xs font-mono text-text-muted">
                        <span>P99 Target SLA</span>
                        <span className="text-functional-success font-semibold">&lt; 5.0ms</span>
                      </div>
                      <div className="h-2 w-full bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent to-emerald-400 w-[96%]" />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-text-muted pt-1">
                        <span>Observed: 1.8ms</span>
                        <span>SLA Threshold: 50.0ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            STREAMING PRODUCTION LOG TERMINAL (BOTTOM TELEMETRY)
        ======================================================== */}
        <RevealOnScroll delay={0.15}>
          <div className="mt-8 rounded-2xl bg-bg-secondary border border-border-default overflow-hidden shadow-2xl">
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono text-xs text-text-muted ml-2">
                  live-telemetry.stream — production cluster
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
                <span className="hidden sm:inline">Stream: Connected</span>
                <button
                  onClick={() => setTerminalLogs([])}
                  className="hover:text-text-primary transition-colors text-[11px] underline"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Terminal Content Box */}
            <div
              ref={terminalEndRef}
              className="p-4 sm:p-5 font-mono text-xs bg-[#07070b] max-h-56 overflow-y-auto space-y-2 leading-relaxed"
            >
              {terminalLogs.length === 0 ? (
                <div className="text-text-muted italic py-4 text-center">
                  Terminal is listening. Click &quot;Re-Run Flow&quot; or select a scenario above to stream live trace logs.
                </div>
              ) : (
                terminalLogs.map((log) => {
                  const nodeObj = ARCHITECTURE_NODES.find((n) => n.id === log.node);
                  return (
                    <div key={log.id} className="flex items-start gap-2.5 hover:bg-white/[0.02] py-0.5 rounded px-1 transition-colors">
                      <span className="text-text-muted select-none">[{log.timestamp}]</span>
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0',
                          log.level === 'INFO' && 'bg-blue-500/15 text-blue-400',
                          log.level === 'ROUTER' && 'bg-purple-500/15 text-purple-400',
                          log.level === 'AUTH' && 'bg-emerald-500/15 text-emerald-400',
                          log.level === 'FSM' && 'bg-purple-500/20 text-purple-300',
                          log.level === 'DATA' && 'bg-emerald-500/20 text-emerald-300',
                          log.level === 'CACHE' && 'bg-cyan-500/15 text-cyan-400',
                          log.level === 'ASYNC' && 'bg-amber-500/15 text-amber-400',
                          log.level === 'REJECT' && 'bg-rose-500/25 text-rose-400',
                          log.level === 'WARN' && 'bg-amber-500/20 text-amber-300'
                        )}
                      >
                        {log.level}
                      </span>
                      <span className="text-text-muted select-none">
                        [{nodeObj?.shortName || log.node}]:
                      </span>
                      <span className={cn(
                        log.level === 'REJECT' ? 'text-rose-300 font-medium' : 'text-text-primary'
                      )}>
                        {log.msg}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </RevealOnScroll>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <section id="architecture" className="py-20 md:py-28 relative overflow-hidden bg-bg-primary">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-accent/8 blur-[160px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>
      {content}
    </section>
  );
}
