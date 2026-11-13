import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { aboutData } from '@/data/about';

export default function AboutStory() {
  const { story } = aboutData;

  return (
    <section className="py-16 lg:py-24 border-t border-border-subtle" aria-labelledby="story-heading">
      <RevealOnScroll>
        <SectionHeading
          title={story.title}
          description={story.subtitle}
        />
      </RevealOnScroll>

      <div className="space-y-8 mt-10">
        {story.chapters.map((chapter, idx) => (
          <RevealOnScroll key={chapter.label} delay={0.08 * idx}>
            <article className="rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 space-y-4 transition-all duration-300">
              <div className="border-b border-border-subtle pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                  {chapter.label}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {chapter.text}
              </p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
