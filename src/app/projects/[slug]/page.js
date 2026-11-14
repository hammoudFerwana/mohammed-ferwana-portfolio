import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { metrics } from '@/data/metrics';
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
import InsurflowEvidence from '@/components/projects/InsurflowEvidence';
import CaseStudyFooter from '@/components/projects/CaseStudyFooter';
import CaseStudyToc from '@/components/projects/CaseStudyToc';
import { cn } from '@/lib/utils';

export const dynamicParams = false;

const sawnTocItems = [
  { id: 'overview', label: 'Overview', inDetails: false },
  { id: 'architecture', label: 'Architecture', inDetails: true },
  { id: 'key-decisions', label: 'Key decisions', inDetails: true },
  { id: 'testing', label: 'Testing', inDetails: true },
  { id: 'trade-offs', label: 'Trade-offs', inDetails: true },
  { id: 'what-i-would-improve', label: 'What I would improve', inDetails: true },
  { id: 'links', label: 'Links', inDetails: false },
];

const FsmSimulator = dynamic(
  () => import('@/components/projects/lab/FsmSimulator'),
  {
    loading: () => (
      <div
        className="min-h-[480px] rounded-xl bg-bg-secondary border border-border-default motion-safe:animate-pulse"
        aria-hidden="true"
      />
    ),
  }
);

const InsurflowConcurrencySandbox = dynamic(
  () => import('@/components/projects/lab/InsurflowConcurrencySandbox'),
  {
    loading: () => (
      <div
        className="min-h-[340px] rounded-xl bg-bg-secondary border border-border-default motion-safe:animate-pulse"
        aria-hidden="true"
      />
    ),
  }
);

