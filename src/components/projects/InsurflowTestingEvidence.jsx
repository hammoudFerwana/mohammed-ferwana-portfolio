'use client';

import { useState } from 'react';
import Badge from '@/components/shared/Badge';
import { cn } from '@/lib/utils';

/**
 * InsurflowTestingEvidence — Verified backend testing evidence artifact.
 *
 * Implements Section 08 (Testing & Reliability) for InsurFlow based on
 * the approved P2.4 Evidence Selection & Prioritization:
 * - Pillar 1 (EVD-001): Workflow Integrity & FSM Transition Gate (409 Conflict)
 * - Pillar 2 (EVD-002 + EVD-003): Multi-Tenant Data Integrity (Concurrency + Compound Unique Index)
 * - Pillar 3 (EVD-004): Stealth Multi-Tenant Security (404 Anti-Enumeration)
 * - Supporting (EVD-007 & EVD-006): Isolated in-memory replica harness & API rate limiting
 */
export default function InsurflowTestingEvidence() {
  const [activePillar, setActivePillar] = useState('workflow'); // 'workflow' | 'dataintegrity' | 'stealth'
  const [dataSubTab, setDataSubTab] = useState('concurrency'); // 'concurrency' | 'index'

  return (
    <div className="space-y-6">
      {/* ── Section Intro & Narrative ── */}
      <div className="rounded-xl bg-bg-secondary border border-border-default p-5 sm:p-7 space-y-5">
        <div className="space-y-2 border-b border-border-subtle pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm">
                Verified Test Evidence
              </Badge>
              <span className="font-mono text-xs text-text-muted">
                tests/claim.statusMachine.test.js & claim.numbering.test.js
              </span>
            </div>
            <span className="font-mono text-xs text-functional-success flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse" />
              Automated Integration Suite
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-[72ch]">
            The InsurFlow backend is tested around critical business invariants,
            tenant boundary isolation, database integrity constraints, and defensive API behavior —
            not only happy-path responses.
          </p>
        </div>

        {/* ── Test Infrastructure & Contextual Metadata Badge Bar (EVD-007 + Secondary Metadata) ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-text-muted font-medium mr-1">
              Test Stack:
            </span>
            <Badge variant="neutral" size="sm">Jest 29</Badge>
            <Badge variant="neutral" size="sm">Supertest 6</Badge>
            <Badge variant="neutral" size="sm">MongoMemoryServer 9</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-muted bg-bg-tertiary px-2.5 py-1 rounded border border-border-subtle">
              Suite Execution: 387 automated tests across 27 suites
            </span>
          </div>
        </div>
      </div>

      {/* ── Core Evidence Pillars Card ── */}
      <div className="rounded-xl bg-bg-secondary border border-border-default overflow-hidden p-5 sm:p-7 space-y-6">
        {/* Pillar Switcher */}
        <div
          role="tablist"
          aria-label="InsurFlow Core Testing Evidence Pillars"
          className="flex flex-col sm:flex-row p-1 bg-bg-primary/80 rounded-lg border border-border-subtle gap-1"
        >
          <button
            type="button"
            role="tab"
            id="tab-workflow"
            aria-selected={activePillar === 'workflow'}
            aria-controls="panel-workflow"
            onClick={() => setActivePillar('workflow')}
            className={cn(
              'flex-1 py-2 px-3 text-xs sm:text-sm font-mono font-medium rounded-md transition-all duration-200 text-center',
              activePillar === 'workflow'
                ? 'bg-bg-tertiary text-text-primary shadow-sm border border-border-default'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            01. Workflow Integrity
          </button>
          <button
            type="button"
            role="tab"
            id="tab-dataintegrity"
            aria-selected={activePillar === 'dataintegrity'}
            aria-controls="panel-dataintegrity"
            onClick={() => setActivePillar('dataintegrity')}
            className={cn(
              'flex-1 py-2 px-3 text-xs sm:text-sm font-mono font-medium rounded-md transition-all duration-200 text-center',
              activePillar === 'dataintegrity'
                ? 'bg-bg-tertiary text-text-primary shadow-sm border border-border-default'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            02. Multi-Tenant Data Integrity
          </button>
          <button
            type="button"
            role="tab"
            id="tab-stealth"
            aria-selected={activePillar === 'stealth'}
            aria-controls="panel-stealth"
            onClick={() => setActivePillar('stealth')}
            className={cn(
              'flex-1 py-2 px-3 text-xs sm:text-sm font-mono font-medium rounded-md transition-all duration-200 text-center',
              activePillar === 'stealth'
                ? 'bg-bg-tertiary text-text-primary shadow-sm border border-border-default'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            03. Stealth Multi-Tenant Security
          </button>
        </div>

        {/* ──────────────── PILLAR 1: WORKFLOW INTEGRITY (EVD-001) ──────────────── */}
        {activePillar === 'workflow' && (
          <div
            role="tabpanel"
            id="panel-workflow"
            aria-labelledby="tab-workflow"
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-mono font-semibold text-text-primary flex items-center gap-2">
                  <span className="text-accent">Pillar 1:</span>
                  FSM State Transition Gate & HTTP 409 Error Contract
                </h4>
                <Badge variant="warning" size="sm">
                  HTTP 409 Conflict
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Validated claim lifecycle transitions with automated integration tests that reject invalid transitions
                with HTTP 409 and an explicit error payload, preventing illegal bypasses (e.g. submitting inspection before assignment).
              </p>
            </div>

            {/* Code Excerpt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>tests/claim.statusMachine.test.js (Lines 530–542)</span>
                <span>Supertest + MongoMemoryServer</span>
              </div>
              <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-text-secondary">
                <pre className="text-text-secondary">
                  <span className="text-accent-secondary">it</span>(<span className="text-functional-success">&apos;should return 409 when calling /inspection/submit on an ASSIGNED claim&apos;</span>, <span className="text-accent-secondary">async</span> () =&gt; {'{'}{'\n'}
                  {'  '}<span className="text-accent-secondary">await</span> Claim.<span className="text-accent">findByIdAndUpdate</span>(testClaim._id, {'{'}{'\n'}
                  {'    '}status: <span className="text-functional-success">&apos;ASSIGNED&apos;</span>,{'\n'}
                  {'    '}vehicle: {'{'} vehicleId: vehicle._id, plateNumber: <span className="text-functional-success">&apos;ABC-123&apos;</span> {'}'},{'\n'}
                  {'    '}accident: {'{'} accidentType: <span className="text-functional-success">&apos;COLLISION&apos;</span> {'}'},{'\n'}
                  {'    '}location: {'{'} latitude: <span className="text-functional-warning">20</span>, longitude: <span className="text-functional-warning">30</span> {'}'},{'\n'}
                  {'  '}{'}'});{'\n\n'}
                  {'  '}<span className="text-accent-secondary">const</span> res = <span className="text-accent-secondary">await</span> <span className="text-accent">request</span>(app){'\n'}
                  {'    '}.<span className="text-accent">post</span>(<span className="text-functional-success">`/api/v1/claims/${'{'}testClaim._id{'}'}/inspection/submit`</span>){'\n'}
                  {'    '}.<span className="text-accent">set</span>(<span className="text-functional-success">&apos;Authorization&apos;</span>, <span className="text-functional-success">`Bearer ${'{'}adjuster1Token{'}'}`</span>);{'\n\n'}
                  {'  '}<span className="text-accent">expect</span>(res.status).<span className="text-accent">toBe</span>(<span className="text-functional-warning">409</span>);{'\n'}
                  {'  '}<span className="text-accent">expect</span>(res.body.errors[<span className="text-functional-warning">0</span>].code).<span className="text-accent">toBe</span>(<span className="text-functional-success">&apos;INVALID_STATUS_TRANSITION&apos;</span>);{'\n'}
                  {'}'});
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-bg-tertiary/60 border border-border-subtle text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary font-medium">Engineering Guarantee: </strong>
              The claim lifecycle cannot be bypassed through direct endpoint invocation. Every transition is mediated
              by an immutable transition map at the service layer, returning predictable error envelopes.
            </div>
          </div>
        )}

        {/* ──────────────── PILLAR 2: MULTI-TENANT DATA INTEGRITY (EVD-002 + EVD-003) ──────────────── */}
        {activePillar === 'dataintegrity' && (
          <div
            role="tabpanel"
            id="panel-dataintegrity"
            aria-labelledby="tab-dataintegrity"
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-mono font-semibold text-text-primary flex items-center gap-2">
                  <span className="text-accent">Pillar 2:</span>
                  Application Concurrency Protection + Database Uniqueness Constraint
                </h4>
                <Badge variant="accent" size="sm">
                  Data Layer Hardening
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                A two-layer data integrity guarantee: application-level atomic counter allocation combined with
                storage-engine B-tree compound unique indexing, verified to prevent collisions under concurrent load.
              </p>
            </div>

            {/* Sub-Tabs for EVD-002 vs EVD-003 */}
            <div
              role="tablist"
              aria-label="Data Integrity Evidence Perspectives"
              className="flex border-b border-border-subtle gap-4 text-xs font-mono"
            >
              <button
                type="button"
                role="tab"
                id="subtab-concurrency"
                aria-selected={dataSubTab === 'concurrency'}
                aria-controls="subpanel-concurrency"
                onClick={() => setDataSubTab('concurrency')}
                className={cn(
                  'pb-2 border-b-2 font-medium transition-colors',
                  dataSubTab === 'concurrency'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                Layer 1: Concurrency Safety (Promise.all)
              </button>
              <button
                type="button"
                role="tab"
                id="subtab-index"
                aria-selected={dataSubTab === 'index'}
                aria-controls="subpanel-index"
                onClick={() => setDataSubTab('index')}
                className={cn(
                  'pb-2 border-b-2 font-medium transition-colors',
                  dataSubTab === 'index'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                Layer 2: Database Catalog Constraint Assertion
              </button>
            </div>

            {/* Sub-Panel A: EVD-002 */}
            {dataSubTab === 'concurrency' && (
              <div
                role="tabpanel"
                id="subpanel-concurrency"
                aria-labelledby="subtab-concurrency"
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>tests/claim.numbering.test.js (Lines 137–158)</span>
                  <span>EVD-002: Concurrent Atomic Sequence</span>
                </div>
                <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-text-secondary">
                  <pre className="text-text-secondary">
                    <span className="text-accent-secondary">it</span>(<span className="text-functional-success">&apos;should produce 15 unique sequential numbers under concurrent creation within a single tenant&apos;</span>, <span className="text-accent-secondary">async</span> () =&gt; {'{'}{'\n'}
                    {'  '}<span className="text-accent-secondary">const</span> promises = Array.<span className="text-accent">from</span>({'{'} length: <span className="text-functional-warning">15</span> {'}'}, () =&gt;{'\n'}
                    {'    '}<span className="text-accent">createClaimForOrg</span>(orgA._id, officerA._id){'\n'}
                    {'  '});{'\n\n'}
                    {'  '}<span className="text-accent-secondary">const</span> claims = <span className="text-accent-secondary">await</span> Promise.<span className="text-accent">all</span>(promises);{'\n\n'}
                    {'  '}<span className="text-text-muted">{'// All claim numbers must be unique and match tenant format'}</span>{'\n'}
                    {'  '}<span className="text-accent-secondary">const</span> claimNumbers = claims.<span className="text-accent">map</span>((c) =&gt; c.claimNumber);{'\n'}
                    {'  '}<span className="text-accent">expect</span>(<span className="text-accent-secondary">new</span> Set(claimNumbers).size).<span className="text-accent">toBe</span>(<span className="text-functional-warning">15</span>);{'\n'}
                    {'  '}claimNumbers.<span className="text-accent">forEach</span>((cn) =&gt; {'{'}{'\n'}
                    {'    '}<span className="text-accent">expect</span>(cn).<span className="text-accent">toMatch</span>(<span className="text-functional-success">/^CLM-ALPHA-\d{'{'}4{'}'}$/</span>);{'\n'}
                    {'  '}{'}'});{'\n\n'}
                    {'  '}<span className="text-text-muted">{'// Extract and sort sequences — must be contiguous 1..15 without gaps'}</span>{'\n'}
                    {'  '}<span className="text-accent-secondary">const</span> sequences = claimNumbers.<span className="text-accent">map</span>(getSeq).<span className="text-accent">sort</span>((a, b) =&gt; a - b);{'\n'}
                    {'  '}<span className="text-accent">expect</span>(sequences).<span className="text-accent">toEqual</span>(Array.<span className="text-accent">from</span>({'{'} length: <span className="text-functional-warning">15</span> {'}'}, (_, i) =&gt; i + <span className="text-functional-warning">1</span>));{'\n'}
                    {'}'});
                  </pre>
                </div>
              </div>
            )}

            {/* Sub-Panel B: EVD-003 */}
            {dataSubTab === 'index' && (
              <div
                role="tabpanel"
                id="subpanel-index"
                aria-labelledby="subtab-index"
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>tests/claim.numbering.test.js (Lines 192–200)</span>
                  <span>EVD-003: MongoDB Index Catalog Assertion</span>
                </div>
                <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-text-secondary">
                  <pre className="text-text-secondary">
                    <span className="text-accent-secondary">it</span>(<span className="text-functional-success">&apos;should use the compound unique index to prevent duplicate claim numbers within a tenant&apos;</span>, <span className="text-accent-secondary">async</span> () =&gt; {'{'}{'\n'}
                    {'  '}<span className="text-text-muted">{'// Verify the unique index exists on { organizationId, claimNumber }'}</span>{'\n'}
                    {'  '}<span className="text-accent-secondary">const</span> indexes = <span className="text-accent-secondary">await</span> Claim.collection.<span className="text-accent">indexes</span>();{'\n'}
                    {'  '}<span className="text-accent-secondary">const</span> compoundIndex = indexes.<span className="text-accent">find</span>({'\n'}
                    {'    '}(idx) =&gt; idx.key.organizationId === <span className="text-functional-warning">1</span> &amp;&amp; idx.key.claimNumber === <span className="text-functional-warning">1</span>{'\n'}
                    {'  '});{'\n\n'}
                    {'  '}<span className="text-accent">expect</span>(compoundIndex).<span className="text-accent">toBeDefined</span>();{'\n'}
                    {'  '}<span className="text-accent">expect</span>(compoundIndex.unique).<span className="text-accent">toBe</span>(<span className="text-accent-secondary">true</span>);{'\n'}
                    {'}'});
                  </pre>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-bg-tertiary/60 border border-border-subtle text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary font-medium">Engineering Guarantee: </strong>
              Even if application concurrency control were to fail under an unexpected edge case, the database engine
              strictly rejects duplicate <code className="font-mono text-accent">claimNumber</code> values within the same
              tenant organization via the unique compound B-tree index.
            </div>
          </div>
        )}

        {/* ──────────────── PILLAR 3: STEALTH MULTI-TENANT SECURITY (EVD-004) ──────────────── */}
        {activePillar === 'stealth' && (
          <div
            role="tabpanel"
            id="panel-stealth"
            aria-labelledby="tab-stealth"
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-mono font-semibold text-text-primary flex items-center gap-2">
                  <span className="text-accent">Pillar 3:</span>
                  Cross-Tenant Anti-Enumeration Defense (Stealth Tenancy)
                </h4>
                <Badge variant="outline" size="sm">
                  HTTP 404 (Masked Authorization)
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Cross-tenant resource requests return HTTP 404 CLAIM_NOT_FOUND rather than 403 Forbidden,
                preventing malicious actors from confirming the existence of claims belonging to rival organizations.
              </p>
            </div>

            {/* Code Excerpt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                <span>tests/claim.statusMachine.test.js (Lines 658–664)</span>
                <span>EVD-004: Anti-Enumeration Supertest</span>
              </div>
              <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-text-secondary">
                <pre className="text-text-secondary">
                  <span className="text-accent-secondary">it</span>(<span className="text-functional-success">&apos;should return 404 when adjuster from other org calls /inspection/start&apos;</span>, <span className="text-accent-secondary">async</span> () =&gt; {'{'}{'\n'}
                  {'  '}<span className="text-accent-secondary">const</span> res = <span className="text-accent-secondary">await</span> <span className="text-accent">request</span>(app){'\n'}
                  {'    '}.<span className="text-accent">post</span>(<span className="text-functional-success">`/api/v1/claims/${'{'}assignedClaim._id{'}'}/inspection/start`</span>){'\n'}
                  {'    '}.<span className="text-accent">set</span>(<span className="text-functional-success">&apos;Authorization&apos;</span>, <span className="text-functional-success">`Bearer ${'{'}otherOrgAdjusterToken{'}'}`</span>);{'\n\n'}
                  {'  '}<span className="text-accent">expect</span>(res.status).<span className="text-accent">toBe</span>(<span className="text-functional-warning">404</span>);{'\n'}
                  {'  '}<span className="text-accent">expect</span>(res.body.errors[<span className="text-functional-warning">0</span>].code).<span className="text-accent">toBe</span>(<span className="text-functional-success">&apos;CLAIM_NOT_FOUND&apos;</span>);{'\n'}
                  {'}'});
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-bg-tertiary/60 border border-border-subtle text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary font-medium">Security Rationale: </strong>
              Returning <code className="font-mono text-functional-warning">403 Forbidden</code> leaks information by confirming
              that a resource ID actually exists in the database. Returning <code className="font-mono text-accent">404 CLAIM_NOT_FOUND</code> treats
              cross-tenant attempts identically to non-existent records, closing the enumeration side-channel.
            </div>
          </div>
        )}
      </div>

      {/* ── Supporting Evidence Layer (EVD-007 & EVD-006) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EVD-007: Test Harness Isolation */}
        <div className="rounded-xl bg-bg-secondary border border-border-default p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
              Test Harness Architecture (EVD-007)
            </span>
            <Badge variant="neutral" size="sm">In-Memory MongoDB Replica</Badge>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Integration tests run against a self-contained in-memory MongoDB replica via <code className="font-mono text-accent">mongodb-memory-server</code>.
            This ensures tests execute real Mongoose pre-save hooks and B-tree compound unique indexes with per-test collection flushes,
            eliminating fragile mocks while maintaining fast, isolated test execution.
          </p>
        </div>

        {/* EVD-006: Defensive API Protection */}
        <div className="rounded-xl bg-bg-secondary border border-border-default p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
              Defensive API Protection (EVD-006)
            </span>
            <Badge variant="warning" size="sm">HTTP 429</Badge>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Sensitive authentication and resource endpoints enforce request rate limits and return <code className="font-mono text-functional-warning">HTTP 429 Too Many Requests</code> with
            code <code className="font-mono text-accent">TOO_MANY_REQUESTS</code> when thresholds are exceeded (<code className="font-mono text-text-muted">tests/rateLimiting.test.js:45-75</code>),
            mitigating brute-force and resource exhaustion vectors.
          </p>
        </div>
      </div>
    </div>
  );
}
