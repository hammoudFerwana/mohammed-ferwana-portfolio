'use client';

import Link from 'next/link';
import { navigation } from '@/data/navigation';
import { siteMetadata } from '@/data/siteMetadata';
import { useOverlay } from '@/context/OverlayContext';

export default function Footer() {
  const { openTerminal } = useOverlay();
  const allNavLinks = [...navigation.main, ...navigation.secondary];

  return (
    <footer className="bg-bg-secondary/60 border-t border-border-subtle mt-24 md:mt-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-bg-primary border border-border-default flex items-center justify-center font-mono font-bold text-accent text-sm">
                MF
              </div>
              <span className="text-base font-bold text-text-primary tracking-tight">
                {siteMetadata.name}
              </span>
            </div>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              {siteMetadata.tagline}. Specializing in robust API design, modular architecture, and resilient server-side systems.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-functional-success/10 border border-functional-success/20 text-functional-success text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-functional-success animate-pulse" />
              Available for Backend Engineering Opportunities
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {allNavLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary hover:translate-x-0.5 transition-all inline-block duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & System Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Connect & Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={siteMetadata.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  GitHub
                  <span className="text-xs text-text-muted">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={siteMetadata.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  LinkedIn
                  <span className="text-xs text-text-muted">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  {siteMetadata.email}
                </a>
              </li>
            </ul>

            {/* Terminal Easter Egg Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={openTerminal}
                className="group inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors"
                title="Launch Mini Terminal (Easter Egg)"
              >
                <span className="p-1 rounded bg-bg-tertiary border border-border-default group-hover:border-accent/40">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>$ terminal.sh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {siteMetadata.name}. Built with intention.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Zero Slop</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
