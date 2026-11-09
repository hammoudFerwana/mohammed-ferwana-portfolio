import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { aboutData } from '@/data/about';

export default function AboutHero() {
  const { hero } = aboutData;

  return (
    <section className="mb-20 md:mb-24">
      <RevealOnScroll>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold px-2.5 py-1 rounded bg-accent/10 border border-accent/20">
              {hero.eyebrow}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary text-balance">
              {hero.title}
            </h1>
            <p className="text-lg sm:text-xl font-mono text-accent">
              {hero.role}
            </p>
          </div>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
            {hero.summary}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
            {hero.highlights.map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl bg-bg-secondary border border-border-default hover:border-border-strong transition-colors"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
