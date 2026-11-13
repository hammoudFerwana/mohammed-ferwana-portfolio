import Link from 'next/link';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import Button from '@/components/shared/Button';

export default function AboutCTA() {
  return (
    <section className="py-16 lg:py-24 border-t border-border-subtle" aria-labelledby="evidence-heading">
      <RevealOnScroll>
        <div className="rounded-2xl bg-linear-to-b from-bg-secondary to-bg-tertiary/40 border border-border-default p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-lg">
          <h2 id="evidence-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Explore the Systems & Evidence
          </h2>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            See the code, the decisions and the tests in the case studies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Button href="/projects/insurflow" variant="primary" size="md">
              Sawn Case Study & Tests
            </Button>
            <Button href="/projects" variant="secondary" size="md">
              Browse All Projects
            </Button>
            <Button href="/experience" variant="secondary" size="md">
              View Experience
            </Button>
            <Button href="/contact" variant="outline" size="md">
              Get in Touch
            </Button>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
