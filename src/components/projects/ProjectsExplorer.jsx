'use client';

import { useState, useMemo } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import ProjectCard from '@/components/projects/ProjectCard';
import { cn } from '@/lib/utils';

const FILTERS = [
  { id: 'all', label: 'All Systems' },
  { id: 'tier1', label: 'Case Studies (Tier 1)' },
  { id: 'leadership', label: 'Team Leadership' },
  { id: 'claims', label: 'B2B & FinTech' },
  { id: 'platforms', label: 'Workspaces & EdTech' },
];

export default function ProjectsExplorer({ projects = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Filter match
      let matchesFilter = true;
      if (activeFilter === 'tier1') {
        matchesFilter = project.tier === 1;
      } else if (activeFilter === 'leadership') {
        matchesFilter = Boolean(project.leadership) || project.role?.includes('Team Leader');
      } else if (activeFilter === 'claims') {
        matchesFilter =
          project.category?.toLowerCase().includes('claims') || project.id === 'insurflow';
      } else if (activeFilter === 'platforms') {
        matchesFilter =
          project.category === 'Platform' || project.category === 'Education';
      }

      if (!matchesFilter) return false;

      // 2. Search match
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = project.title?.toLowerCase().includes(query);
      const descMatch = project.description?.toLowerCase().includes(query);
      const roleMatch = project.role?.toLowerCase().includes(query);
      const categoryMatch = project.category?.toLowerCase().includes(query);
      const techMatch = project.technologies?.some((t) =>
        t.toLowerCase().includes(query)
      );

      return titleMatch || descMatch || roleMatch || categoryMatch || techMatch;
    });
  }, [projects, activeFilter, searchQuery]);

  const projectGroups = useMemo(() => {
    const mainProjects = filteredProjects.filter((p) => p.tier === 1);
    const otherWork = filteredProjects.filter((p) => p.tier === 2);

    return [
      { id: 'group-main-projects', heading: 'Main projects', items: mainProjects },
      { id: 'group-other-work', heading: 'Other work', items: otherWork },
    ].filter((group) => group.items.length > 0);
  }, [filteredProjects]);

  // Compute counts for each filter pill
  const filterCounts = useMemo(() => {
    return FILTERS.reduce((acc, f) => {
      if (f.id === 'all') {
        acc[f.id] = projects.length;
      } else if (f.id === 'tier1') {
        acc[f.id] = projects.filter((p) => p.tier === 1).length;
      } else if (f.id === 'leadership') {
        acc[f.id] = projects.filter(
          (p) => Boolean(p.leadership) || p.role?.includes('Team Leader')
        ).length;
      } else if (f.id === 'claims') {
        acc[f.id] = projects.filter(
          (p) =>
            p.category?.toLowerCase().includes('claims') || p.id === 'insurflow'
        ).length;
      } else if (f.id === 'platforms') {
        acc[f.id] = projects.filter(
          (p) => p.category === 'Platform' || p.category === 'Education'
        ).length;
      }
      return acc;
    }, {});
  }, [projects]);

  const handleReset = () => {
    setActiveFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* ── Controls Toolbar: Filter Tabs & Live Search ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-2xl bg-bg-secondary/80 border border-border-default/90 backdrop-blur-md">
        {/* Category Tabs with Animated Pill */}
        <div
          role="tablist"
          aria-label="Filter projects by domain and category"
          className="flex items-center gap-1.5 overflow-x-auto p-1 scrollbar-none"
        >
          {FILTERS.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = filterCounts[tab.id] ?? 0;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="projects-grid"
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'relative px-3.5 py-2 rounded-xl text-xs font-mono tracking-tight transition-colors duration-200 whitespace-nowrap flex items-center gap-2 select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent',
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {isActive && (
                  <m.div
                    layoutId="activeFilterPill"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 450, damping: 35 }
                    }
                    className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-xl -z-0 shadow-xs"
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

        {/* Live Technology Search Input */}
        <div className="relative w-full md:w-72 shrink-0 px-1 md:px-0">
          <label htmlFor="project-search" className="sr-only">
            Search projects by technology or keyword
          </label>
          <div className="relative flex items-center">
            <svg
              className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="project-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack (e.g. MongoDB, FSM, Jest)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-bg-primary/80 border border-border-subtle focus:border-accent text-xs font-mono text-text-primary placeholder:text-text-muted transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 text-text-muted hover:text-text-primary transition-colors text-xs"
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Telemetry Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted px-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"
            aria-hidden="true"
          />
          <span>
            {filteredProjects.length === projects.length
              ? `Displaying all ${projects.length} architectural systems`
              : `Found ${filteredProjects.length} of ${projects.length} systems matching criteria`}
          </span>
        </div>
        {(activeFilter !== 'all' || searchQuery.trim() !== '') && (
          <button
            onClick={handleReset}
            className="text-accent hover:text-accent-hover transition-colors underline underline-offset-4"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* ── Filtered Animated Cards Grid ── */}
      <div id="projects-grid" role="region" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {projectGroups.length > 0 ? (
            <div className="space-y-12">
              {projectGroups.map((group) => (
                <section
                  key={group.id}
                  aria-labelledby={group.id}
                  className="space-y-6"
                >
                  <h2
                    id={group.id}
                    className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight"
                  >
                    {group.heading}
                  </h2>
                  <m.div
                    layout={!shouldReduceMotion}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {group.items.map((project, idx) => (
                      <m.div
                        key={project.id}
                        data-reveal=""
                        layout={!shouldReduceMotion}
                        className="h-full"
                        initial={
                          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={
                          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }
                        }
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.28,
                                ease: [0.16, 1, 0.3, 1],
                                layout: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
                              }
                        }
                      >
                        <ProjectCard
                          project={project}
                          priority={group.id === 'group-main-projects' && idx === 0}
                        />
                      </m.div>
                    ))}
                  </m.div>
                </section>
              ))}
            </div>
          ) : (
            <m.div
              key="empty-state"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-bg-secondary border border-dashed border-border-default p-12 text-center max-w-lg mx-auto space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent font-mono text-sm">
                ∅
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  No Matching Architecture Found
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  No system in Mohammed&apos;s portfolio matches the search &quot;
                  {searchQuery}&quot; under the selected filter.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-btn text-btn-fg text-xs font-medium hover:bg-accent-hover transition-colors shadow-xs"
              >
                Reset All Filters
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
