'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Badge from '@/components/shared/Badge';
import SpotlightCard from '@/components/shared/SpotlightCard';
import { cn } from '@/lib/utils';

const FILTER_TABS = [
  { id: 'all', label: 'All Milestones' },
  { id: 'work', label: 'Work & Leadership' },
  { id: 'academic', label: 'Academic & Degree' },
];

export default function CareerTimeline({ experiences = [], education = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  const shouldReduceMotion = useReducedMotion();

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showWork = activeTab === 'all' || activeTab === 'work';
  const showAcademic = activeTab === 'all' || activeTab === 'academic';

  const totalCount = experiences.length + education.length;
  const workCount = experiences.length;
  const academicCount = education.length;

  const getTabCount = (tabId) => {
    if (tabId === 'all') return totalCount;
    if (tabId === 'work') return workCount;
    if (tabId === 'academic') return academicCount;
    return 0;
  };

  return (
    <div className="space-y-10">
      {/* ── Interactive Filter Toolbar ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-2 rounded-2xl bg-bg-secondary/80 border border-border-default/90 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Filter career milestones"
          className="flex items-center gap-1.5 overflow-x-auto p-1 scrollbar-none"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="timeline-track"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-3.5 py-2 rounded-xl text-xs font-mono tracking-tight transition-colors duration-200 whitespace-nowrap flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCareerTab"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 450, damping: 35 }
                    }
                    className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-xl -z-0 shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={cn(
                    'relative z-10 px-1.5 py-0.2 rounded-full text-[10px] transition-colors',
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : 'bg-bg-tertiary text-text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Telemetry Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted px-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Verified Track Record</span>
        </div>
      </div>

      {/* ── Kinetic Vertical Timeline Track ── */}
      <div id="timeline-track" className="relative pl-6 sm:pl-10 space-y-12" role="region" aria-live="polite">
        {/* Animated Continuous Conduit Spine */}
        <div
          className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent via-accent-secondary/50 to-border-subtle"
          aria-hidden="true"
        >
          <div className="w-full h-full animate-conduit-pulse opacity-60" />
        </div>

        <AnimatePresence mode="popLayout">
          {/* ── Professional Experiences ── */}
          {showWork &&
            experiences.map((exp, idx) => {
              const isExpanded = expandedCards[exp.id] ?? true; // default open for full clarity
              const visibleResponsibilities = isExpanded
                ? exp.responsibilities
                : exp.responsibilities?.slice(0, 2);

              return (
                <motion.div
                  key={exp.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                    layout: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
                  }}
                  className="relative group"
                >
                  {/* Glowing Node Marker */}
                  <div
                    className="absolute -left-[30px] sm:-left-[41px] top-6 w-5 h-5 rounded-full bg-bg-primary border-2 border-accent flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm shadow-accent/20"
                    aria-hidden="true"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Card Content with 3D Tilt & Spotlight */}
                  <SpotlightCard className="rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 space-y-5 transition-all duration-300">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={exp.type === 'work' ? 'accent' : 'neutral'} size="sm">
                            {exp.type === 'work' ? 'Work Experience' : 'Professional Program'}
                          </Badge>
                          {exp.isLeadership && (
                            <Badge variant="success" size="sm">
                              Team Leadership
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-1">
                          {exp.title}
                        </h3>
                        <p className="text-sm font-semibold text-accent">
                          {exp.organization}
                        </p>
                      </div>

                      <div className="font-mono text-xs text-text-muted sm:text-right shrink-0">
                        <p>{exp.period}</p>
                        <p>{exp.location}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Expandable Key Contributions */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-border-subtle">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-semibold block">
                            Key Contributions & System Impact
                          </span>
                          {exp.responsibilities.length > 2 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(exp.id)}
                              className="text-xs font-mono text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:underline"
                            >
                              <span>{isExpanded ? 'Collapse' : `Show all (${exp.responsibilities.length})`}</span>
                              <span
                                className={cn(
                                  'transition-transform duration-300 text-[10px]',
                                  isExpanded ? 'rotate-180' : 'rotate-0'
                                )}
                              >
                                ▼
                              </span>
                            </button>
                          )}
                        </div>

                        <AnimatePresence initial={false}>
                          <motion.ul
                            layout
                            className="space-y-2.5 text-xs sm:text-sm text-text-secondary"
                          >
                            {visibleResponsibilities.map((resp, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-2.5"
                              >
                                <span
                                  className="text-accent font-bold mt-0.5 shrink-0 select-none"
                                  aria-hidden="true"
                                >
                                  ✓
                                </span>
                                <span className="text-text-primary leading-relaxed">{resp}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Associated Case Study Link */}
                    {exp.projectSlug && (
                      <div className="pt-2">
                        <Link
                          href={`/projects/${exp.projectSlug}`}
                          className="group/link inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover transition-colors"
                        >
                          <span>View {exp.project} Architecture Case Study</span>
                          <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>
                    )}

                    {/* Interactive Technology Micro-Glow Badges */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle/60">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-bg-tertiary border border-border-subtle text-text-muted hover:text-text-primary hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 hover:-translate-y-0.5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </SpotlightCard>
                </motion.div>
              );
            })}

          {/* ── Academic Education Stage ── */}
          {showAcademic &&
            education.map((edu) => (
              <motion.div
                key={edu.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                  layout: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
                }}
                className="relative group"
              >
                {/* Academic Node Marker */}
                <div
                  className="absolute -left-[30px] sm:-left-[41px] top-6 w-5 h-5 rounded-full bg-bg-primary border-2 border-accent-secondary flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm shadow-accent-secondary/20"
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary group-hover:scale-125 transition-transform" />
                </div>

                {/* Card Content with Spotlight */}
                <SpotlightCard className="rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 space-y-4 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <Badge variant="accent" size="sm">
                        {edu.status}
                      </Badge>
                      <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-2">
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-semibold text-accent">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-text-muted shrink-0">
                      {edu.period}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {edu.description}
                  </p>

                  <div className="pt-2 border-t border-border-subtle/70 text-xs font-mono text-text-muted flex items-center gap-2">
                    <span className="text-accent font-semibold">Specialization:</span>
                    <span>Distributed Systems • Database Engines • Algorithms</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
