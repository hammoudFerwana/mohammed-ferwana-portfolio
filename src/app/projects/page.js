import SectionHeading from '@/components/shared/SectionHeading';
import ProjectsExplorer from '@/components/projects/ProjectsExplorer';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import Button from '@/components/shared/Button';
import ResumeRequestButton from '@/components/shared/ResumeRequestButton';
import { projects } from '@/data/projects';
import { siteMetadata } from '@/data/siteMetadata';

export const metadata = {
  title: 'Projects & System Architecture',
  description: 'Backend engineering projects, production architectures, and system design case studies by Mohammed Ferwana.',
};

export default function ProjectsPage() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-5 sm:px-8">
      {/* Page Header */}
      <RevealOnScroll>
        <SectionHeading
          as="h1"
          eyebrow="ENGINEERING PORTFOLIO"
          title="Projects & Architecture Case Studies"
          description="A deep dive into modular backend architecture, clean API design, and data schemas built for real-world reliability."
        />
      </RevealOnScroll>

      {/* Interactive Projects Explorer */}
      <div className="mt-12">
        <ProjectsExplorer projects={projects} />
      </div>

      {/* ── Closing Conversion CTA ── */}
      <div className="mt-20 pt-16 border-t border-border-subtle">
        <RevealOnScroll>
          <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20 inline-block">
                Hiring & Collaboration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Looking for a Backend Engineer?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Whether you need scalable REST API architecture, database optimization, or a dedicated engineer for your team, let&apos;s talk.
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
