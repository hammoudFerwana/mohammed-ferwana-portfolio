'use client';

import { useState, useCallback, useId } from 'react';
import { useReducedMotion } from 'framer-motion';
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
  const [activeResponse, setActiveResponse] = useState(() => ({
    type: 'success',
    status: 200,
    target: states[0],
    payload: build200ResponseBody(states[0]),
  }));
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
    setActiveResponse({
      type: 'success',
      status: 200,
      target: initialState,
      payload: build200ResponseBody(initialState),
    });
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
              Interactive Claim Lifecycle Simulator (FSM)
            </h3>
            <Badge variant="accent" size="sm">
              Single Source of Truth
            </Badge>
          </div>
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
            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border-strong text-xs font-mono text-text-primary hover:bg-bg-elevated hover:border-accent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#52525b" />
              </marker>
              <marker
                id="arrowhead-allowed"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#22c55e" />
              </marker>
              <marker
                id="arrowhead-warning"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#f59e0b" />
              </marker>
              <marker
                id="arrowhead-danger"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#ef4444" />
              </marker>
            </defs>

            {/* Static Transition Paths / Edges */}
            <g className="transition-paths" strokeWidth="1.5" fill="none">
              {/* Primary Pipeline Happy Path (Horizontal) */}
              <path
                d="M 83 75 L 102 75"
                stroke={allowedTargets.includes('PENDING_ACCEPTANCE') && currentState === 'NEW' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('PENDING_ACCEPTANCE') && currentState === 'NEW' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 248 75 L 266 75"
                stroke={allowedTargets.includes('ASSIGNED') && currentState === 'PENDING_ACCEPTANCE' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('ASSIGNED') && currentState === 'PENDING_ACCEPTANCE' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 354 75 L 378 75"
                stroke={allowedTargets.includes('IN_PROGRESS') && currentState === 'ASSIGNED' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('IN_PROGRESS') && currentState === 'ASSIGNED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 482 75 L 502 75"
                stroke={allowedTargets.includes('SUBMITTED') && currentState === 'IN_PROGRESS' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('SUBMITTED') && currentState === 'IN_PROGRESS' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 598 75 L 618 75"
                stroke={allowedTargets.includes('UNDER_REVIEW') && currentState === 'SUBMITTED' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('UNDER_REVIEW') && currentState === 'SUBMITTED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 732 75 L 756 75"
                stroke={allowedTargets.includes('APPROVED') && currentState === 'UNDER_REVIEW' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('APPROVED') && currentState === 'UNDER_REVIEW' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />
              <path
                d="M 844 75 L 865 75"
                stroke={allowedTargets.includes('CLOSED') && currentState === 'APPROVED' ? '#22c55e' : '#27272a'}
                markerEnd={allowedTargets.includes('CLOSED') && currentState === 'APPROVED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />

              {/* Decline Re-Route: PENDING_ACCEPTANCE -> NEW (Upper curved loop) */}
              <path
                d="M 175 58 C 150 25, 75 25, 50 58"
                stroke={allowedTargets.includes('NEW') && currentState === 'PENDING_ACCEPTANCE' ? '#f59e0b' : '#3f3f46'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('NEW') && currentState === 'PENDING_ACCEPTANCE' ? 'url(#arrowhead-warning)' : 'url(#arrowhead-subtle)'}
              />

              {/* Correction Loop: UNDER_REVIEW -> CORRECTION_REQUIRED (Lower curve) */}
              <path
                d="M 660 92 C 640 145, 590 185, 565 218"
                stroke={allowedTargets.includes('CORRECTION_REQUIRED') && currentState === 'UNDER_REVIEW' ? '#22c55e' : '#3f3f46'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('CORRECTION_REQUIRED') && currentState === 'UNDER_REVIEW' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />

              {/* Correction Loop: CORRECTION_REQUIRED -> IN_PROGRESS (Return curve) */}
              <path
                d="M 535 218 C 490 180, 460 140, 440 92"
                stroke={allowedTargets.includes('IN_PROGRESS') && currentState === 'CORRECTION_REQUIRED' ? '#22c55e' : '#3f3f46'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('IN_PROGRESS') && currentState === 'CORRECTION_REQUIRED' ? 'url(#arrowhead-allowed)' : 'url(#arrowhead-subtle)'}
              />

              {/* Terminal Rejection: UNDER_REVIEW -> REJECTED (Lower curve) */}
              <path
                d="M 690 92 C 715 145, 765 185, 785 218"
                stroke={allowedTargets.includes('REJECTED') && currentState === 'UNDER_REVIEW' ? '#ef4444' : '#3f3f46'}
                strokeDasharray="4 3"
                markerEnd={allowedTargets.includes('REJECTED') && currentState === 'UNDER_REVIEW' ? 'url(#arrowhead-danger)' : 'url(#arrowhead-subtle)'}
              />
            </g>

            {/* Path Explanatory Annotations */}
            <text x="110" y="24" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
              decline re-route
            </text>
            <text x="615" y="170" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
              evidence deficit
            </text>
            <text x="440" y="170" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
              resumed
            </text>
            <text x="755" y="170" fill="#ef4444" fontSize="10" fontFamily="monospace">
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

              let rectStroke = '#3f3f46';
              let rectFill = '#111118';
              let textFill = '#a1a1aa';
              let strokeWidth = 1.2;
              let strokeDash = undefined;

              if (isCurrent) {
                rectStroke = '#8b5cf6';
                rectFill = '#22222e';
                textFill = '#f5f5f7';
                strokeWidth = 2.4;
              } else if (isError) {
                rectStroke = '#ef4444';
                rectFill = 'rgba(239, 68, 68, 0.15)';
                textFill = '#ef4444';
                strokeWidth = 2;
              } else if (isAllowed) {
                rectStroke = '#22c55e';
                rectFill = 'rgba(34, 197, 94, 0.08)';
                textFill = '#22c55e';
                strokeWidth = 1.8;
                strokeDash = '3 3';
              } else if (isTerminal) {
                rectStroke = state === 'REJECTED' ? 'rgba(239, 68, 68, 0.4)' : '#52525b';
                rectFill = '#1a1a24';
                textFill = state === 'REJECTED' ? '#ef4444' : '#71717a';
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
                      : isTerminal
                        ? 'Terminal State.'
                        : 'Forbidden Target (returns 409).'
                    }`}
                  onClick={() => handleSelectState(state)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectState(state);
                    }
                  }}
                  className={cn(
                    'cursor-pointer focus:outline-none transition-transform duration-150',
                    !shouldReduceMotion && 'hover:scale-[1.03]'
                  )}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  {/* Outer Focus/Hover Glow */}
                  {isCurrent && (
                    <rect
                      x={node.x - node.w / 2 - 3}
                      y={node.y - node.h / 2 - 3}
                      width={node.w + 6}
                      height={node.h + 6}
                      rx="9"
                      fill="none"
                      stroke="#8b5cf6"
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
                      fill="#8b5cf6"
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
        {/* Left Column: Response Payload Panel (D2) */}
        <div className="rounded-lg bg-bg-primary/95 border border-border-subtle p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-primary font-semibold">
                HTTP {activeResponse.status}{' '}
                {activeResponse.status === 200 ? 'OK' : 'Conflict'}
              </span>
              <Badge
                variant={activeResponse.status === 200 ? 'success' : 'error'}
                size="sm"
              >
                {activeResponse.status === 200 ? 'Permitted' : 'Rejected'}
              </Badge>
            </div>
            <span className="font-mono text-[11px] text-text-muted">
              {activeResponse.status === 200
                ? 'Service return value'
                : 'INVALID_STATUS_TRANSITION'}
            </span>
          </div>

          {/* Response Payload Pre Box */}
          <div className="overflow-x-auto rounded bg-bg-secondary p-3 font-mono text-xs leading-relaxed">
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

          {/* D2 Strict Mandatory Captions */}
          <div className="space-y-1 font-mono text-[11px] text-text-muted">
            <p>Simulated response, no network call</p>
            {activeResponse.status === 409 && (
              <p className="text-text-secondary">
                message derived from the transition table
              </p>
            )}
          </div>
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
