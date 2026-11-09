'use client';

import { useState } from 'react';
import Badge from '@/components/shared/Badge';
import { cn } from '@/lib/utils';

/**
 * InsurflowEvidence — Technical backend evidence artifact.
 *
 * Exposes verified, production-grounded implementation evidence from the
 * InsurFlow core claims engine:
 * 1. Multi-tenant MongoDB schema modeling & compound indexing patterns (claim.model.js)
 * 2. Claim lifecycle Finite State Machine & atomic transition guards (claim.service.js)
 */
export default function InsurflowEvidence() {
  const [activeTab, setActiveTab] = useState('schema'); // 'schema' | 'fsm'

  return (
    <div className="rounded-xl bg-bg-secondary border border-border-default overflow-hidden p-5 sm:p-7 space-y-6">
      {/* Intro Header */}
      <div className="space-y-2 border-b border-border-subtle pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm">
              Source-Verified
            </Badge>
            <span className="font-mono text-xs text-text-muted">
              claims/claim.model.js & claim.service.js
            </span>
          </div>
          <span className="font-mono text-xs text-functional-success flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse" />
            Backend Evidence
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-[70ch]">
          Direct implementation evidence showing tenant-isolated data modeling,
          access-pattern-driven compound indexes, and deterministic FSM lifecycle validation.
        </p>
      </div>

      {/* Tab Switcher */}
      <div
        role="tablist"
        aria-label="InsurFlow Technical Evidence Views"
        className="flex p-1 bg-bg-primary/80 rounded-lg border border-border-subtle max-w-md"
      >
        <button
          type="button"
          role="tab"
          id="tab-schema"
          aria-selected={activeTab === 'schema'}
          aria-controls="panel-schema"
          onClick={() => setActiveTab('schema')}
          className={cn(
            'flex-1 py-2 px-3 text-xs sm:text-sm font-mono font-medium rounded-md transition-all duration-200 text-center',
            activeTab === 'schema'
              ? 'bg-bg-tertiary text-text-primary shadow-sm border border-border-default'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          01. Schema & Indexing
        </button>
        <button
          type="button"
          role="tab"
          id="tab-fsm"
          aria-selected={activeTab === 'fsm'}
          aria-controls="panel-fsm"
          onClick={() => setActiveTab('fsm')}
          className={cn(
            'flex-1 py-2 px-3 text-xs sm:text-sm font-mono font-medium rounded-md transition-all duration-200 text-center',
            activeTab === 'fsm'
              ? 'bg-bg-tertiary text-text-primary shadow-sm border border-border-default'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          02. Lifecycle FSM
        </button>
      </div>

      {/* ──────────────── TAB 1: SCHEMA & INDEXING ──────────────── */}
      {activeTab === 'schema' && (
        <div
          role="tabpanel"
          id="panel-schema"
          aria-labelledby="tab-schema"
          className="space-y-6"
        >
          {/* Code Excerpt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>claim.model.js (Mongoose Schema Excerpt)</span>
              <span>Multi-Tenant Architecture</span>
            </div>
            <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-text-secondary">
              <pre className="text-text-secondary">
                <span className="text-text-muted">{'// 1. Tenancy, Lifecycle & Embedded Timeline'}</span>{'\n'}
                <span className="text-accent-secondary">const</span> claimSchema = <span className="text-accent-secondary">new</span> mongoose.<span className="text-accent">Schema</span>({'{'}{'\n'}
                {'  '}claimNumber: {'{'} <span className="text-accent">type</span>: String {'}'},{'\n'}
                {'  '}organizationId: {'{'} <span className="text-accent">type</span>: ObjectId, <span className="text-accent">ref</span>: <span className="text-functional-success">&apos;Organization&apos;</span>, <span className="text-accent">required</span>: <span className="text-accent-secondary">true</span>, <span className="text-accent">index</span>: <span className="text-accent-secondary">true</span> {'}'},{'\n'}
                {'  '}policyId: {'{'} <span className="text-accent">type</span>: ObjectId, <span className="text-accent">ref</span>: <span className="text-functional-success">&apos;Policy&apos;</span>, <span className="text-accent">required</span>: <span className="text-accent-secondary">true</span> {'}'},{'\n'}
                {'  '}status: {'{'}{'\n'}
                {'    '}<span className="text-accent">type</span>: String,{'\n'}
                {'    '}<span className="text-accent">enum</span>: [<span className="text-functional-success">&apos;NEW&apos;</span>, <span className="text-functional-success">&apos;PENDING_ACCEPTANCE&apos;</span>, <span className="text-functional-success">&apos;ASSIGNED&apos;</span>, <span className="text-functional-success">&apos;IN_PROGRESS&apos;</span>,{'\n'}
                {'            '}<span className="text-functional-success">&apos;SUBMITTED&apos;</span>, <span className="text-functional-success">&apos;UNDER_REVIEW&apos;</span>, <span className="text-functional-success">&apos;CORRECTION_REQUIRED&apos;</span>,{'\n'}
                {'            '}<span className="text-functional-success">&apos;APPROVED&apos;</span>, <span className="text-functional-success">&apos;REJECTED&apos;</span>, <span className="text-functional-success">&apos;CLOSED&apos;</span>],{'\n'}
                {'    '}<span className="text-accent">default</span>: <span className="text-functional-success">&apos;NEW&apos;</span>,{'\n'}
                {'    '}<span className="text-accent">required</span>: <span className="text-accent-secondary">true</span>,{'\n'}
                {'  '}{'}'},{'\n'}
                {'  '}assignedTo: {'{'} <span className="text-accent">type</span>: ObjectId, <span className="text-accent">ref</span>: <span className="text-functional-success">&apos;User&apos;</span>, <span className="text-accent">default</span>: <span className="text-accent-secondary">null</span> {'}'},{'\n'}
                {'  '}timeline: {'{'} <span className="text-accent">type</span>: [timelineEventSchema], <span className="text-accent">default</span>: [] {'}'},{'\n'}
                {'}'}, {'{'} timestamps: <span className="text-accent-secondary">true</span> {'}'});{'\n\n'}
                <span className="text-text-muted">{'// 2. Verified Compound Indexes'}</span>{'\n'}
                claimSchema.<span className="text-accent">index</span>({'{'} organizationId: <span className="text-functional-warning">1</span>, claimNumber: <span className="text-functional-warning">1</span> {'}'}, {'{'} unique: <span className="text-accent-secondary">true</span> {'}'});{'\n'}
                claimSchema.<span className="text-accent">index</span>({'{'} organizationId: <span className="text-functional-warning">1</span>, createdAt: <span className="text-functional-warning">-1</span>, status: <span className="text-functional-warning">1</span> {'}'});{'\n'}
                claimSchema.<span className="text-accent">index</span>({'{'} organizationId: <span className="text-functional-warning">1</span>, assignedTo: <span className="text-functional-warning">1</span>, createdAt: <span className="text-functional-warning">-1</span> {'}'});{'\n'}
                claimSchema.<span className="text-accent">index</span>({'{'} organizationId: <span className="text-functional-warning">1</span>, policyId: <span className="text-functional-warning">1</span> {'}'});{'\n\n'}
                <span className="text-text-muted">{'// 3. Tenant-Scoped Numbering: CLM-<ORG_CODE>-0001 (Atomic Counter)'}</span>{'\n'}
                claimSchema.<span className="text-accent">pre</span>(<span className="text-functional-success">&apos;save&apos;</span>, <span className="text-accent-secondary">async function</span> () {'{'}{'\n'}
                {'  '}<span className="text-accent-secondary">if</span> (!<span className="text-accent-secondary">this</span>.isNew || <span className="text-accent-secondary">this</span>.claimNumber) <span className="text-accent-secondary">return</span>;{'\n'}
                {'  '}<span className="text-accent-secondary">const</span> org = <span className="text-accent-secondary">await</span> Organization.<span className="text-accent">findById</span>(<span className="text-accent-secondary">this</span>.organizationId).<span className="text-accent">select</span>(<span className="text-functional-success">&apos;code&apos;</span>).<span className="text-accent">lean</span>();{'\n'}
                {'  '}<span className="text-accent-secondary">const</span> counter = <span className="text-accent-secondary">await</span> Counter.<span className="text-accent">findOneAndUpdate</span>({'\n'}
                {'    '}{'{'} _id: <span className="text-functional-success">`claimNumber_${'{'}this.organizationId{'}'}`</span> {'}'},{'\n'}
                {'    '}{'{'} $inc: {'{'} seq: <span className="text-functional-warning">1</span> {'}'} {'}'},{'\n'}
                {'    '}{'{'} returnDocument: <span className="text-functional-success">&apos;after&apos;</span>, upsert: <span className="text-accent-secondary">true</span> {'}'}{'\n'}
                {'  '});{'\n'}
                {'  '}<span className="text-accent-secondary">this</span>.claimNumber = <span className="text-functional-success">`CLM-${'{'}org.code{'}'}-${'{'}String(counter.seq).padStart(4, &apos;0&apos;){'}'}`</span>;{'\n'}
                {'}'});
              </pre>
            </div>
          </div>

          {/* Access Patterns Grid */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold block">
              Compound Indexing Rationale & Query Access Patterns
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono text-accent font-semibold">
                    {'{ organizationId: 1, claimNumber: 1 }'}
                  </code>
                  <Badge variant="outline" size="sm">Unique</Badge>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Guarantees tenant-isolated claim uniqueness at the database layer. Prevents ID collisions while allowing multiple organizations to maintain independent sequential counters.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono text-accent font-semibold">
                    {'{ organizationId: 1, createdAt: -1, status: 1 }'}
                  </code>
                  <Badge variant="outline" size="sm">Triage Queue</Badge>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Satisfies claims officer dashboard queries (filtering by tenant and status, sorted newest first) directly from index B-trees, eliminating in-memory MongoDB sorts.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono text-accent font-semibold">
                    {'{ organizationId: 1, assignedTo: 1, createdAt: -1 }'}
                  </code>
                  <Badge variant="outline" size="sm">Adjuster Feed</Badge>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Powers the field adjuster portal feed, enabling rapid index-bounded lookup of active tasks assigned to specific field personnel ordered chronologically.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono text-accent font-semibold">
                    {'{ organizationId: 1, policyId: 1 }'}
                  </code>
                  <Badge variant="outline" size="sm">Policy Scoping</Badge>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Scopes policy verification queries to the tenant, accelerating historical claims checks against an insured policy and preventing cross-tenant policy exposure.
                </p>
              </div>
            </div>
          </div>

          {/* Architectural Callout */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-primary/60 border border-border-subtle text-xs text-text-muted">
            <span className="text-accent font-mono text-sm leading-none mt-0.5">ℹ</span>
            <div className="space-y-1 leading-relaxed">
              <span className="text-text-primary font-medium block">
                Why OrganizationId Leads Every Compound Index
              </span>
              <span>
                InsurFlow enforces multi-tenant boundary checks at the database query layer. By placing <code className="text-accent font-mono">organizationId</code> as the leftmost prefix on all compound indexes, MongoDB query execution plans use index-bounded lookups tailored to primary tenant query patterns, supporting query-level tenant isolation efficiently. The embedded <code className="text-accent font-mono">timeline</code> subdocument (<code className="text-accent font-mono">_id: false</code>) records sequential audit history without relational join overhead.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: LIFECYCLE FSM ──────────────── */}
      {activeTab === 'fsm' && (
        <div
          role="tabpanel"
          id="panel-fsm"
          aria-labelledby="tab-fsm"
          className="space-y-6"
        >
          {/* Lifecycle State Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
                Claim Lifecycle State Machine (10 Verified States)
              </span>
              <span className="font-mono text-[11px] text-text-muted">
                Atomic Precondition Gates
              </span>
            </div>

            {/* Visual State Progression Flow */}
            <div className="p-4 rounded-lg bg-bg-primary/95 border border-border-subtle space-y-4">
              {/* Primary Happy Path */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block mb-2">
                  Primary Settlement Pipeline:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="px-2 py-1 rounded bg-bg-secondary border border-border-strong text-text-primary">
                    NEW
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-bg-secondary border border-functional-warning/30 text-functional-warning">
                    PENDING_ACCEPTANCE
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-bg-secondary border border-border-strong text-text-primary">
                    ASSIGNED
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-bg-secondary border border-accent/40 text-accent">
                    IN_PROGRESS
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-bg-secondary border border-border-strong text-text-primary">
                    SUBMITTED
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-bg-secondary border border-accent-secondary/40 text-text-primary">
                    UNDER_REVIEW
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-functional-success/10 border border-functional-success/40 text-functional-success font-semibold">
                    APPROVED
                  </span>
                  <span className="text-text-muted">→</span>
                  <span className="px-2 py-1 rounded bg-bg-tertiary border border-border-strong text-text-muted">
                    CLOSED
                  </span>
                </div>
              </div>

              {/* Exception & Loop Branches */}
              <div className="pt-3 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded bg-bg-secondary/60 border border-border-subtle space-y-1">
                  <span className="text-functional-warning block text-[11px]">Decline Re-Route</span>
                  <p className="text-[11px] text-text-muted font-sans leading-tight">
                    <code className="text-text-secondary font-mono">PENDING_ACCEPTANCE</code> → <code className="text-text-secondary font-mono">NEW</code> when adjuster declines; returns to unassigned queue.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-bg-secondary/60 border border-border-subtle space-y-1">
                  <span className="text-accent block text-[11px]">Correction Loop</span>
                  <p className="text-[11px] text-text-muted font-sans leading-tight">
                    <code className="text-text-secondary font-mono">UNDER_REVIEW</code> ⇄ <code className="text-text-secondary font-mono">CORRECTION_REQUIRED</code> → <code className="text-text-secondary font-mono">IN_PROGRESS</code> for missing evidence.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-bg-secondary/60 border border-border-subtle space-y-1">
                  <span className="text-functional-error block text-[11px]">Terminal Rejection</span>
                  <p className="text-[11px] text-text-muted font-sans leading-tight">
                    <code className="text-text-secondary font-mono">UNDER_REVIEW</code> → <code className="text-functional-error font-mono">REJECTED</code> with decision notes; terminal state.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Implementation Excerpt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>claim.service.js (Atomic State Transition Guard)</span>
              <span>Defense-in-Depth</span>
            </div>
            <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-text-secondary">
              <pre className="text-text-secondary">
                <span className="text-text-muted">{'// Precondition gate: only ASSIGNED or CORRECTION_REQUIRED can enter IN_PROGRESS'}</span>{'\n'}
                <span className="text-accent-secondary">const</span> startInspection = <span className="text-accent-secondary">async</span> (claimId, authUser) =&gt; {'{'}{'\n'}
                {'  '}<span className="text-accent-secondary">const</span> {'{'} userId, role, organizationId {'}'} = authUser;{'\n\n'}
                {'  '}<span className="text-accent-secondary">const</span> claim = <span className="text-accent-secondary">await</span> claimRepository.<span className="text-accent">findByIdAndOrganization</span>(claimId, organizationId);{'\n'}
                {'  '}<span className="text-accent-secondary">if</span> (!claim) <span className="text-accent-secondary">throw new</span> <span className="text-accent">AppError</span>(<span className="text-functional-success">&apos;Claim not found&apos;</span>, <span className="text-functional-warning">404</span>, <span className="text-functional-success">&apos;CLAIM_NOT_FOUND&apos;</span>);{'\n\n'}
                {'  '}<span className="text-text-muted">{'// State Precondition Verification'}</span>{'\n'}
                {'  '}<span className="text-accent-secondary">if</span> (![<span className="text-functional-success">&apos;ASSIGNED&apos;</span>, <span className="text-functional-success">&apos;CORRECTION_REQUIRED&apos;</span>].<span className="text-accent">includes</span>(claim.status)) {'{'}{'\n'}
                {'    '}<span className="text-accent-secondary">throw new</span> <span className="text-accent">AppError</span>({'\n'}
                {'      '}<span className="text-functional-success">&apos;Claim is not in ASSIGNED or CORRECTION_REQUIRED status&apos;</span>,{'\n'}
                {'      '}<span className="text-functional-warning">409</span>,{'\n'}
                {'      '}<span className="text-functional-success">&apos;INVALID_STATUS_TRANSITION&apos;</span>{'\n'}
                {'    '});{'\n'}
                {'  '}{'}'}{'\n\n'}
                {'  '}<span className="text-text-muted">{'// Atomic audit timeline recording'}</span>{'\n'}
                {'  '}<span className="text-accent-secondary">const</span> timelineEvent = {'{'}{'\n'}
                {'    '}action: claim.status === <span className="text-functional-success">&apos;CORRECTION_REQUIRED&apos;</span> ? <span className="text-functional-success">&apos;Inspection Resumed&apos;</span> : <span className="text-functional-success">&apos;Inspection Started&apos;</span>,{'\n'}
                {'    '}previousStatus: claim.status,{'\n'}
                {'    '}newStatus: <span className="text-functional-success">&apos;IN_PROGRESS&apos;</span>,{'\n'}
                {'    '}performedBy: userId,{'\n'}
                {'    '}role,{'\n'}
                {'    '}timestamp: <span className="text-accent-secondary">new</span> <span className="text-accent">Date</span>(),{'\n'}
                {'  '}{'}'};{'\n\n'}
                {'  '}<span className="text-accent-secondary">const</span> updatedClaim = <span className="text-accent-secondary">await</span> claimRepository.<span className="text-accent">startInspection</span>(claimId, organizationId, userId, timelineEvent);{'\n'}
                {'  '}<span className="text-accent-secondary">return</span> {'{'} status: updatedClaim.status {'}'};{'\n'}
                {'}'};
              </pre>
            </div>
          </div>

          {/* Actual 409 Error Response Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>Verified API Error Contract (HTTP 409 Conflict)</span>
              <span>Deterministic Failure Handling</span>
            </div>
            <div className="overflow-x-auto rounded-lg bg-bg-primary/95 border border-border-subtle p-4 font-mono text-xs sm:text-[13px] leading-relaxed">
              <pre className="text-functional-error">
                {'{'}{'\n'}
                {'  '}<span className="text-text-secondary">&quot;success&quot;</span>: <span className="text-accent-secondary">false</span>,{'\n'}
                {'  '}<span className="text-text-secondary">&quot;message&quot;</span>: <span className="text-functional-warning">&quot;Claim is not in NEW state&quot;</span>,{'\n'}
                {'  '}<span className="text-text-secondary">&quot;errors&quot;</span>: [{'\n'}
                {'    '}{'{'}{'\n'}
                {'      '}<span className="text-text-secondary">&quot;code&quot;</span>: <span className="text-functional-warning">&quot;INVALID_STATUS_TRANSITION&quot;</span>,{'\n'}
                {'      '}<span className="text-text-secondary">&quot;details&quot;</span>: <span className="text-functional-warning">&quot;Claim is not in NEW state&quot;</span>{'\n'}
                {'    '}{'}'}{'\n'}
                {'  '}]{'\n'}
                {'}'}
              </pre>
            </div>
          </div>

          {/* Architectural Callout */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-primary/60 border border-border-subtle text-xs text-text-muted">
            <span className="text-functional-warning font-mono text-sm leading-none mt-0.5">⚠</span>
            <div className="space-y-1 leading-relaxed">
              <span className="text-text-primary font-medium block">
                FSM Integrity & Mistake-Proofing (Poka-Yoke)
              </span>
              <span>
                By rejecting out-of-order mutations at the service boundary with HTTP 409 and <code className="text-accent font-mono">INVALID_STATUS_TRANSITION</code>, callers cannot bypass critical lifecycle phases (e.g., closing unapproved claims or submitting inspections prematurely). Every valid transition appends an audit event to the claim timeline, maintaining a verifiable chronological record of lifecycle mutations.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
