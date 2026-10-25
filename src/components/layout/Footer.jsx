'use client';

import Link from 'next/link';
import { navigation } from '@/data/navigation';
import { siteMetadata } from '@/data/siteMetadata';

export default function Footer() {
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
              {siteMetadata.tagline} I build REST APIs with guarded state machines and tenant isolation.
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

          {/* Connect & Direct Channels */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Connect
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
              <li>
                <a
                  href="/resume/Mohammed_Ferwana_Resume.pdf"
                  download="Mohammed_Ferwana_Resume.pdf"
                  className="text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  Download Résumé (PDF)
                  <span className="text-xs text-text-muted">↓</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {siteMetadata.name}.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
