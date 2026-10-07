'use client';

import Link from 'next/link';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { useOverlay } from '@/context/OverlayContext';
import { projects } from '@/data/projects';
import { siteMetadata } from '@/data/siteMetadata';

/**
 * CaseStudyFooter — End-of-case-study continuation and hiring conversion block.
 *
 * 1. Inter-case study navigation (InsurFlow → TeamLine → SAIOS Academy → All Projects)
 * 2. Discussion & hiring CTA routing to /contact
 * 3. Direct email Resume / CV request action
 *
 * @param {Object} props
 * @param {Object} props.currentProject — Current project data object
 */
export default function CaseStudyFooter({ currentProject }) {
  const { openResumeModal } = useOverlay();
  const tier1Projects = projects.filter((p) => p.tier === 1 && p.slug);
  const currentIndex = tier1Projects.findIndex((p) => p.slug === currentProject?.slug);
  const nextProject =
    currentIndex >= 0 && currentIndex < tier1Projects.length - 1
      ? tier1Projects[currentIndex + 1]
      : null;

  return (
    <footer className="mt-16 sm:mt-20 pt-12 border-t border-border-subtle space-y-8" aria-label="Case Study Continuation">
      <RevealOnScroll>
        <div className="space-y-6">
          {/* ── Inter-Case Study Navigation ── */}
          {nextProject ? (
            <div className="rounded-2xl bg-bg-secondary/70 border border-border-default hover:border-border-strong p-6 sm:p-7 transition-all duration-200 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      Next Case Study
                    </span>
                    <Badge variant="neutral" size="sm">
                      {nextProject.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                    <Link href={`/projects/${nextProject.slug}`} className="focus-visible:outline-none focus-visible:underline">
                      {nextProject.title} — {nextProject.description}
                    </Link>
                  </h3>
                  <p className="font-mono text-xs text-text-muted">
                    Role: <span className="text-text-secondary">{nextProject.role}</span>
                  </p>
                </div>
                <div className="shrink-0 pt-2 sm:pt-0">
                  <Button href={`/projects/${nextProject.slug}`} variant="outline" size="md">
                    Read Case Study →
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-bg-secondary/70 border border-border-default p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                    Project Archive
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                    Explore All Engineering Systems
                  </h3>
                  <p className="text-sm text-text-secondary max-w-xl">
                    Browse the complete project catalog or review the InsurFlow flagship case study.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
                  <Button href="/projects" variant="outline" size="md">
                    All Projects →
                  </Button>
                  <Button href="/projects/insurflow" variant="ghost" size="md">
                    InsurFlow Case Study
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── Hiring & Architecture Discussion CTA ── */}
          <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-wider text-functional-success font-semibold">
                  Hiring & Technical Collaboration
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Discuss This Architecture
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Have questions about these architectural choices, or looking for a backend engineer who values test rigor and clean domain boundaries?
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button href="/contact" variant="primary" size="md">
                Start a Conversation →
              </Button>
              <Button
                onClick={openResumeModal}
                variant="secondary"
                size="md"
              >
                Request Resume
              </Button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </footer>
  );
}
