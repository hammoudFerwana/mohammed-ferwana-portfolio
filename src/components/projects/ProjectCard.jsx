import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import SpotlightCard from '@/components/shared/SpotlightCard';
import { cn } from '@/lib/utils';

export default function ProjectCard({ project, priority = false }) {
  const isTier1 = project.tier === 1;

  return (
    <SpotlightCard
      as="div"
      className="group overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 h-full"
    >
      <div className="flex-1 flex flex-col">
        {/* Project Image */}
        {project.image && (
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-bg-tertiary border-b border-border-subtle">
            <Image
              src={project.image}
              alt={`${project.title} Preview`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 filter contrast-[1.02]"
            />
          </div>
        )}

        {/* Card Body */}
        <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col">
          {/* Category & Leadership chips above title */}
          {(project.category || project.leadership) && (
            <div className="flex items-center gap-2 flex-wrap">
              {project.category && (
                <Badge variant="accent" size="sm">
                  {project.category}
                </Badge>
              )}
              {project.leadership && (
                <Badge variant="success" size="sm">
                  Leadership
                </Badge>
              )}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                {project.title}
              </h3>
            </div>
            <p className="font-mono text-xs text-text-muted">
              Role: <span className="text-text-secondary">{project.role}</span>
            </p>
            {project.outcome && (
              <p className="text-[15px] text-ink font-medium leading-snug md:truncate">
                {project.outcome}
              </p>
            )}
          </div>

          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Technology Badges */}
          {(() => {
            const chips = (project.cardStack ?? project.technologies ?? []).slice(0, 4);
            if (chips.length === 0) return null;
            return (
              <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
                {chips.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-bg-primary/80 border border-border-subtle text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Card Footer Actions */}
      {(isTier1 || project.links?.github || project.links?.live) && (
        <div className="p-6 sm:p-7 pt-0 border-t border-border-subtle/60 flex items-center justify-between gap-3 mt-4">
        {isTier1 ? (
          <Button href={`/projects/${project.slug}`} variant="outline" size="sm">
            View Architecture Case Study →
          </Button>
        ) : (
          (project.links?.github || project.links?.live) && (
            <div className="flex items-center gap-2">
              {project.links?.github && (
                <Button href={project.links.github} variant="secondary" size="sm" external>
                  GitHub ↗
                </Button>
              )}
              {project.links?.live && (
                <Button href={project.links.live} variant="primary" size="sm" external>
                  Live Demo ↗
                </Button>
              )}
            </div>
          )
        )}

        {/* External links row for Tier 1 */}
        {isTier1 && (project.links?.github || project.links?.dashboard || project.links?.live) && (
          <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                title="GitHub Repository"
              >
                Code ↗
              </a>
            )}
            {project.links?.dashboard && (
              <a
                href={project.links.dashboard}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                title="Live Dashboard"
              >
                Dashboard ↗
              </a>
            )}
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                title="Live Application"
              >
                Live ↗
              </a>
            )}
          </div>
        )}
        </div>
      )}
    </SpotlightCard>
  );
}
