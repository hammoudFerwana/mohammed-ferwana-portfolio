'use client';

import { useState, useCallback, useId } from 'react';
import { useReducedMotion } from 'motion/react';
import { states, transitions, terminalStates } from '@/data/claimFsm';
import {
  canTransition,
  build409ResponseBody,
  build200ResponseBody,
} from '@/lib/fsm.mjs';
import Badge from '@/components/shared/Badge';
import { cn } from '@/lib/utils';

// Fixed geometric coordinates for responsive SVG layout (viewBox 0 0 940 310)
const NODE_COORDINATES = {
  NEW: { x: 50, y: 75, w: 66, h: 34 },
  PENDING_ACCEPTANCE: { x: 175, y: 75, w: 146, h: 34 },
  ASSIGNED: { x: 310, y: 75, w: 88, h: 34 },
  IN_PROGRESS: { x: 430, y: 75, w: 104, h: 34 },
  SUBMITTED: { x: 550, y: 75, w: 96, h: 34 },
  UNDER_REVIEW: { x: 675, y: 75, w: 114, h: 34 },
  APPROVED: { x: 800, y: 75, w: 88, h: 34 },
  CLOSED: { x: 900, y: 75, w: 70, h: 34 },
  CORRECTION_REQUIRED: { x: 550, y: 235, w: 168, h: 34 },
  REJECTED: { x: 800, y: 235, w: 88, h: 34 },
};

