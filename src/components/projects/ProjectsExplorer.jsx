import ProjectCard from '@/components/projects/ProjectCard';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

export default function ProjectsExplorer({ projects = [] }) {
  const mainProjects = projects.filter((p) => p.tier === 1);
  const otherWork = projects.filter((p) => p.tier === 2);

  const groups = [
    { id: 'group-main-projects', heading: 'Main projects', items: mainProjects },
    { id: 'group-other-work', heading: 'Other work', items: otherWork },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={group.id}
          className="space-y-6"
        >
          <h2
            id={group.id}
            className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight"
          >
            {group.heading}
          </h2>
          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-2 gap-8',
              group.id === 'group-other-work' ? 'items-start' : 'items-stretch'
            )}
          >
            {group.items.map((project, idx) => (
              <RevealOnScroll
                key={project.id}
                delay={0.1 * (idx + 1)}
                className={group.id === 'group-main-projects' ? 'h-full' : 'h-auto'}
              >
                <ProjectCard
                  project={project}
                  priority={group.id === 'group-main-projects' && idx === 0}
                />
              </RevealOnScroll>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
