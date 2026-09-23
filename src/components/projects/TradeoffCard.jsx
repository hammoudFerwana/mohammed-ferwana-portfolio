import { cn } from '@/lib/utils';

/**
 * TradeoffCard — Trade-off analysis card.
 *
 * Displays a technical trade-off with the decision made (bold) and
 * the reasoning behind it (secondary text). Used in the "Trade-Offs"
 * section of case study pages.
 *
 * @param {Object} tradeoff — { decision, reasoning }
 */
export default function TradeoffCard({ tradeoff }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-bg-secondary border border-border-default p-5 sm:p-6 space-y-3',
        'hover:border-border-strong transition-colors duration-200'
      )}
    >
      {/* Decision Header */}
      <div className="flex items-start gap-3">
        <span
          className="text-functional-warning text-lg shrink-0 mt-0.5 select-none"
          aria-hidden="true"
        >
          ⚖
        </span>
        <h4 className="text-sm sm:text-base font-semibold text-text-primary leading-snug">
          {tradeoff.decision}
        </h4>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-text-secondary leading-relaxed pl-8 sm:pl-9">
        {tradeoff.reasoning}
      </p>
    </div>
  );
}