export default function FsmSimulator() {
  const [currentState, setCurrentState] = useState(states[0]); // Initial state: 'NEW'
  const [history, setHistory] = useState([]);
  const [activeResponse, setActiveResponse] = useState(null);
  const [errorFeedbackState, setErrorFeedbackState] = useState(null);
  const [ariaLiveMessage, setAriaLiveMessage] = useState(
    'FSM Simulator ready. Initial state is NEW.'
  );

  const shouldReduceMotion = useReducedMotion();
  const liveRegionId = useId();

  const allowedTargets = transitions[currentState] || [];

  const handleSelectState = useCallback(
    (targetState) => {
      const result = canTransition(currentState, targetState);
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (result.ok) {
        setCurrentState(targetState);
        setErrorFeedbackState(null);
        setActiveResponse({
          type: 'success',
          status: 200,
          target: targetState,
          payload: build200ResponseBody(targetState),
        });
        setAriaLiveMessage(
          `Transition from ${currentState} to ${targetState} permitted. Status 200 OK. Current state is now ${targetState}.`
        );
        setHistory((prev) => [
          {
            id: Date.now() + Math.random(),
            from: currentState,
            to: targetState,
            status: 200,
            ok: true,
            code: 'ALLOWED',
            timestamp,
          },
          ...prev.slice(0, 4),
        ]);
      } else {
        const payload = build409ResponseBody(targetState);
        setErrorFeedbackState(targetState);
        setActiveResponse({
          type: 'error',
          status: 409,
          target: targetState,
          payload,
        });
        setAriaLiveMessage(
          `Transition from ${currentState} to ${targetState} rejected. Status 409 Conflict. ${payload.message}`
        );
        setHistory((prev) => [
          {
            id: Date.now() + Math.random(),
            from: currentState,
            to: targetState,
            status: 409,
            ok: false,
            code: result.code,
            message: payload.message,
            timestamp,
          },
          ...prev.slice(0, 4),
        ]);
      }
    },
    [currentState]
  );

  const handleReset = useCallback(() => {
    const initialState = states[0];
    setCurrentState(initialState);
    setErrorFeedbackState(null);
    setActiveResponse(null);
    setAriaLiveMessage(`Simulator reset to initial state ${initialState}.`);
  }, []);

  return (
    <div className="rounded-xl bg-bg-secondary border border-border-default overflow-hidden p-5 sm:p-7 space-y-6">
      {/* Screen-reader live notification region */}
      <div
        id={liveRegionId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {ariaLiveMessage}
      </div>

      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="font-mono text-sm sm:text-base font-semibold text-text-primary">
              Claim lifecycle simulator
            </h3>
            <Badge variant="accent" size="sm">
              Simulation
            </Badge>
          </div>
          <p className="text-xs text-text-muted">
            Simulation in your browser. It replays the transition rules of the Sawn API and does not call the live API.
          </p>
          <p className="text-xs text-text-secondary">
            Select a target state node to evaluate transition guards. Allowed transitions return{' '}
            <code className="text-functional-success font-mono font-semibold">200 OK</code>.
            Forbidden mutations are rejected with{' '}
            <code className="text-functional-error font-mono font-semibold">409 Conflict</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-text-secondary bg-bg-primary px-3 py-1.5 rounded-lg border border-border-subtle">
            <span className="text-text-muted">Current:</span>
            <span className="text-accent font-semibold">{currentState}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border-strong text-xs font-mono text-text-primary hover:bg-bg-elevated hover:border-accent transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
          >
            Reset to NEW
          </button>
        </div>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="relative rounded-lg bg-bg-primary/95 border border-border-subtle p-3 overflow-x-auto">
        <div className="min-w-[760px]">
          <svg
            viewBox="0 0 940 310"
            className="w-full h-auto select-none"
            role="region"
            aria-label="Interactive Claim Lifecycle State Machine Graph"
          >
            <defs>
              <marker
                id="arrowhead-subtle"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--hz-ink-muted)" />
              </marker>
              <marker
                id="arrowhead-allowed"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--hz-success)" />
              </marker>
              <marker
                id="arrowhead-warning"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--hz-warning)" />
              </marker>
              <marker
                id="arrowhead-danger"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--hz-error)" />
              </marker>
            </defs>

            {/* Static Transition Paths / Edges */}
            <g className="transition-paths" strokeWidth="1.5" fill="none">
              {/* Primary Pipeline Happy Path (Horizontal) */}
              <path
                d="M 83 75 L 102 75"
                stroke={allowedTargets.includes('PENDING_ACCEPTANCE') && currentState === 'NEW' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('PENDING_ACCEPTANCE') && currentState === 'NEW' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 248 75 L 266 75"
                stroke={allowedTargets.includes('ASSIGNED') && currentState === 'PENDING_ACCEPTANCE' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('ASSIGNED') && currentState === 'PENDING_ACCEPTANCE' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 354 75 L 378 75"
                stroke={allowedTargets.includes('IN_PROGRESS') && currentState === 'ASSIGNED' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('IN_PROGRESS') && currentState === 'ASSIGNED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 482 75 L 502 75"
                stroke={allowedTargets.includes('SUBMITTED') && currentState === 'IN_PROGRESS' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('SUBMITTED') && currentState === 'IN_PROGRESS' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 598 75 L 618 75"
                stroke={allowedTargets.includes('UNDER_REVIEW') && currentState === 'SUBMITTED' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('UNDER_REVIEW') && currentState === 'SUBMITTED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 732 75 L 756 75"
                stroke={allowedTargets.includes('APPROVED') && currentState === 'UNDER_REVIEW' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('APPROVED') && currentState === 'UNDER_REVIEW' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 844 75 L 865 75"
                stroke={allowedTargets.includes('CLOSED') && currentState === 'APPROVED' ? 'var(--hz-success)' : 'var(--hz-line)'}
                markerEnd={allowedTargets.includes('CLOSED') && currentState === 'APPROVED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />

              {/* Decline Re-Route: PENDING_ACCEPTANCE -> NEW (Upper curved loop) */}
              <path
                d="M 175 58 C 150 25, 75 25, 50 58"
                stroke={allowedTargets.includes('NEW') && currentState === 'PENDING_ACCEPTANCE' ? 'var(--hz-warning)' : 'var(--hz-line)'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('NEW') && currentState === 'PENDING_ACCEPTANCE' ? 'url(#arrowhead-warning)' : 'url(#arrowhead-subtle)'}
              />

              {/* Correction Loop: UNDER_REVIEW -> CORRECTION_REQUIRED (Lower curve) */}
              <path
                d="M 660 92 C 640 145, 590 185, 565 218"
                stroke={allowedTargets.includes('CORRECTION_REQUIRED') && currentState === 'UNDER_REVIEW' ? 'var(--hz-success)' : 'var(--hz-line)'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('CORRECTION_REQUIRED') && currentState === 'UNDER_REVIEW' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />

              {/* Correction Loop: CORRECTION_REQUIRED -> IN_PROGRESS (Return curve) */}
              <path
                d="M 535 218 C 490 180, 460 140, 440 92"
                stroke={allowedTargets.includes('IN_PROGRESS') && currentState === 'CORRECTION_REQUIRED' ? 'var(--hz-success)' : 'var(--hz-line)'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('IN_PROGRESS') && currentState === 'CORRECTION_REQUIRED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />

              {/* Terminal Rejection: UNDER_REVIEW -> REJECTED (Lower curve) */}
              <path
                d="M 690 92 C 715 145, 765 185, 785 218"
                stroke={allowedTargets.includes('REJECTED') && currentState === 'UNDER_REVIEW' ? 'var(--hz-error)' : 'var(--hz-line)'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('REJECTED') && currentState === 'UNDER_REVIEW' ? 'url(#arrowhead-danger)' : 'url(#arrowhead-subtle)'}
              />
            </g>

            {/* Path Explanatory Annotations */}
            <text x="110" y="24" fill="var(--hz-ink-muted)" fontSize="10" fontFamily="monospace">
              decline re-route
            </text>
            <text x="615" y="170" fill="var(--hz-ink-muted)" fontSize="10" fontFamily="monospace">
              evidence deficit
            </text>
            <text x="440" y="170" fill="var(--hz-ink-muted)" fontSize="10" fontFamily="monospace">
              resumed
            </text>
            <text x="755" y="170" fill="var(--hz-error)" fontSize="10" fontFamily="monospace">
              rejection
            </text>

            {/* State Nodes */}
            {states.map((state) => {
              const node = NODE_COORDINATES[state];
              if (!node) return null;

              const isCurrent = currentState === state;
              const isAllowed = allowedTargets.includes(state);
              const isTerminal = terminalStates.includes(state);
              const isError = errorFeedbackState === state;

              let rectStroke = 'var(--hz-line)';
              let rectFill = 'var(--hz-surface)';
              let textFill = 'var(--hz-ink-muted)';
              let strokeWidth = 1.2;
              let strokeDash = undefined;

              if (isCurrent) {
                rectStroke = 'var(--hz-violet)';
                rectFill = 'var(--hz-raised)';
                textFill = 'var(--hz-ink)';
                strokeWidth = 2.4;
              } else if (isError) {
                rectStroke = 'var(--hz-error)';
                rectFill = 'color-mix(in oklab, var(--hz-error) 15%, transparent)';
                textFill = 'var(--hz-error)';
                strokeWidth = 2;
              } else if (isAllowed) {
                rectStroke = 'var(--hz-success)';
                rectFill = 'color-mix(in oklab, var(--hz-success) 10%, transparent)';
                textFill = 'var(--hz-success)';
                strokeWidth = 1.8;
                strokeDash = '3 3';
              } else if (isTerminal) {
                rectStroke = state === 'REJECTED' ? 'color-mix(in oklab, var(--hz-error) 40%, transparent)' : 'var(--hz-line)';
                rectFill = 'var(--hz-raised)';
                textFill = state === 'REJECTED' ? 'var(--hz-error)' : 'var(--hz-ink-muted)';
              }

              return (
                <g
                  key={state}
                  role="button"
                  tabIndex={0}
                  aria-label={`State ${state}. ${isCurrent
                    ? 'Current State.'
                    : isAllowed
                      ? 'Allowed Target (returns 200).'
                      : 'Forbidden Target (returns 409).'
                  }${isTerminal ? ' Terminal state.' : ''}`}
                  onClick={() => handleSelectState(state)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectState(state);
                    }
                  }}
                  className={cn(
                    'group cursor-pointer focus:outline-hidden transition-transform duration-150',
                    !shouldReduceMotion && 'hover:scale-[1.03]'
                  )}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  {/* Keyboard Focus Ring */}
                  <rect
                    x={node.x - node.w / 2 - 4}
                    y={node.y - node.h / 2 - 4}
                    width={node.w + 8}
                    height={node.h + 8}
                    rx="10"
                    fill="none"
                    stroke="var(--hz-violet)"
                    strokeWidth="2"
                    className="pointer-events-none opacity-0 group-focus-visible:opacity-100"
                  />
                  {/* Outer Focus/Hover Glow */}
                  {isCurrent && (
                    <rect
                      x={node.x - node.w / 2 - 3}
                      y={node.y - node.h / 2 - 3}
                      width={node.w + 6}
                      height={node.h + 6}
                      rx="9"
                      fill="none"
                      stroke="var(--hz-violet)"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                    />
                  )}

                  {/* Main Node Box */}
                  <rect
                    x={node.x - node.w / 2}
                    y={node.y - node.h / 2}
                    width={node.w}
                    height={node.h}
                    rx="6"
                    fill={rectFill}
                    stroke={rectStroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                  />

                  {/* Node Label Text */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={textFill}
                    fontSize={state === 'CORRECTION_REQUIRED' || state === 'PENDING_ACCEPTANCE' ? '10' : '11'}
                    fontFamily="monospace"
                    fontWeight={isCurrent ? 'bold' : '500'}
                  >
                    {state}
                  </text>

                  {/* Active Indicator Dot */}
                  {isCurrent && (
                    <circle
                      cx={node.x - node.w / 2 + 8}
                      cy={node.y - node.h / 2 + 8}
                      r="2.5"
                      fill="var(--hz-violet)"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Two-Column Detail View: Response Envelope Panel & Transition Attempt Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Response Payload Panel */}
        <div className="rounded-lg bg-bg-primary/95 border border-border-subtle p-4 space-y-3">
          {activeResponse ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-primary font-semibold">
                    HTTP {activeResponse.status}{' '}
                    {activeResponse.status === 200 ? 'OK' : 'Conflict'}
                  </span>
                  <span
                    className={
                      activeResponse.status === 200
                        ? 'px-1.5 py-0.5 rounded text-[10px] font-semibold bg-functional-success/10 text-functional-success border border-functional-success/30'
                        : 'px-1.5 py-0.5 rounded text-[10px] font-semibold bg-functional-error/10 text-functional-error border border-functional-error/30'
                    }
                  >
                    {activeResponse.status === 200 ? 'Permitted' : 'Rejected'}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-text-muted">
                  {activeResponse.status === 200
                    ? 'Service return value'
                    : 'INVALID_STATUS_TRANSITION'}
                </span>
              </div>

              {/* Response Payload Pre Box */}
              <div tabIndex={0} className="overflow-x-auto rounded bg-bg-secondary p-3 font-mono text-xs leading-relaxed">
                <pre
                  className={
                    activeResponse.status === 200
                      ? 'text-functional-success'
                      : 'text-functional-error'
                  }
                >
                  {JSON.stringify(activeResponse.payload, null, 2)}
                </pre>
              </div>

              {/* Response Captions */}
              <div className="space-y-1 font-mono text-[11px] text-text-muted">
                <p>Simulated response, no network call</p>
                {activeResponse.status === 409 && (
                  <p className="text-text-secondary">
                    message derived from the transition table
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-border-subtle pb-2.5">
                <span className="font-mono text-xs font-semibold text-text-primary">
                  No request sent yet
                </span>
              </div>
              <div className="py-8 text-center text-xs text-text-muted font-mono">
                Select a target state. The simulated response appears here.
              </div>
            </>
          )}
        </div>

        {/* Right Column: Execution History Log (Last 5 Attempts) */}
        <div className="rounded-lg bg-bg-primary/95 border border-border-subtle p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
            <span className="font-mono text-xs font-semibold text-text-primary">
              Recent Transition Attempts
            </span>
            <span className="font-mono text-[11px] text-text-muted">
              Buffer (Max 5)
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted font-mono">
              No transition attempts yet. Click or press Enter on any state node to simulate a lifecycle event.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-2 p-2 rounded bg-bg-secondary/70 border border-border-subtle font-mono text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                        entry.ok
                          ? 'bg-functional-success/10 text-functional-success border border-functional-success/30'
                          : 'bg-functional-error/10 text-functional-error border border-functional-error/30'
                      )}
                    >
                      {entry.status}
                    </span>
                    <span className="text-text-primary font-medium truncate">
                      {entry.from} <span className="text-text-muted">→</span> {entry.to}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'text-[10px]',
                        entry.ok ? 'text-functional-success' : 'text-functional-warning'
                      )}
                    >
                      {entry.code}
                    </span>
                    <span className="text-[10px] text-text-muted">{entry.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
