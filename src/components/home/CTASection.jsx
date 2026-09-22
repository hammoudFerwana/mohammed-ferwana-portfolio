import Button from '@/components/shared/Button';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { siteMetadata } from '@/data/siteMetadata';

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-8">
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-functional-success" />
            <span>OPEN FOR OPPORTUNITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary text-balance">
            Let&apos;s Build Resilient Systems Together
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto text-balance">
            Whether you need a dedicated Backend Engineer, scalable REST API architecture, or database optimization, I am ready to contribute.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button href="/contact" variant="primary" size="lg">
              Start a Conversation
            </Button>
            <Button
              href="/resume/Mohammed_Ferwana_Resume.pdf"
              variant="secondary"
              size="lg"
              external
            >
              Download Resume
            </Button>
            <Button
              href={siteMetadata.social.github}
              variant="ghost"
              size="lg"
              external
            >
              GitHub Profile ↗
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
