import Link from 'next/link';
import { projects } from '@/data/projects';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import ProjectCard from '@/components/projects/ProjectCard';
import Button from '@/components/shared/Button';

export default function FeaturedProjects() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section className="py-20 md:py-28 border-t border-border-subtle bg-bg-secondary/15">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeading
            eyebrow="PORTFOLIO HIGHLIGHTS"
            title="Featured Engineering Projects"
            description="Systems designed with clear domain logic, resilient database modeling, and strict API contracts."
            className="mb-0 sm:mb-0"
          />
          <Button href="/projects" variant="secondary" size="md">
            View All Projects (7+) →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {featuredProjects.map((project, idx) => (
            <RevealOnScroll key={project.id} delay={0.1 * (idx + 1)}>
              <ProjectCard project={project} priority={idx === 0} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
