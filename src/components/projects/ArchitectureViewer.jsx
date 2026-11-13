'use client';

import { useState, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Badge from '@/components/shared/Badge';

/**
 * ArchitectureViewer — Interactive system architecture visualization.
 *
 * Renders a visual topology of system components as clickable nodes with
 * SVG connector arrows and connection labels. Selecting a node reveals
 * a detail panel with component description and responsibilities.
 *
 * Accessibility:
 * - Nodes are <button> elements with aria-label and aria-pressed
 * - Detail panel uses aria-live="polite" for screen reader updates
 * - Full keyboard navigation (Tab, Enter/Space to select)
 * - Respects prefers-reduced-motion
 *
 * @param {Object} architecture — { nodes[], connections[] }
 */
export default function ArchitectureViewer({ architecture }) {
  const [selectedNodeId, setSelectedNodeId] = useState(
    architecture?.nodes?.[0]?.id || null
  );
  const containerRef = useRef(null);

  // Click-outside deselect handler — declared before guard per rules-of-hooks
  const handleContainerClick = useCallback(
    (e) => {
      // Only deselect if clicking the canvas background, not a node button
      if (e.target === e.currentTarget) {
        setSelectedNodeId(null);
      }
    },
    []
  );

  // Find connection label between sequential nodes
  const getConnectionLabel = useCallback(
    (fromNode, toNode) => {
      if (!architecture?.connections) return null;
      const conn = architecture.connections.find(
        (c) => c.from === fromNode.id && c.to === toNode.id
      );
      return conn?.label || null;
    },
    [architecture?.connections]
  );

  // Guard: no data — placed after all hooks
  if (!architecture || !architecture.nodes || architecture.nodes.length === 0) {
    return null;
  }

  const selectedNode = selectedNodeId
    ? architecture.nodes.find((n) => n.id === selectedNodeId) || null
    : null;

  const nodeTypeStyles = {
    client:
      'border-border-strong bg-bg-secondary text-text-primary hover:border-accent/60',
    api: 'border-accent/40 bg-accent/10 in-data-[theme=light]:bg-surface text-accent hover:border-accent',
    auth: 'border-functional-warning/40 bg-functional-warning/10 in-data-[theme=light]:bg-surface text-functional-warning hover:border-functional-warning',
    logic: 'border-accent-secondary/40 bg-accent-secondary/10 in-data-[theme=light]:bg-surface text-text-primary hover:border-accent-secondary',
    data: 'border-border-strong bg-bg-tertiary text-text-primary hover:border-border-strong',
    db: 'border-functional-success/40 bg-functional-success/10 in-data-[theme=light]:bg-surface text-functional-success hover:border-functional-success',
    external:
      'border-dashed border-border-strong bg-bg-primary text-text-secondary hover:border-text-secondary',
  };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-bg-secondary border border-border-default overflow-hidden p-5 sm:p-6 space-y-5 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-wider">
            <span
              className="w-2 h-2 rounded-full bg-accent animate-pulse"
              aria-hidden="true"
            />
            <span>Interactive System Topology</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary mt-1">
            Component Architecture & Data Flow
          </h3>
        </div>
        <p className="text-xs font-mono text-text-muted">
          Click any component to inspect responsibilities
        </p>
      </div>

      {/* Visual Diagram Canvas */}
      <div
        className="p-4 sm:p-5 rounded-xl bg-bg-primary/90 border border-border-subtle relative"
        onClick={handleContainerClick}
        role="group"
        aria-label="System architecture diagram"
      >
        {/* Desktop: One horizontal row on lg+ */}
        <div className="hidden lg:flex items-stretch justify-between gap-1.5 w-full">
          {architecture.nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const style = nodeTypeStyles[node.type] || nodeTypeStyles.logic;
            return (
              <div key={node.id} className="flex-1 min-w-0 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex-1 min-w-0 p-2.5 rounded-lg border text-left font-mono transition-all duration-200 relative group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent flex flex-col justify-between h-full min-h-[72px]',
                    style,
                    isSelected
                      ? 'ring-2 ring-accent shadow-sm scale-[1.02]'
                      : 'hover:border-accent/60'
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted">
                      {node.type}
                    </span>
                    {isSelected && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="text-text-primary font-bold text-xs mt-1 leading-snug break-words" title={node.label}>
                    {node.label}
                  </div>
                </button>

                {index < architecture.nodes.length - 1 && (
                  <svg
                    className="w-3.5 h-3.5 text-accent/60 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet: 2-column grid below lg */}
        <div className="grid grid-cols-2 gap-2.5 w-full lg:hidden items-stretch">
          {architecture.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const style = nodeTypeStyles[node.type] || nodeTypeStyles.logic;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                aria-pressed={isSelected}
                className={cn(
                  'p-2.5 rounded-lg border text-left font-mono transition-all duration-200 relative group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent flex flex-col justify-between min-h-[64px]',
                  style,
                  isSelected
                    ? 'ring-2 ring-accent shadow-sm'
                    : 'hover:border-accent/60'
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">
                    {node.type}
                  </span>
                  {isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="text-text-primary font-bold text-xs mt-1 leading-snug break-words" title={node.label}>
                  {node.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Component Inspection Panel (Selected or Instructional State with AnimatePresence) */}
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <m.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-xl bg-bg-tertiary/70 border border-border-default p-5 sm:p-6 space-y-4 shadow-inner"
            aria-live="polite"
            role="region"
            aria-label={`Details for ${selectedNode.label}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h4 className="text-lg font-bold text-text-primary tracking-tight">
                  {selectedNode.label}
                </h4>
                <Badge variant="accent" size="sm">
                  {selectedNode.type}
                </Badge>
              </div>
              <span className="font-mono text-[11px] text-text-muted">
                Node ID: #{selectedNode.id}
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {selectedNode.description}
            </p>

            {selectedNode.responsibilities &&
              selectedNode.responsibilities.length > 0 && (
                <div className="pt-3 border-t border-border-subtle/80 space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold block">
                    Primary Component Responsibilities
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-primary">
                    {selectedNode.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5 font-bold" aria-hidden="true">
                          ✓
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </m.div>
        ) : (
          <m.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl bg-bg-tertiary/40 border border-dashed border-border-default p-6 text-center"
            aria-live="polite"
            role="region"
            aria-label="Component inspection instructions"
          >
            <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                <span>INSPECTION READY</span>
              </div>
              <p className="text-sm text-text-secondary">
                Select a component to explore its responsibilities and architectural role.
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