const TeamlineWorkspaceSimulator = dynamic(
  () => import('@/components/projects/lab/TeamlineWorkspaceSimulator'),
  {
    loading: () => (
      <div
        className="min-h-[460px] rounded-xl bg-bg-secondary border border-border-default motion-safe:animate-pulse"
        aria-hidden="true"
      />
    ),
  }
);

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

  const isSawn = project.slug === 'insurflow';

  return (
    <div className={cn('pt-28 sm:pt-32 pb-24 mx-auto px-5 sm:px-8', isSawn ? 'max-w-4xl xl:max-w-6xl' : 'max-w-4xl')}>
      <div className={cn(isSawn && 'xl:flex xl:gap-12 xl:items-start')}>
        {isSawn && (
          <CaseStudyToc items={sawnTocItems} detailsId="sawn-tech-details" />
        )}
        <div className="max-w-4xl w-full min-w-0">
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

          {/* Key Facts Box (Sawn) / Meta Row (Other Projects) */}
          {project.slug === 'insurflow' ? (
            <div className="rounded-xl border border-border-default bg-bg-secondary/60 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1">
                <span className="block font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  Role
                </span>
                <span className="block text-[15px] text-text-primary leading-snug">
                  Co-founder &amp; Backend Engineer (sole backend)
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  Team
                </span>
                <span className="block text-[15px] text-text-primary leading-snug">
                  4 people: 2 frontend, 1 mobile, 1 backend
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  Period
                </span>
                <span className="block text-[15px] text-text-primary leading-snug">
                  Aug 2026 – Present
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  Status
                </span>
                <span className="block text-[15px] text-text-primary leading-snug">
                  API live on Render (MongoDB Atlas)
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  Tests
                </span>
                <span className="block text-[15px] text-text-primary leading-snug">
                  {metrics.integrationTests} passing in {metrics.testSuites} suites, run {new Date(`${metrics.testRunDate}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[12px] uppercase tracking-wider text-text-muted">
                  Code
                </span>
                <div className="text-[15px] text-text-primary leading-snug flex flex-col gap-1">
                  <a
                    href="https://github.com/InsurFlow-Team/insurflow-backend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border-default underline-offset-2 hover:text-accent transition-colors"
                  >
                    insurflow-backend on GitHub
                  </a>
                  {project.links?.dashboard && (
                    <a
                      href={project.links.dashboard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-border-default underline-offset-2 hover:text-accent transition-colors"
                    >
                      Live dashboard
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
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
          )}

          {project.slug === 'insurflow' && (
            <p className="text-[17px] text-text-secondary leading-relaxed max-w-[65ch]">
              Sawn helps motor-insurance companies handle accident claims from the first report to closure: field adjusters assess the damage on site, claims officers review and decide, and every step is recorded on the claim.
            </p>
          )}

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
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary/30 via-transparent to-transparent" />
            </div>
          )}
        </header>
      </RevealOnScroll>

      {/* ── Case Study Sections ── */}
      {project.slug === 'insurflow' ? (
        <div className="space-y-0">
          {/* OVERVIEW */}
          <CaseStudySection id="overview" title="Overview">
            <div className="space-y-6">
              {project.problem && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    The Problem
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}

              {project.system && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    The System
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    {project.system}
                  </p>
                </div>
              )}

              {project.backendOwnership && project.backendOwnership.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    Backend Engineering Ownership
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {project.backendOwnership.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-bg-secondary/70 border border-border-subtle space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                          <h4 className="text-sm font-mono font-semibold text-text-primary">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-3.5">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CaseStudySection>

          {/* ── Folded Technical Details ── */}
          <details
            id="sawn-tech-details"
            className="group my-8 rounded-2xl border border-border-default bg-bg-secondary/20 transition-all duration-300"
          >
            <summary className="w-full cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-default hover:border-border-strong text-text-primary font-mono text-sm font-semibold transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent group-open:rounded-b-none group-open:border-b-border-subtle">
              <span className="flex items-center gap-2">
                <span className="group-open:hidden">Show technical details</span>
                <span className="hidden group-open:inline">Hide technical details</span>
              </span>
              <svg
                className="w-5 h-5 text-accent transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <div className="p-4 sm:p-6 space-y-0">
              {/* ARCHITECTURE */}
              {project.architecture && project.architecture.nodes && project.architecture.nodes.length > 0 && (
                <CaseStudySection id="architecture" title="Architecture">
                  <ArchitectureViewer architecture={project.architecture} />
                </CaseStudySection>
              )}

              {/* KEY DECISIONS */}
              {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
                <CaseStudySection id="key-decisions" title="Key decisions">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {project.engineeringDecisions.map((decision, idx) => (
                        <DecisionCard key={idx} decision={decision} index={idx} />
                      ))}
                    </div>
                    {project.slug === 'insurflow' && (
                      <>
                        <FsmSimulator />
                        <InsurflowConcurrencySandbox />
                      </>
                    )}
                    <InsurflowEvidence />
                  </div>
                </CaseStudySection>
              )}

              {/* TESTING */}
              {project.testing && (
                <CaseStudySection id="testing" title="Testing">
                  <TestingSection testing={project.testing} projectSlug={project.slug} />
                </CaseStudySection>
              )}

              {/* TRADE-OFFS */}
              {project.tradeoffs && project.tradeoffs.length > 0 && (
                <CaseStudySection id="trade-offs" title="Trade-Offs">
                  <div className="space-y-3">
                    {project.tradeoffs.map((tradeoff, idx) => (
                      <TradeoffCard key={idx} tradeoff={tradeoff} />
                    ))}
                  </div>
                </CaseStudySection>
              )}

              {/* WHAT I WOULD IMPROVE */}
              {project.whatIWouldImprove && project.whatIWouldImprove.length > 0 && (
                <CaseStudySection id="what-i-would-improve" title="What I Would Improve">
                  <div className="space-y-3">
                    {project.whatIWouldImprove.map((improvement, idx) => (
                      <ImprovementCard key={idx} improvement={improvement} />
                    ))}
                  </div>
                </CaseStudySection>
              )}
            </div>
          </details>

          {/* LINKS */}
          <CaseStudySection id="links" title="Links">
            <ProjectLinks links={project.links} projectSlug={project.slug} />
          </CaseStudySection>
        </div>
      ) : (
        <div className="space-y-0">
          {/* OVERVIEW (Merged Problem, Role/Leadership, and System) */}
          <CaseStudySection title="Overview">
            <div className="space-y-6">
              {project.problem && (
                <p className="text-base text-text-secondary leading-relaxed">
                  {project.problem}
                </p>
              )}

              {(project.solution || project.leadership) && (
                <div className="space-y-4">
                  {project.solution && (
                    <p className="text-base text-text-secondary leading-relaxed">
                      {project.solution}
                    </p>
                  )}
                  <LeadershipCard leadership={project.leadership} />
                </div>
              )}

              {project.system && (
                <p className="text-base text-text-secondary leading-relaxed">
                  {project.system}
                </p>
              )}
            </div>
          </CaseStudySection>

          {/* ARCHITECTURE */}
          {project.architecture && project.architecture.nodes && project.architecture.nodes.length > 0 && (
            <CaseStudySection title="Architecture">
              <ArchitectureViewer architecture={project.architecture} />
            </CaseStudySection>
          )}

          {/* KEY DECISIONS */}
          {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
            <CaseStudySection title="Key decisions">
              <div className="space-y-6">
                <div className="space-y-3">
                  {project.engineeringDecisions.map((decision, idx) => (
                    <DecisionCard key={idx} decision={decision} index={idx} />
                  ))}
                </div>
                {project.slug === 'teamline' && <TeamlineWorkspaceSimulator />}
              </div>
            </CaseStudySection>
          )}

          {/* TRADE-OFFS */}
          {project.tradeoffs && project.tradeoffs.length > 0 && (
            <CaseStudySection title="Trade-Offs">
              <div className="space-y-3">
                {project.tradeoffs.map((tradeoff, idx) => (
                  <TradeoffCard key={idx} tradeoff={tradeoff} />
                ))}
              </div>
            </CaseStudySection>
          )}

          {/* TESTING & RELIABILITY */}
          {project.testing && (
            <CaseStudySection title="Testing & Reliability">
              <TestingSection testing={project.testing} projectSlug={project.slug} />
            </CaseStudySection>
          )}

          {/* WHAT I WOULD IMPROVE */}
          {project.whatIWouldImprove && project.whatIWouldImprove.length > 0 && (
            <CaseStudySection title="What I Would Improve">
              <div className="space-y-3">
                {project.whatIWouldImprove.map((improvement, idx) => (
                  <ImprovementCard key={idx} improvement={improvement} />
                ))}
              </div>
            </CaseStudySection>
          )}

          {/* LINKS */}
          {project.links && (project.links.github || project.links.live || project.links.dashboard) && (
            <CaseStudySection title="Links">
              <ProjectLinks links={project.links} projectSlug={project.slug} />
            </CaseStudySection>
          )}
        </div>
      )}

      {/* ── Case Study Continuation & Conversion Footer ── */}
      <CaseStudyFooter currentProject={project} />
        </div>
      </div>
    </div>
  );
}
