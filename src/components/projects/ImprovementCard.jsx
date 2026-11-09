/**
 * ImprovementCard — Future improvement item card.
 *
 * Displays a single area of future improvement with a directional
 * arrow indicator. Used in the "What I Would Improve" section of
 * case study pages.
 *
 * @param {Object} improvement — { area, description }
 */
export default function ImprovementCard({ improvement }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-bg-secondary/60 border border-border-default p-5 sm:p-6 hover:border-border-strong transition-colors duration-200">
      {/* Arrow Indicator */}
      <span
        className="text-accent font-mono text-base shrink-0 mt-0.5 select-none"
        aria-hidden="true"
      >
        →
      </span>

      {/* Content */}
      <div className="space-y-1.5">
        <h4 className="text-sm sm:text-base font-semibold text-text-primary">
          {improvement.area}
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          {improvement.description}
        </p>
      </div>
    </div>
  );
}
