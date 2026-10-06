'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

export default function HowIThink() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Analyze & Frame the Problem',
      summary: 'Define requirements, domain constraints, and entity boundaries before writing code.',
      detail: 'I examine the problem from both user and business viewpoints. I clarify data relationships, security constraints, and throughput expectations so architectural choices solve real problems rather than theoretical ones.',
      keyTakeaway: 'Understanding the problem prevents 90% of subsequent rewrites.',
    },
    {
      num: '02',
      title: 'Model Data & Lifecycle States',
      summary: 'Design database schemas, normalization trade-offs, and state machines.',
      detail: 'I design document schemas and relational models around access patterns. For complex processes like insurance claims or sprint boards, I formalize finite state machines to ensure invalid transitions are strictly impossible.',
      keyTakeaway: 'Data modeling defines the natural ceiling of your system performance.',
    },
    {
      num: '03',
      title: 'Specify Clear API Contracts',
      summary: 'Establish explicit request/response schemas, REST conventions, and error codes.',
      detail: 'I agree on API payloads with frontend teammates before building. Endpoints adhere to REST semantics, predictable HTTP statuses, RFC-compliant error structures, and consistent pagination standards.',
      keyTakeaway: 'Clear API contracts eliminate frontend-backend synchronization friction.',
    },
    {
      num: '04',
      title: 'Implement Defensive Business Logic',
      summary: 'Sanitize inputs, enforce authorization, and encapsulate business rules.',
      detail: 'Incoming requests pass through strict validation middleware before touching domain logic. Authentication is verified statelessly, and RBAC rules are evaluated declaratively to keep business services clean.',
      keyTakeaway: 'Never trust input, and never couple auth checks inside domain services.',
    },
    {
      num: '05',
      title: 'Test Behavior & Edge Cases',
      summary: 'Automate integration test suites, boundary tests, and failure recoveries.',
      detail: 'I write integration tests with Jest and Supertest against realistic database fixtures. Tests focus on security barriers, unauthorized requests, invalid payloads, and transactional integrity.',
      keyTakeaway: 'Tests verify system behavior under duress, not just happy-path successes.',
    },
    {
      num: '06',
      title: 'Profile, Index & Optimize',
      summary: 'Analyze query explain plans, eliminate slow operations, and refactor code.',
      detail: 'After validating functionality, I inspect database explain plans, add compound indexes for high-frequency queries, and eliminate unindexed collection scans through deliberate MongoDB indexing.',
      keyTakeaway: 'Optimize with profiler measurements, never by intuition alone.',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="ENGINEERING PROCESS"
          title="How I Think & Build"
          description="A structured, disciplined engineering workflow transforms chaotic software requirements into robust, self-documenting systems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Steps List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    'relative w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-4 border',
                    isActive
                      ? 'bg-bg-secondary border-accent/40 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-bg-secondary/40 text-text-secondary'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-accent rounded-r-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span
                    className={cn(
                      'font-mono text-xs px-2 py-0.5 rounded border shrink-0 mt-0.5',
                      isActive
                        ? 'bg-accent/15 text-accent border-accent/30 font-semibold'
                        : 'bg-bg-tertiary text-text-muted border-border-default'
                    )}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        'text-sm font-semibold transition-colors',
                        isActive ? 'text-text-primary' : 'text-text-secondary'
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">
                      {step.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Detail Display Card (7 cols) with AnimatePresence */}
          <div className="lg:col-span-7">
            <RevealOnScroll delay={0.1}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="rounded-2xl bg-bg-secondary border border-border-default p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0.03, scale: 0.95 }}
                    animate={{ opacity: 0.08, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-0 right-0 p-8 font-mono text-8xl font-black text-text-primary select-none pointer-events-none"
                  >
                    {steps[activeStep].num}
                  </motion.div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-accent">
                      <span>STEP {steps[activeStep].num} OF 06</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-sm sm:text-base text-accent font-mono">
                      {steps[activeStep].summary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-bg-primary/80 border border-border-subtle text-sm text-text-secondary leading-relaxed space-y-3">
                    <p>{steps[activeStep].detail}</p>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-start gap-3 text-xs">
                    <span className="font-mono text-accent font-semibold uppercase tracking-wider shrink-0 mt-0.5">
                      KEY PRINCIPLE:
                    </span>
                    <p className="text-text-primary font-medium">
                      {steps[activeStep].keyTakeaway}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
