import Link from 'next/link';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import CareerTimeline from '@/components/experience/CareerTimeline';
import Button from '@/components/shared/Button';
import { experiences, education } from '@/data/experience';
import { siteMetadata } from '@/data/siteMetadata';

export const metadata = {
  title: 'Engineering Experience & Background',
  description: 'Professional experience, technical leadership, and engineering education of Mohammed Ferwana.',
};

export default function ExperiencePage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-5 sm:px-8">
      {/* ── Back Navigation ── */}
      <RevealOnScroll>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-200 mb-10 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="uppercase tracking-wider">Back to Home</span>
        </Link>
      </RevealOnScroll>

      {/* ── Page Header ── */}
      <RevealOnScroll>
        <SectionHeading
          as="h1"
          eyebrow="CAREER & BACKGROUND"
          title="Experience & Education"
          description="A track record of backend delivery, engineering leadership, and foundational computer systems education."
        />
      </RevealOnScroll>

      {/* ── Interactive Career & Education Timeline ── */}
      <div className="mt-12">
        <CareerTimeline experiences={experiences} education={education} />
      </div>

      {/* ── Closing Conversion CTA ── */}
      <div className="mt-16 pt-16 border-t border-border-subtle">
        <RevealOnScroll>
          <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 inline-block">
                Next Steps
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Ready to Discuss Engineering Opportunities?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Currently open to backend engineering roles, scalable systems contracts, and technical consulting.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button href="/contact" variant="primary" size="md">
                Get in Touch →
              </Button>
              <Button
                href={`mailto:${siteMetadata.email}?subject=Resume%20Request%20%E2%80%94%20Mohammed%20Ferwana`}
                variant="secondary"
                size="md"
                external
              >
                Request Resume
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
