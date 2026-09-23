import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import Badge from '@/components/shared/Badge';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import CaseStudySection from '@/components/projects/CaseStudySection';
import ArchitectureViewer from '@/components/projects/ArchitectureViewer';
import DecisionCard from '@/components/projects/DecisionCard';
import TradeoffCard from '@/components/projects/TradeoffCard';
import TestingSection from '@/components/projects/TestingSection';
import ImprovementCard from '@/components/projects/ImprovementCard';
import ProjectLinks from '@/components/projects/ProjectLinks';
import LeadershipCard from '@/components/projects/LeadershipCard';

/* ---------- Static Generation ---------- */

export async function generateStaticParams() {
  return projects
    .filter((p) => p.tier === 1 && p.slug)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — Architecture Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Architecture Case Study | Mohammed Ferwana`,
      description: project.description,
      type: 'article',
    },
  };
}

/* ---------- Page Component ---------- */

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Count available sections for section numbering
  let sectionCounter = 0;
  const nextSection = () => {
    sectionCounter += 1;
    return String(sectionCounter).padStart(2, '0');
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto px-5 sm:px-8">
      {/* ── Back Navigation ── */}
      <RevealOnScroll>
        <Link
          href="/projects"
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
          <span className="uppercase tracking-wider">Back to Projects</span>
        </Link>
      </RevealOnScroll>

      {/* ── Project Header ── */}
      <RevealOnScroll>
        <header className="mb-12 md:mb-16 space-y-6">
          {/* Title & Category */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="accent" size="md">
                {project.category}
              </Badge>
              {project.leadership && (
                <Badge variant="success" size="md">
                  Leadership
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
              {project.title}
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[65ch]">
            {project.description}
          </p>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Role:</span>
              <span className="text-text-primary font-medium">{project.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Category:</span>
              <span className="text-text-primary font-medium">{project.category}</span>
            </div>
          </div>

          {/* Technology Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-bg-secondary border border-border-subtle text-text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Hero Image */}
          {project.image && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-bg-tertiary border border-border-default mt-6">
              <Image
                src={project.image}
                alt={`${project.title} system overview`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/30 via-transparent to-transparent" />
            </div>
          )}
        </header>
      </RevealOnScroll>

      {/* ── Case Study Sections ── */}
      <div className="space-y-0">
        {/* 01 — THE PROBLEM */}
        {project.problem && (
          <CaseStudySection number={nextSection()} title="The Problem">
            <p className="text-base text-text-secondary leading-relaxed">
              {project.problem}
            </p>
          </CaseStudySection>
        )}

        {/* 02 — MY ROLE */}
        {(project.role || project.leadership) && (
          <CaseStudySection number={nextSection()} title="My Role">
            <div className="space-y-4">
              {project.solution && (
                <p className="text-base text-text-secondary leading-relaxed">
                  {project.solution}
                </p>
              )}
              <LeadershipCard leadership={project.leadership} />
            </div>
          </CaseStudySection>
        )}

        {/* 03 — THE SYSTEM */}
        {project.system && (
          <CaseStudySection number={nextSection()} title="The System">
            <p className="text-base text-text-secondary leading-relaxed">
              {project.system}
            </p>
          </CaseStudySection>
        )}

        {/* 04 — ARCHITECTURE */}
        {project.architecture && project.architecture.nodes && project.architecture.nodes.length > 0 && (
          <CaseStudySection number={nextSection()} title="Architecture">
            <ArchitectureViewer architecture={project.architecture} />
          </CaseStudySection>
        )}

        {/* 05 — ENGINEERING DECISIONS */}
        {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
          <CaseStudySection number={nextSection()} title="Engineering Decisions">
            <div className="space-y-3">
              {project.engineeringDecisions.map((decision, idx) => (
                <DecisionCard key={idx} decision={decision} index={idx} />
              ))}
            </div>
          </CaseStudySection>
        )}

        {/* 06 — TRADE-OFFS */}
        {project.tradeoffs && project.tradeoffs.length > 0 && (
          <CaseStudySection number={nextSection()} title="Trade-Offs">
            <div className="space-y-3">
              {project.tradeoffs.map((tradeoff, idx) => (
                <TradeoffCard key={idx} tradeoff={tradeoff} />
              ))}
            </div>
          </CaseStudySection>
        )}

        {/* 07 — TESTING & RELIABILITY */}
        {project.testing && (
          <CaseStudySection number={nextSection()} title="Testing & Reliability">
            <TestingSection testing={project.testing} />
          </CaseStudySection>
        )}

        {/* 08 — WHAT I WOULD IMPROVE */}
        {project.whatIWouldImprove && project.whatIWouldImprove.length > 0 && (
          <CaseStudySection number={nextSection()} title="What I Would Improve">
            <div className="space-y-3">
              {project.whatIWouldImprove.map((improvement, idx) => (
                <ImprovementCard key={idx} improvement={improvement} />
              ))}
            </div>
          </CaseStudySection>
        )}

        {/* 09 — LINKS */}
        {project.links && (project.links.github || project.links.live || project.links.dashboard) && (
          <CaseStudySection number={nextSection()} title="Links">
            <ProjectLinks links={project.links} />
          </CaseStudySection>
        )}
      </div>
    </div>
  );
}
