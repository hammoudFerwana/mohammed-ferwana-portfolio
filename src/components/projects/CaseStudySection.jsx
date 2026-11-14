'use client';

import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

/**
 * CaseStudySection — Section wrapper for case study templates.
 *
 * Renders a section with consistent styling, scroll-reveal entrance animation,
 * and a subtle top border separator.
 *
 * @param {string} [id]    — Optional section id for TOC navigation
 * @param {string} title   — Section heading
 * @param {React.ReactNode} children — Section content
 * @param {string} [className] — Additional CSS classes
 */
export default function CaseStudySection({
  id,
  title,
  children,
  className = '',
}) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <RevealOnScroll>
      <section
        id={id}
        className={cn(
          'pt-16 lg:pt-24 border-t border-border-subtle scroll-mt-28',
          className
        )}
        {...(headingId ? { 'aria-labelledby': headingId } : {})}
      >
        {/* Section Title */}
        <div className="mb-6 md:mb-8">
          <h2
            id={headingId}
            className="font-mono text-sm uppercase tracking-[0.2em] text-text-secondary font-semibold"
          >
            {title}
          </h2>
        </div>

        {/* Section Content */}
        <div className="space-y-6">{children}</div>
      </section>
    </RevealOnScroll>
  );
}
