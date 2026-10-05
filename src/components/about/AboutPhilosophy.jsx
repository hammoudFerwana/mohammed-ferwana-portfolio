import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { aboutData } from '@/data/about';

export default function AboutPhilosophy() {
  const { principles } = aboutData;

  return (
    <section className="py-16 md:py-24 border-t border-border-subtle" aria-labelledby="philosophy-heading">
      <RevealOnScroll>
        <SectionHeading
          eyebrow="HOW I WORK"
          title="Engineering Philosophy"
          description="Seven foundational principles that guide my architectural decisions, code quality, and engineering mindset."
        />
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {principles.map((principle, idx) => (
          <RevealOnScroll
            key={principle.num}
            delay={0.06 * idx}
            className={idx === principles.length - 1 ? 'md:col-span-2' : ''}
          >
            <div className="h-full rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/25 text-accent font-semibold">
                    {principle.num}
                  </span>
                  <span className="text-text-muted uppercase tracking-wider">PRINCIPLE</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                  {principle.title}
                </h3>

                <p className="font-mono text-xs sm:text-sm text-accent">
                  {principle.tagline}
                </p>

                <p className="text-sm text-text-secondary leading-relaxed pt-1">
                  {principle.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex items-start gap-2.5 text-xs">
                <span className="font-mono text-text-muted uppercase tracking-wider shrink-0 mt-0.5">
                  RULE:
                </span>
                <p className="text-text-primary font-medium">
                  {principle.takeaway}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
