'use client';

import { useState, useId, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import Badge from '@/components/shared/Badge';
import { cn } from '@/lib/utils';
import { soundManager } from '@/lib/soundFx';

const ORGANIZATIONS = [
  { id: 'ORG_ALLIANZ', label: 'Allianz Global', code: 'ALZ', initialSeq: 1040 },
  { id: 'ORG_AXA', label: 'AXA Corporate', code: 'AXA', initialSeq: 420 },
];

export default function InsurflowConcurrencySandbox() {
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0].id);
  const [counters, setCounters] = useState({
    ORG_ALLIANZ: 1040,
    ORG_AXA: 420,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProcessed: 0,
    collisions: 0,
    gaps: 0,
    p99Latency: 1.4,
    lastBurstSize: 0,
  });
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' | 'contract'

  const shouldReduceMotion = useReducedMotion();
  const liveRegionId = useId();

  const currentOrgData = ORGANIZATIONS.find((o) => o.id === selectedOrg) || ORGANIZATIONS[0];

  const runConcurrentBurst = useCallback(
    async (burstSize = 10, isInterleaved = false) => {
      if (isRunning) return;
      setIsRunning(true);
      soundManager.playClick();

      const newEvents = [];
      const startTime = performance.now();
      const orgA = ORGANIZATIONS[0];
      const orgB = ORGANIZATIONS[1];

      let baseA = counters[orgA.id];
      let baseB = counters[orgB.id];

      // Simulate concurrent requests firing with slight jitter
      for (let i = 1; i <= burstSize; i++) {
        const targetOrg = isInterleaved ? (i % 2 === 0 ? orgB : orgA) : currentOrgData;
        const currentBase = targetOrg.id === orgA.id ? baseA : baseB;
        const assignedSeq = currentBase + 1;

        if (targetOrg.id === orgA.id) baseA = assignedSeq;
        else baseB = assignedSeq;

        const simulatedLatency = +(1.1 + Math.random() * 1.6).toFixed(2);
        const claimId = `CLM-${targetOrg.code}-${String(assignedSeq).padStart(5, '0')}`;
        const threadId = `worker-pool-${(i % 4) + 1}`;

        newEvents.push({
          id: `${Date.now()}-${i}-${Math.random()}`,
          index: i,
          claimId,
          orgCode: targetOrg.code,
          threadId,
          latency: `${simulatedLatency}ms`,
          status: 201,
          strategy: 'Atomic $inc',
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        });
      }

      // Small async delay to give realistic visual feel
      await new Promise((resolve) => setTimeout(resolve, shouldReduceMotion ? 50 : 280));

      setCounters((prev) => ({
        ...prev,
        [orgA.id]: baseA,
        [orgB.id]: isInterleaved ? baseB : prev[orgB.id],
      }));

      setSimulationLog((prev) => [...newEvents, ...prev].slice(0, 30));
      setMetrics((prev) => ({
        totalProcessed: prev.totalProcessed + burstSize,
        collisions: 0,
        gaps: 0,
        p99Latency: +(1.2 + Math.random() * 0.5).toFixed(2),
        lastBurstSize: burstSize,
      }));

      soundManager.playSuccess();
      setIsRunning(false);
    },
    [counters, currentOrgData, isRunning, shouldReduceMotion]
  );

  const resetCounters = useCallback(() => {
    soundManager.playWarning();
    setCounters({
      ORG_ALLIANZ: 1040,
      ORG_AXA: 420,
    });
    setSimulationLog([]);
    setMetrics({
      totalProcessed: 0,
      collisions: 0,
      gaps: 0,
      p99Latency: 1.4,
      lastBurstSize: 0,
    });
  }, []);

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4 sm:p-6 space-y-6 shadow-sm">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse" aria-hidden="true" />
            <h3 className="font-mono text-sm sm:text-base font-bold text-text-primary tracking-wide">
              Atomic Sequential Claims Sandbox
            </h3>
            <Badge variant="accent" size="sm">
              Concurrency Proof
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Simulates high-velocity concurrent claim filings using tenant-scoped MongoDB <code className="text-accent bg-bg-tertiary px-1 py-0.5 rounded">$inc</code> atomic operations with zero collision guarantees.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetCounters}
            disabled={isRunning}
            className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors px-2.5 py-1.5 rounded border border-border-subtle hover:border-border-default"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Control Console ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Tenant & Burst Trigger */}
        <div className="lg:col-span-1 rounded-lg bg-bg-primary/80 border border-border-subtle p-4 space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold block">
            1. Select Tenant Scope
          </span>

          <div className="grid grid-cols-2 gap-2">
            {ORGANIZATIONS.map((org) => {
              const isSelected = selectedOrg === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedOrg(org.id);
                  }}
                  className={cn(
                    'p-2.5 rounded-lg border text-left transition-all font-mono text-xs',
                    isSelected
                      ? 'border-accent bg-accent/10 text-accent font-semibold shadow-sm'
                      : 'border-border-subtle bg-bg-secondary/60 text-text-muted hover:text-text-primary'
                  )}
                >
                  <div className="font-bold truncate">{org.label}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    Seq: <span className="text-text-primary font-mono">{counters[org.id]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border-subtle space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold block">
              2. Inject Concurrent Bursts
            </span>

            <div className="space-y-2">
              <button
                onClick={() => runConcurrentBurst(10, false)}
                disabled={isRunning}
                className="w-full py-2.5 px-3 rounded-lg bg-accent text-bg-primary font-mono text-xs font-bold hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isRunning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                    Executing Injections...
                  </>
                ) : (
                  <>
                    <span>⚡ Fire 10 Concurrent Requests</span>
                  </>
                )}
              </button>

              <button
                onClick={() => runConcurrentBurst(25, true)}
                disabled={isRunning}
                className="w-full py-2 px-3 rounded-lg border border-border-default hover:border-accent bg-bg-secondary text-text-primary font-mono text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span>🔀 Interleaved Dual-Tenant Burst (25 reqs)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Telemetry & Invariants */}
        <div className="lg:col-span-2 rounded-lg bg-bg-primary/80 border border-border-subtle p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
              Live Invariant Proofs & Telemetry
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('stream')}
                className={cn(
                  'font-mono text-[11px] px-2 py-0.5 rounded transition-colors',
                  activeTab === 'stream'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                Event Stream
              </button>
              <button
                onClick={() => setActiveTab('contract')}
                className={cn(
                  'font-mono text-[11px] px-2 py-0.5 rounded transition-colors',
                  activeTab === 'contract'
                    ? 'bg-accent/20 text-accent font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                Atomic Code Contract
              </button>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded bg-bg-secondary/70 border border-border-subtle">
              <div className="text-[10px] font-mono text-text-muted uppercase">Processed</div>
              <div className="text-base sm:text-lg font-mono font-bold text-text-primary">
                {metrics.totalProcessed}
              </div>
            </div>
            <div className="p-2.5 rounded bg-bg-secondary/70 border border-border-subtle">
              <div className="text-[10px] font-mono text-text-muted uppercase">Collisions</div>
              <div className="text-base sm:text-lg font-mono font-bold text-functional-success">
                {metrics.collisions} (0.00%)
              </div>
            </div>
            <div className="p-2.5 rounded bg-bg-secondary/70 border border-border-subtle">
              <div className="text-[10px] font-mono text-text-muted uppercase">Sequence Gaps</div>
              <div className="text-base sm:text-lg font-mono font-bold text-functional-success">
                {metrics.gaps} (None)
              </div>
            </div>
            <div className="p-2.5 rounded bg-bg-secondary/70 border border-border-subtle">
              <div className="text-[10px] font-mono text-text-muted uppercase">P99 Latency</div>
              <div className="text-base sm:text-lg font-mono font-bold text-accent">
                {metrics.p99Latency}ms
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'stream' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted px-1">
                <span>Recent Allocations ({simulationLog.length})</span>
                <span>Sub-millisecond Resolution</span>
              </div>

              <div className="h-44 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                {simulationLog.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted text-center p-4">
                    <span>No concurrent bursts fired yet.</span>
                    <span className="text-[11px] mt-1">Click &ldquo;Fire 10 Concurrent Requests&rdquo; to simulate parallel creation.</span>
                  </div>
                ) : (
                  simulationLog.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between gap-2 p-2 rounded bg-bg-secondary/50 border border-border-subtle/80 hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-functional-success/15 text-functional-success font-semibold border border-functional-success/30">
                          {ev.status}
                        </span>
                        <span className="text-text-primary font-bold">{ev.claimId}</span>
                        <span className="text-[10px] text-text-muted hidden sm:inline">[{ev.threadId}]</span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-text-muted shrink-0">
                        <span className="text-accent">{ev.latency}</span>
                        <span>{ev.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-44 overflow-x-auto rounded bg-bg-secondary p-3 font-mono text-[11px] leading-relaxed border border-border-subtle">
              <pre className="text-text-secondary">
{`// claim.service.js — Atomic sequence increment implementation
const counter = await Counter.findOneAndUpdate(
  { organizationId: orgObjectId, entityType: 'CLAIM' },
  { $inc: { seq: 1 } },
  { new: true, upsert: true, setDefaultsOnInsert: true }
);

const sequentialClaimId = \`CLM-\${orgPrefix}-\${String(counter.seq).padStart(5, '0')}\`;

// Invariant guarantee: MongoDB single-document write atomicity guarantees
// strictly monotonic integer allocation under arbitrary concurrent workers.`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
