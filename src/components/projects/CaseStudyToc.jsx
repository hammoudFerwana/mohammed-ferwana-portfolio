'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CaseStudyToc({ items = [], detailsId = 'sawn-tech-details' }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible sections
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top distance to pick the one closest to header (112px)
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top - 112) - Math.abs(b.boundingClientRect.top - 112)
          );
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-100px 0px -40% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleLinkClick = (e, item) => {
    e.preventDefault();

    if (item.inDetails) {
      const details = document.getElementById(detailsId);
      if (details && !details.open) {
        details.open = true;
      }
    }

    setActiveId(item.id);

    // Give browser a microtask to expand details before scrolling
    requestAnimationFrame(() => {
      const target = document.getElementById(item.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `#${item.id}`);
      }
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="hidden xl:block sticky top-[112px] self-start w-[200px] shrink-0 font-mono text-xs"
    >
      <div className="space-y-3 p-4 rounded-xl border border-border-subtle bg-bg-secondary/40 backdrop-blur-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block">
          Contents
        </span>
        <ul className="space-y-1.5" role="list">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item)}
                  className={cn(
                    'block py-1 pl-2.5 -ml-px border-l-2 text-left transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-r',
                    isActive
                      ? 'border-accent text-accent font-semibold bg-accent/5'
                      : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-default'
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
