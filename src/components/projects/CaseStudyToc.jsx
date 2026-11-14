'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CaseStudyToc({ items = [], detailsId = 'sawn-tech-details' }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    let ticking = false;

    const updateActiveSection = () => {
      const details = document.getElementById(detailsId);
      const isDetailsOpen = details ? details.open : false;

      // Sections inside the closed <details> are ignored while it is closed
      const candidateItems = items.filter((item) => {
        if (item.inDetails && !isDetailsOpen) return false;
        return true;
      });

      if (candidateItems.length === 0) return;

      const headerOffset = 112;

      // At page top: "Overview" (candidateItems[0])
      const firstEl = document.getElementById(candidateItems[0].id);
      if (firstEl) {
        const firstRect = firstEl.getBoundingClientRect();
        if (firstRect.top > headerOffset) {
          setActiveId(candidateItems[0].id);
          return;
        }
      } else if (window.scrollY < 200) {
        setActiveId(candidateItems[0].id);
        return;
      }

      // If scrolled to bottom of the page, activate the last candidate item
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveId(candidateItems[candidateItems.length - 1].id);
        return;
      }

      // Check if a section currently spans the reading area (headerOffset)
      let activeCandidate = null;
      for (const item of candidateItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 && rect.width === 0) continue;

        if (rect.top <= headerOffset + 50 && rect.bottom > headerOffset) {
          activeCandidate = item;
          break;
        }
      }

      if (activeCandidate) {
        setActiveId(activeCandidate.id);
        return;
      }

      // Otherwise pick the candidate section nearest the top of the viewport
      let nearestItem = candidateItems[0];
      let minDistance = Infinity;

      for (const item of candidateItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 && rect.width === 0) continue;

        const distance = Math.abs(rect.top - headerOffset);
        if (distance < minDistance) {
          minDistance = distance;
          nearestItem = item;
        }
      }

      if (nearestItem) {
        setActiveId(nearestItem.id);
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run on initial mount
    updateActiveSection();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const details = document.getElementById(detailsId);
    if (details) {
      details.addEventListener('toggle', onScrollOrResize);
    }

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (details) {
        details.removeEventListener('toggle', onScrollOrResize);
      }
    };
  }, [items, detailsId]);

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
