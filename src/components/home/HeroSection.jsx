import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { siteMetadata } from '@/data/siteMetadata';

export default function HeroSection() {
  const statusItems = [
    { name: 'Backend Engineering', status: 'Operational' },
    { name: 'API Architecture', status: 'Optimal' },
    { name: 'Security & RBAC', status: 'Hardened' },
    { name: 'Automated Testing', status: 'Passing' },
    { name: 'Scalability & Performance', status: 'Indexed' },
  ];

  return (
    <section className="relative min-h-[92dvh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/8 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
        {/* Technical Metadata Bar */}
        <RevealOnScroll delay={0.05}>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-text-muted tracking-widest uppercase bg-bg-secondary/70 border border-border-default px-3.5 py-1.5 rounded-full mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse shrink-0" />
            <span>Node.js · Express · MongoDB · PostgreSQL · System Architecture</span>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <RevealOnScroll delay={0.1}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] text-text-primary leading-[1.08] text-balance">
                Mohammed <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-primary to-text-secondary">
                  Ferwana
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="space-y-2">
                <p className="font-mono text-sm sm:text-base text-accent font-medium tracking-tight">
                  Backend Engineer
                </p>
                <h2 className="text-xl sm:text-2xl text-text-secondary font-medium tracking-tight">
                  Building Scalable & Reliable Systems
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl text-balance">
                I design robust backend architectures, engineer predictable RESTful APIs, and translate complex domain workflows into maintainable, production-ready systems.
              </p>
            </RevealOnScroll>

            {/* CTAs */}
            <RevealOnScroll delay={0.25}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button href="/projects" variant="primary" size="lg">
                  Explore My Work
                </Button>
                <Button
                  href={`mailto:${siteMetadata.email}?subject=Resume%20Request%20%E2%80%94%20Mohammed%20Ferwana`}
                  variant="secondary"
                  size="lg"
                  external
                >
                  Request Resume
                </Button>
                <Button href="/#contact" variant="ghost" size="lg">
                  Let&apos;s Talk →
                </Button>
              </div>
            </RevealOnScroll>
          </div>

          {/* Portrait & System Status Widget (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6">
            <RevealOnScroll delay={0.2} className="w-full max-w-sm">
              <div className="relative group">
                {/* Subtle back ambient glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-accent/30 to-accent-secondary/20 blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />

                {/* Portrait Frame */}
                <div className="relative rounded-2xl overflow-hidden bg-bg-secondary border border-border-strong shadow-2xl aspect-square">
                  <Image
                    src="/images/portrait.jpg"
                    alt="Mohammed Ferwana - Backend Engineer"
                    width={480}
                    height={480}
                    priority
                    className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-95 group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-bg-primary/90 backdrop-blur-md border border-border-default text-xs font-mono">
                    <span className="text-text-primary font-semibold">Mohammed Ferwana</span>
                    <span className="text-accent">Gaza, Palestine</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* System Status Widget (Signature engineering element) */}
            <RevealOnScroll delay={0.3} className="w-full max-w-sm">
              <div
                className="w-full rounded-xl bg-bg-secondary/90 border border-border-default p-4 shadow-lg backdrop-blur-sm"
                aria-hidden="true"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-subtle text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-text-muted uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse" />
                    <span>ENGINEERING CAPABILITIES</span>
                  </div>
                  <span className="text-accent text-[10px]">LIVE</span>
                </div>
                <div className="space-y-2">
                  {statusItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{item.name}</span>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-functional-success" />
                        <span className="text-text-muted">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
