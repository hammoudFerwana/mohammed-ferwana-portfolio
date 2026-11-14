import Link from 'next/link';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import CareerTimeline from '@/components/experience/CareerTimeline';
import Button from '@/components/shared/Button';
import ResumeRequestButton from '@/components/shared/ResumeRequestButton';
import { experiences, education } from '@/data/experience';
import { certificates } from '@/data/certificates';

export const metadata = {
  title: 'Engineering Experience & Background',
  description: 'Experience, training and education of Mohammed Ferwana, Backend Engineer.',
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
          title="Experience & Education"
          description="Work, training and education, newest first."
        />
      </RevealOnScroll>

      {/* ── Interactive Career & Education Timeline ── */}
      <div className="mt-12">
        <CareerTimeline experiences={experiences} education={education} />
      </div>

      {/* ── Certificates ── */}
      <section aria-labelledby="certificates-heading" className="mt-16 lg:mt-24 pt-16 lg:pt-24 border-t border-border-subtle space-y-6">
        <h2 id="certificates-heading" className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Certificates
        </h2>

        <ul className="divide-y divide-border-subtle rounded-2xl bg-bg-secondary border border-border-default">
          {certificates.map((cert) => (
            <li
              key={cert.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-text-primary leading-snug">
                  {cert.title}
                </h3>
                <p className="text-sm text-accent font-medium">
                  {cert.issuer}
                </p>
                {cert.details && (
                  <p className="text-xs text-text-secondary font-mono">
                    {cert.details}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0 font-mono text-xs">
                <span className="text-text-muted">{cert.date}</span>
                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors"
                  >
                    Verify ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Closing Conversion CTA ── */}
      <div className="mt-16 lg:mt-24 pt-16 lg:pt-24 border-t border-border-subtle">
        <RevealOnScroll>
          <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Need a backend engineer?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                For a role on your team or an API for your product, let&apos;s talk.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button href="/contact" variant="primary" size="md">
                Get in Touch →
              </Button>
              <ResumeRequestButton variant="secondary" size="md" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
