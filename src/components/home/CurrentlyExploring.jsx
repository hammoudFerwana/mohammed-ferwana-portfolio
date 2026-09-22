import Link from 'next/link';
import { currentlyExploring } from '@/data/labTopics';
import RevealOnScroll from '@/components/shared/RevealOnScroll';

export default function CurrentlyExploring() {
  return (
    <section className="py-16 border-t border-border-subtle bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-bg-primary/80 border border-border-default shadow-inner">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>ACTIVE LEARNING RADAR</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Currently Exploring in the Engineering Lab
              </h3>
              <p className="text-sm text-text-secondary max-w-xl">
                Continuous experimentation keeps systems modern. Exploring advanced query patterns, container pipelines, and fault tolerance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:max-w-md">
              {currentlyExploring.map((topic) => (
                <span
                  key={topic}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-subtle text-text-primary hover:border-accent/40 transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div>
              <Link
                href="/lab"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover transition-colors shrink-0"
              >
                <span>Visit Engineering Lab</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
