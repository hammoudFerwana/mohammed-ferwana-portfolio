import Badge from '@/components/shared/Badge';

/**
 * LeadershipCard — Leadership and team lead experience card.
 *
 * Renders when a project has `leadership` data, showing the leadership
 * role description and list of specific responsibilities. Highlights
 * Mohammed's team leadership capabilities.
 *
 * @param {Object} leadership — { description, responsibilities[] }
 */
export default function LeadershipCard({ leadership }) {
  if (!leadership) return null;

  return (
    <div className="rounded-xl bg-bg-secondary border border-functional-success/15 p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Badge variant="success" size="sm">
          Leadership
        </Badge>
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
          Team Lead Role
        </span>
      </div>

      {/* Description */}
      {leadership.description && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {leadership.description}
        </p>
      )}

      {/* Responsibilities */}
      {leadership.responsibilities && leadership.responsibilities.length > 0 && (
        <ul className="space-y-2 pt-2 border-t border-border-subtle">
          {leadership.responsibilities.map((resp, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="text-functional-success font-bold mt-0.5 shrink-0 select-none" aria-hidden="true">
                ✓
              </span>
              <span className="text-text-primary leading-relaxed">{resp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
