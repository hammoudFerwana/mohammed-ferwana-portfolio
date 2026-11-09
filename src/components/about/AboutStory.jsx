import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { aboutData } from '@/data/about';

export default function AboutStory() {
  const { story } = aboutData;

  return (
    <section className="py-16 md:py-24 border-t border-border-subtle" aria-labelledby="story-heading">
      <RevealOnScroll>
        <SectionHeading
          eyebrow={story.eyebrow}
          title={story.title}
          description={story.subtitle}
        />
      </RevealOnScroll>

      <div className="space-y-8 mt-10">
        {story.chapters.map((chapter, idx) => (
          <RevealOnScroll key={chapter.number} delay={0.08 * idx}>
            <article className="rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 space-y-4 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-accent/10 border border-accent/25 text-accent font-semibold">
                    CHAPTER {chapter.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                    {chapter.title}
                  </h3>
                </div>
                <span className="font-mono text-xs text-text-muted shrink-0">
                  {chapter.period}
                </span>
              </div>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {chapter.content}
              </p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
