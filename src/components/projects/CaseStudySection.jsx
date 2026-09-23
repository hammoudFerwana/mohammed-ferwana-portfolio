'use client';

import RevealOnScroll from '@/components/shared/RevealOnScroll';
import { cn } from '@/lib/utils';

/**
 * CaseStudySection — Numbered section wrapper for the 9-part case study template.
 *
 * Renders a numbered section (e.g., "01 — THE PROBLEM") with consistent styling,
 * scroll-reveal entrance animation, and a subtle top border separator.
 *
 * @param {string} number — Two-digit section number (e.g., "01")
 * @param {string} title  — Section heading (e.g., "THE PROBLEM")
 * @param {React.ReactNode} children — Section content
 * @param {string} [className] — Additional CSS classes
 */
export default function CaseStudySection({
  number,
  title,
  children,
  className = '',
}) {
  return (
    <RevealOnScroll>
      <section
        className={cn(
          'pt-12 md:pt-16 first:pt-0 first:border-none border-t border-border-subtle',
          className
        )}
        aria-labelledby={`section-${number}`}
      >
        {/* Section Number & Title */}
        <div className="mb-6 md:mb-8">
          <span className="font-mono text-3xl md:text-4xl font-bold text-accent/30 select-none block leading-none">
            {number}
          </span>
          <h2
            id={`section-${number}`}
            className="font-mono text-sm uppercase tracking-[0.2em] text-text-secondary font-semibold mt-2"
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
