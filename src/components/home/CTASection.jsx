'use client';

import { motion } from 'framer-motion';
import Button from '@/components/shared/Button';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { siteMetadata } from '@/data/siteMetadata';

export default function CTASection() {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-border-subtle relative overflow-hidden scroll-mt-20">
      {/* Background Animated Aurora Finale (3 Orbs, GPU-accelerated) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-accent/12 blur-[130px] rounded-full animate-aurora" />
        <div
          className="absolute top-1/2 right-1/3 translate-x-1/4 -translate-y-1/2 w-[440px] h-[300px] bg-accent-secondary/10 blur-[130px] rounded-full animate-aurora"
          style={{ animationDelay: '-5s' }}
        />
        <div
          className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[240px] bg-cyan-500/8 blur-[110px] rounded-full animate-aurora"
          style={{ animationDelay: '-10s' }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10 space-y-8">
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse-ring" />
            <span>OPEN FOR OPPORTUNITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary text-balance">
            Let&apos;s Build Resilient Systems{' '}
            <span className="relative inline-block">
              Together
              <span
                className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-accent to-accent-secondary rounded-full"
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto text-balance">
            Whether you need a dedicated Backend Engineer, scalable REST API architecture, or database optimization, I am ready to contribute.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              href={`mailto:${siteMetadata.email}?subject=Project%20Inquiry%20%E2%80%94%20Mohammed%20Ferwana`}
              variant="primary"
              size="lg"
              external
              magnetic
            >
              Start a Conversation →
            </Button>
            <Button
              href={siteMetadata.social.linkedin}
              variant="secondary"
              size="lg"
              external
              magnetic
            >
              Connect on LinkedIn ↗
            </Button>
            <Button
              href={siteMetadata.social.github}
              variant="ghost"
              size="lg"
              external
              magnetic
            >
              GitHub Profile ↗
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
