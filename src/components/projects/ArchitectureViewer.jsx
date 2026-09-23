'use client';

import { useState, useCallback, useRef } from 'react';
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
    api: 'border-accent/40 bg-accent/10 text-accent hover:border-accent',
    auth: 'border-functional-warning/40 bg-functional-warning/10 text-functional-warning hover:border-functional-warning',
    logic: 'border-accent-secondary/40 bg-accent-secondary/10 text-text-primary hover:border-accent-secondary',
    data: 'border-border-strong bg-bg-tertiary text-text-primary hover:border-border-strong',
    db: 'border-functional-success/40 bg-functional-success/10 text-functional-success hover:border-functional-success',
    external:
      'border-dashed border-border-strong bg-bg-primary text-text-secondary hover:border-text-secondary',
  };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-bg-secondary border border-border-default overflow-hidden p-6 sm:p-8 space-y-8 shadow-xl"
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
        className="p-6 rounded-xl bg-bg-primary/90 border border-border-subtle flex flex-col items-center gap-6 relative overflow-x-auto"
        onClick={handleContainerClick}
        role="group"
        aria-label="System architecture diagram"
      >
        {/* Nodes Grid */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-4">
          {architecture.nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const style = nodeTypeStyles[node.type] || nodeTypeStyles.logic;
            const nextNode = architecture.nodes[index + 1];
            const connectionLabel = nextNode
              ? getConnectionLabel(node, nextNode)
              : null;

            return (
              <div key={node.id} className="w-full flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  aria-label={`${node.label} — ${node.type} component. ${node.description}`}
                  aria-pressed={isSelected}
                  className={cn(
                    'w-full sm:w-80 p-3.5 rounded-xl border text-center font-mono text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm relative group',
                    style,
                    isSelected
                      ? 'ring-2 ring-accent scale-[1.02] shadow-accent/20 shadow-lg'
                      : 'opacity-85 hover:opacity-100 hover:scale-[1.01]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted">
                      {node.type}
                    </span>
                    {isSelected && (
                      <span
                        className="w-2 h-2 rounded-full bg-accent animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="text-text-primary font-bold text-sm my-1">
                    {node.label}
                  </div>
                  <p className="text-[11px] text-text-muted font-sans font-normal line-clamp-1">
                    {node.description}
                  </p>
                </button>

                {/* Connector arrow with optional label */}
                {index < architecture.nodes.length - 1 && (
                  <div className="my-1.5 flex flex-col items-center" aria-hidden="true">
                    <div className="w-0.5 h-3 bg-border-strong" />

                    {/* Connection Label */}
                    {connectionLabel && (
                      <span className="font-mono text-[9px] text-text-muted/70 px-2 py-0.5 rounded bg-bg-secondary/80 border border-border-subtle my-0.5 select-none">
                        {connectionLabel}
                      </span>
                    )}

                    <svg
                      className="w-3 h-3 text-accent -mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Inspection Panel (Selected or Instructional State) */}
      {selectedNode ? (
        <div
          className="rounded-xl bg-bg-tertiary/70 border border-border-default p-5 sm:p-6 space-y-4 transition-all duration-200"
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
        </div>
      ) : (
        <div
          className="rounded-xl bg-bg-tertiary/40 border border-dashed border-border-default p-6 text-center transition-all duration-200"
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
        </div>
      )}
    </div>
  );
}
