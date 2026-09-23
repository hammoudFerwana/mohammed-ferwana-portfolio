'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { siteMetadata } from '@/data/siteMetadata';
import { cn } from '@/lib/utils';

export default function MobileMenu({ isOpen, onClose, links, currentPath }) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden bg-bg-primary/95 backdrop-blur-xl flex flex-col justify-between p-6 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center font-mono font-bold text-accent text-sm">
            MF
          </div>
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            Mohammed Ferwana
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 rounded-lg bg-bg-secondary border border-border-default text-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 my-auto py-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-2">
          Navigation
        </span>
        {links.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center justify-between py-3 px-4 rounded-xl text-lg font-medium transition-all duration-150',
                isActive
                  ? 'bg-bg-secondary text-text-primary border border-accent/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60'
              )}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Details & Social Links */}
      <div className="pt-6 border-t border-border-subtle flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Backend Engineer</span>
          <span className="font-mono">Palestine</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={siteMetadata.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 text-center text-xs font-medium rounded-lg bg-bg-secondary border border-border-default text-text-secondary hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteMetadata.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 text-center text-xs font-medium rounded-lg bg-bg-secondary border border-border-default text-text-secondary hover:text-text-primary transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${siteMetadata.email}`}
            className="flex-1 py-2 text-center text-xs font-medium rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
