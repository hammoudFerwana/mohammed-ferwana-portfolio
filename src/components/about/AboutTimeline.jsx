import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import Badge from '@/components/shared/Badge';
import { aboutData } from '@/data/about';

export default function AboutTimeline() {
  const { timeline } = aboutData;

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expected':
        return 'warning';
      case 'Completed':
      case 'Milestone':
        return 'accent';
      default:
        return 'neutral';
    }
  };

  return (
    <section className="py-16 md:py-24 border-t border-border-subtle" aria-labelledby="timeline-heading">
      <RevealOnScroll>
        <SectionHeading
          eyebrow="TIMELINE"
          title="Engineering Journey"
          description="Verified milestones tracing academic training, practical immersion, team leadership, and production-oriented backend delivery."
        />
      </RevealOnScroll>

      <div className="relative mt-12 pl-6 sm:pl-8 border-l border-border-default space-y-12">
        {timeline.map((item, idx) => (
          <RevealOnScroll key={`${item.year}-${idx}`} delay={0.08 * idx}>
            <div className="relative group">
              {/* Timeline Node Marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-bg-primary border-2 border-accent flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
              </div>

              {/* Milestone Card */}
              <div className="rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-7 space-y-3 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/25">
                      {item.period}
                    </span>
                    <Badge variant={getBadgeVariant(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs text-text-muted">
                    {item.organization}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>

                {item.highlight && (
                  <div className="pt-2 border-t border-border-subtle/70 text-xs font-mono text-text-muted">
                    <span className="text-accent font-semibold">Focus: </span>
                    {item.highlight}
                  </div>
                )}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
