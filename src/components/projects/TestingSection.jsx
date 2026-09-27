import Badge from '@/components/shared/Badge';
import InsurflowTestingEvidence from '@/components/projects/InsurflowTestingEvidence';

/**
 * TestingSection — Testing and reliability display.
 *
 * Renders the testing approach, tools used (as badges), and detailed
 * testing description. When projectSlug === 'insurflow', renders the
 * source-verified empirical testing evidence artifact (P2.5).
 *
 * @param {Object} props
 * @param {Object} props.testing — { approach, tools[], details }
 * @param {string} [props.projectSlug] — Project slug identifier
 */
export default function TestingSection({ testing, projectSlug }) {
  if (projectSlug === 'insurflow') {
    return <InsurflowTestingEvidence />;
  }

  return (
    <div className="rounded-xl bg-bg-secondary border border-border-default p-5 sm:p-6 space-y-5">
      {/* Approach */}
      {testing.approach && (
        <div className="space-y-1.5">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
            Testing Approach
          </span>
          <p className="text-sm text-text-secondary leading-relaxed">
            {testing.approach}
          </p>
        </div>
      )}

      {/* Tools */}
      {testing.tools && testing.tools.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
            Tools & Frameworks
          </span>
          <div className="flex flex-wrap gap-2">
            {testing.tools.map((tool) => (
              <Badge key={tool} variant="neutral" size="md">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      {testing.details && (
        <div className="space-y-1.5 pt-3 border-t border-border-subtle">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold">
            Coverage Details
          </span>
          <p className="text-sm text-text-secondary leading-relaxed">
            {testing.details}
          </p>
        </div>
      )}
    </div>
  );
}
