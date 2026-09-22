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
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-bg-primary/85 backdrop-blur-md border-b border-border-subtle shadow-sm py-3.5'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
            aria-label="Mohammed Ferwana Home"
          >
            <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center font-mono font-bold text-accent text-sm group-hover:border-accent/50 group-hover:shadow-accent transition-all duration-200">
              MF
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                Mohammed Ferwana
              </span>
              <span className="text-[11px] font-mono text-text-muted">
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
          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent"
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

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 rounded-lg bg-bg-secondary border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
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
