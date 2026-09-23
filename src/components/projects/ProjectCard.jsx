import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { cn } from '@/lib/utils';

export default function ProjectCard({ project, priority = false }) {
  const isTier1 = project.tier === 1;

  return (
    <div
      className={cn(
        'group rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5'
      )}
    >
      <div>
        {/* Project Image */}
        {project.image && (
          <div className="relative w-full aspect-video overflow-hidden bg-bg-tertiary border-b border-border-subtle">
            <Image
              src={project.image}
              alt={`${project.title} Preview`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 filter contrast-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-40" />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Badge variant="accent" size="sm">
                {project.category}
              </Badge>
              {project.leadership && (
                <Badge variant="success" size="sm">
                  Leadership
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                {project.title}
              </h3>
            </div>
            <p className="font-mono text-xs text-text-muted">
              Role: <span className="text-text-secondary">{project.role}</span>
            </p>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Technology Badges */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-bg-primary/80 border border-border-subtle text-text-muted"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 6 && (
                <span className="font-mono text-[10px] px-2 py-1 rounded text-text-muted">
                  +{project.technologies.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
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
    </div>
  );
}
