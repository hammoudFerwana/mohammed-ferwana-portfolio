import Link from 'next/link';
import { projects } from '@/data/projects';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import ProjectCard from '@/components/projects/ProjectCard';
import Button from '@/components/shared/Button';

export default function FeaturedProjects() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section className="py-16 lg:py-24 border-t border-border-subtle bg-bg-secondary/15">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeading
            title="Projects"
            description="Two backends I built, with the code and tests behind them."
            className="mb-0 sm:mb-0"
          />
          <Button href="/projects" variant="secondary" size="md">
            View All Projects →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {featuredProjects.map((project, idx) => (
            <RevealOnScroll key={project.id} delay={0.1 * (idx + 1)} className="h-full">
              <ProjectCard project={project} priority={idx === 0} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
