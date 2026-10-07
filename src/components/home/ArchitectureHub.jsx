'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';
import { soundFx } from '@/lib/soundFx';

const DistributedSystem3D = dynamic(() => import('@/components/home/DistributedSystem3D'), {
  ssr: false,
  loading: () => (
    <div className="h-[440px] sm:h-[500px] rounded-[2rem] bg-bg-secondary/60 border border-border-default flex flex-col items-center justify-center gap-2 font-mono text-xs text-text-muted animate-pulse">
      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
      <span>INITIALIZING 3D SPATIAL MONOLITH...</span>
    </div>
  ),
});

const InteractiveArchitectureLab = dynamic(() => import('@/components/home/InteractiveArchitectureLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-2xl bg-bg-secondary/60 border border-border-default flex flex-col items-center justify-center gap-2 font-mono text-xs text-text-muted animate-pulse">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      <span>LOADING ARCHITECTURE LAB...</span>
    </div>
  ),
});

export default function ArchitectureHub() {
  const [activeView, setActiveView] = useState('3d'); // '3d' | 'lab'

  const handleViewChange = (view) => {
    if (view !== activeView) {
      soundFx.playClick();
      setActiveView(view);
    }
  };

  return (
    <section id="architecture" className="py-20 md:py-32 relative overflow-hidden bg-bg-primary scroll-mt-20">
      {/* Background Volumetric Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-accent/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-cyan-500/8 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header with Live Cluster Indicators */}
        <RevealOnScroll delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <SectionHeading
                eyebrow="DISTRIBUTED ARCHITECTURE STUDIO"
                title="Living 3D Architecture & Interactive Lab"
                description="Explore production backend systems through two synchronized views: orbit the 3D isometric spatial monolith with real-time physics, or execute live request lifecycle simulations with streaming terminal traces."
              />
            </div>

            {/* Live Engineering Telemetry Metrics */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
              <div className="inline-flex items-center gap-2 bg-bg-secondary/90 border border-border-default px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse" />
                <span className="text-text-primary font-medium">Cluster: 100% Healthy</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-bg-secondary/90 border border-border-default px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="text-accent">Avg Latency:</span>
                <span className="text-text-primary font-semibold">1.8ms</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-bg-secondary/90 border border-border-default px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                <span className="text-cyan-400">Cache Hit:</span>
                <span className="text-text-primary font-semibold">94.2%</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* View Switcher Segmented Control */}
        <RevealOnScroll delay={0.08}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-bg-secondary/90 border border-border-default backdrop-blur-xl shadow-lg">
              <button
                type="button"
                onClick={() => handleViewChange('3d')}
                className={cn(
                  'relative px-4 sm:px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2.5 z-10',
                  activeView === '3d'
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {activeView === '3d' && (
                  <motion.div
                    layoutId="architecture-active-tab"
                    className="absolute inset-0 bg-accent rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">🌐</span>
                <span className="relative z-10">3D Spatial Monolith</span>
                <span className="relative z-10 hidden sm:inline-block text-[10px] font-mono opacity-80 uppercase px-1.5 py-0.5 rounded bg-black/20">
                  Physics Orbit
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('lab')}
                className={cn(
                  'relative px-4 sm:px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2.5 z-10',
                  activeView === 'lab'
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {activeView === 'lab' && (
                  <motion.div
                    layoutId="architecture-active-tab"
                    className="absolute inset-0 bg-accent rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">🧪</span>
                <span className="relative z-10">Deep Scenario & Contract Lab</span>
                <span className="relative z-10 hidden sm:inline-block text-[10px] font-mono opacity-80 uppercase px-1.5 py-0.5 rounded bg-black/20">
                  Live Traces
                </span>
              </button>
            </div>

            <p className="text-xs font-mono text-text-muted">
              {activeView === '3d'
                ? 'Tip: Drag or flick to spin the 3D cluster · Click any node'
                : 'Tip: Trigger test scenarios to trace packets and live server logs'}
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Viewport Surface */}
        <AnimatePresence mode="wait">
          {activeView === '3d' ? (
            <motion.div
              key="view-3d"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <DistributedSystem3D />
            </motion.div>
          ) : (
            <motion.div
              key="view-lab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <InteractiveArchitectureLab isEmbedded={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
