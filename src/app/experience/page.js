import Link from 'next/link';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import Badge from '@/components/shared/Badge';
import { experiences, education } from '@/data/experience';

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
          eyebrow="CAREER & BACKGROUND"
          title="Experience & Education"
          description="A track record of backend delivery, engineering leadership, and foundational computer systems education."
        />
      </RevealOnScroll>

      {/* ── Professional Experience ── */}
      <div className="space-y-8 mt-12">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
            Work & Training
          </span>
          <h2 className="text-xl font-bold text-text-primary">Professional Experience</h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <RevealOnScroll key={exp.id} delay={0.08 * idx}>
              <div className="rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 space-y-5 transition-all duration-300">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={exp.type === 'work' ? 'accent' : 'neutral'} size="sm">
                        {exp.type === 'work' ? 'Work Experience' : 'Professional Program'}
                      </Badge>
                      {exp.isLeadership && (
                        <Badge variant="success" size="sm">
                          Team Leadership
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-1">
                      {exp.title}
                    </h3>
                    <p className="text-sm font-semibold text-accent">
                      {exp.organization}
                    </p>
                  </div>

                  <div className="font-mono text-xs text-text-muted sm:text-right shrink-0">
                    <p>{exp.period}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {exp.description}
                </p>

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border-subtle">
                    <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold block">
                      Key Contributions
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-accent font-bold mt-0.5 shrink-0 select-none" aria-hidden="true">
                            ✓
                          </span>
                          <span className="text-text-primary leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Associated Project Case Study Link */}
                {exp.projectSlug && (
                  <div className="pt-2">
                    <Link
                      href={`/projects/${exp.projectSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover transition-colors"
                    >
                      <span>View {exp.project} Architecture Case Study</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle/60">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-bg-tertiary border border-border-subtle text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* ── Education Section ── */}
      <div className="space-y-8 mt-16 pt-16 border-t border-border-subtle">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold px-2 py-0.5 rounded bg-bg-secondary border border-border-default">
            Academic
          </span>
          <h2 className="text-xl font-bold text-text-primary">Education</h2>
        </div>

        <div className="space-y-6">
          {education.map((edu, idx) => (
            <RevealOnScroll key={edu.id} delay={0.08 * idx}>
              <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <Badge variant="accent" size="sm">
                      {edu.status}
                    </Badge>
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-2">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-accent">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-text-muted shrink-0">
                    {edu.period}
                  </span>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}
