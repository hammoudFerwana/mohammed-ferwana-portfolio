import { currentlyExploring } from '@/data/labTopics';
import RevealOnScroll from '@/components/shared/RevealOnScroll';

export default function CurrentlyExploring() {
  return (
    <section id="learning-radar" className="py-16 border-t border-border-subtle bg-bg-secondary/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-bg-primary/80 border border-border-default shadow-inner">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>ACTIVE LEARNING RADAR</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Active Research & Technical Exploration
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

            <div className="flex items-center gap-2 font-mono text-xs text-text-muted shrink-0 bg-bg-secondary px-3.5 py-2 rounded-lg border border-border-default">
              <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse" aria-hidden="true" />
              <span>Active Investigation</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
