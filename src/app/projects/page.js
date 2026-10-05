import SectionHeading from '@/components/shared/SectionHeading';
import ProjectCard from '@/components/projects/ProjectCard';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import Button from '@/components/shared/Button';
import { projects } from '@/data/projects';
import { siteMetadata } from '@/data/siteMetadata';

export const metadata = {
  title: 'Projects & System Architecture',
  description: 'Backend engineering projects, production architectures, and system design case studies by Mohammed Ferwana.',
};

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.tier === 1);
  const supportingProjects = projects.filter((p) => p.tier === 2);

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

      {/* Featured Projects (Tier 1) */}
      <div className="space-y-6 mt-12">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
            Tier 1
          </span>
          <h2 className="text-xl font-bold text-text-primary">Featured Systems & Case Studies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProjects.map((project, idx) => (
            <RevealOnScroll key={project.id} delay={0.08 * idx}>
              <ProjectCard project={project} priority={idx === 0} />
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Supporting Projects (Tier 2) */}
      {supportingProjects.length > 0 && (
        <div className="space-y-6 mt-20 pt-16 border-t border-border-subtle">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold px-2 py-0.5 rounded bg-bg-secondary border border-border-default">
              Tier 2
            </span>
            <h2 className="text-xl font-bold text-text-primary">Supporting & Volunteer Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {supportingProjects.map((project, idx) => (
              <RevealOnScroll key={project.id} delay={0.08 * idx}>
                <ProjectCard project={project} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      )}

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
