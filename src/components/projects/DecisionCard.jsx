'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * DecisionCard — Expand/collapse card for engineering decisions.
 *
 * Shows the decision title with a toggle indicator. On click, reveals the
 * full description and optional context in a muted callout.
 *
 * @param {Object} decision — { title, description, context }
 * @param {number} index — Index for stagger delay
 */
export default function DecisionCard({ decision, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300',
        isExpanded
          ? 'bg-bg-secondary border-accent/20 shadow-md shadow-accent/5'
          : 'bg-bg-secondary/60 border-border-default hover:border-border-strong'
      )}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-start gap-3 p-5 sm:p-6 text-left group"
        aria-expanded={isExpanded}
      >
        {/* Expand/Collapse Indicator */}
        <span
          className={cn(
            'mt-1 shrink-0 text-accent transition-transform duration-200 text-sm font-mono',
            isExpanded ? 'rotate-90' : 'rotate-0'
          )}
          aria-hidden="true"
        >
          ▸
        </span>

        {/* Title */}
        <span
          className={cn(
            'text-sm sm:text-base font-semibold transition-colors duration-200',
            isExpanded
              ? 'text-text-primary'
              : 'text-text-secondary group-hover:text-text-primary'
          )}
        >
          {decision.title}
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-12 sm:pl-14 space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            {decision.description}
          </p>
          {decision.context && (
            <div className="flex items-start gap-2 text-xs text-text-muted bg-bg-primary/60 rounded-lg px-4 py-3 border border-border-subtle">
              <span className="text-accent font-mono shrink-0 mt-px">→</span>
              <span className="leading-relaxed">{decision.context}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
