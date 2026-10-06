'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';
import { useOverlay } from '@/context/OverlayContext';
import { cn } from '@/lib/utils';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const { openCommandPalette } = useOverlay();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allNavLinks = [...navigation.main, ...navigation.secondary];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 md:gap-8 rounded-full px-4 sm:px-6 py-2.5 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] w-full max-w-5xl',
            isScrolled
              ? 'bg-bg-primary/75 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'bg-bg-primary/60 backdrop-blur-lg border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
          )}
        >
          {/* Logo / Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-accent rounded-full px-1 py-0.5"
            aria-label="Mohammed Ferwana Home"
          >
            <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border-default flex items-center justify-center font-mono font-bold text-accent text-sm group-hover:border-accent/50 group-hover:shadow-accent transition-all duration-200">
              MF
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                Mohammed Ferwana
              </span>
              <span className="text-[10px] font-mono text-text-muted hidden sm:block">
                Backend Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-bg-secondary/60 backdrop-blur-sm border border-border-subtle px-3 py-1.5 rounded-full shadow-inner">
            {allNavLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'text-text-primary bg-bg-tertiary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Command Palette & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-bg-secondary hover:bg-bg-tertiary border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg
                className="w-3.5 h-3.5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline font-mono text-[11px] text-text-muted">
                Search
              </span>
              <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] bg-bg-primary/80 border border-border-default px-1.5 py-0.5 rounded text-text-muted">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Button with morphing animation */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden relative w-8 h-8 rounded-full bg-bg-secondary border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center"
            >
              <span
                className={cn(
                  'absolute w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                  isMobileMenuOpen
                    ? 'top-1/2 -translate-y-1/2 rotate-45'
                    : 'top-[38%]'
                )}
              />
              <span
                className={cn(
                  'absolute w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                  isMobileMenuOpen
                    ? 'top-1/2 -translate-y-1/2 -rotate-45'
                    : 'top-[60%]'
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={allNavLinks}
        currentPath={pathname}
      />
    </>
  );
}
