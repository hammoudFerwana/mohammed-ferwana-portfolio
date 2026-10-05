import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { techStack } from '@/data/techStack';

export default function AboutTechStack() {
  return (
    <section className="py-16 md:py-24 border-t border-border-subtle" aria-labelledby="tech-stack-heading">
      <RevealOnScroll>
        <SectionHeading
          eyebrow="TOOLS I USE"
          title="Technical Stack & Domains"
          description="Technologies, databases, and architectural patterns verified and applied across production-oriented systems and rigorous training."
        />
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {techStack.categories.map((category, idx) => (
          <RevealOnScroll
            key={category.name}
            delay={0.06 * idx}
            className={idx === techStack.categories.length - 1 ? 'md:col-span-2' : ''}
          >
            <div className="h-full rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-7 flex flex-col justify-between transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                    {category.name}
                  </h3>
                  <span className="font-mono text-[11px] text-text-muted">
                    {category.items.length} items
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle">
                <div className="flex flex-wrap gap-2">
                  {category.items.map((tech) => (
                    <span
                      key={tech.name}
                      className="font-mono text-xs px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border-subtle text-text-primary hover:border-accent/40 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60" aria-hidden="true" />
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
