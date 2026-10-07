'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import CounterTicker from '@/components/shared/CounterTicker';
import TextScramble from '@/components/shared/TextScramble';
import { useOverlay } from '@/context/OverlayContext';
import { siteMetadata } from '@/data/siteMetadata';
import { metrics } from '@/data/metrics';
import InteractivePortraitCard from '@/components/home/InteractivePortraitCard';

export default function HeroSection() {
  const { openResumeModal } = useOverlay();

  return (
    <section className="relative min-h-[92dvh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Animated Aurora Mesh (3 Orbs, GPU-accelerated) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-accent/10 blur-[130px] rounded-full animate-aurora" />
        <div
          className="absolute top-1/3 right-1/4 translate-x-1/4 -translate-y-1/2 w-[480px] h-[380px] bg-accent-secondary/10 blur-[140px] rounded-full animate-aurora"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/4 w-[380px] h-[320px] bg-cyan-500/5 blur-[120px] rounded-full animate-aurora"
          style={{ animationDelay: '-11s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
        {/* Technical Metadata Bar (Frame 0ms - 50ms) */}
        <RevealOnScroll delay={0.05}>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-text-muted tracking-widest uppercase bg-bg-secondary/70 border border-border-default px-3.5 py-1.5 rounded-full mb-8 shadow-inner hover:border-accent/40 transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse-ring shrink-0" />
            <TextScramble
              text="Node.js · Express · MongoDB · REST APIs · System Architecture"
              speed={28}
              delay={200}
            />
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <RevealOnScroll delay={0.15}>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] text-text-primary leading-[1.08] text-balance">
                  Mohammed
                </h1>
              </RevealOnScroll>
              <RevealOnScroll delay={0.25}>
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.08] text-transparent bg-clip-text animate-shimmer inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(110deg, #f5f5f7 0%, #8b5cf6 35%, #6366f1 65%, #f5f5f7 100%)',
                    backgroundSize: '250% 100%',
                  }}
                >
                  Ferwana
                </span>
              </RevealOnScroll>
            </div>

            <RevealOnScroll delay={0.35}>
              <div className="space-y-2">
                <p className="font-mono text-sm sm:text-base text-accent font-medium tracking-tight">
                  <TextScramble text="Backend Engineer" speed={35} delay={400} />
                </p>
                <h2 className="text-xl sm:text-2xl text-text-secondary font-medium tracking-tight">
                  Building Scalable & Reliable Systems
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.45}>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl text-balance">
                I design robust backend architectures, engineer predictable RESTful APIs, and translate complex domain workflows into maintainable, production-ready systems.
              </p>
            </RevealOnScroll>

            {/* CTAs (Frame 550ms) with Magnetic Spring Interaction */}
            <RevealOnScroll delay={0.55}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button href="/projects" variant="primary" size="lg" magnetic>
                  Explore My Work →
                </Button>
                <Button
                  onClick={openResumeModal}
                  variant="secondary"
                  size="lg"
                  magnetic
                >
                  Request Resume
                </Button>
                <Button href="/contact" variant="ghost" size="lg" magnetic>
                  Let&apos;s Talk →
                </Button>
              </div>
            </RevealOnScroll>
          </div>

          {/* Portrait & System Status Widget (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6">
            <RevealOnScroll delay={0.7} className="w-full max-w-sm">
              <InteractivePortraitCard />
            </RevealOnScroll>

            {/* System Status Widget (Signature engineering element - Frame 850ms) */}
            <RevealOnScroll delay={0.85} className="w-full max-w-sm">
              <div
                className="w-full rounded-xl bg-bg-secondary/90 border border-border-default p-4 shadow-lg backdrop-blur-sm"
                aria-hidden="true"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-subtle text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-text-muted uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse-ring shrink-0" />
                    <span>VERIFIED EVIDENCE</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-functional-success shrink-0" />
                    <span className="text-text-secondary font-mono text-[11px]">
                      <CounterTicker value={metrics.integrationTests} className="text-text-primary font-semibold" /> integration tests · <CounterTicker value={metrics.testSuites} className="text-text-primary font-semibold" /> suites
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-functional-success shrink-0" />
                    <span className="text-text-secondary font-mono text-[11px]">
                      Concurrency: <CounterTicker value={metrics.concurrentRequests} className="text-text-primary font-semibold" /> requests, no collisions or gaps
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-functional-success shrink-0" />
                    <span className="text-text-secondary font-mono text-[11px]">
                      <CounterTicker value={metrics.fsmStates} className="text-text-primary font-semibold" />-state claim lifecycle, guarded transitions
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-border-subtle/50">
                    <span className="text-text-secondary font-mono text-[11px]">
                      Portfolio CI: lint and build
                    </span>
                    <Image
                      src={`https://github.com/hammoudFerwana/mohammed-ferwana-portfolio/actions/workflows/ci.yml/badge.svg?branch=${metrics.ciBadgeBranch}`}
                      alt="Portfolio CI: lint and build"
                      width={106}
                      height={20}
                      unoptimized
                      className="h-4 sm:h-5 w-auto"
                    />
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
