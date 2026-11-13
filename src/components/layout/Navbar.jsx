'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';
import { cn } from '@/lib/utils';
import MobileMenu from './MobileMenu';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
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
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pt-4 sm:pt-6 pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-2 sm:gap-6 lg:gap-8 rounded-full px-3 sm:px-6 py-2.5 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] w-full max-w-5xl',
            isScrolled
              ? 'bg-bg-primary/75 backdrop-blur-xl border border-border-strong shadow-lg'
              : 'bg-bg-primary/60 backdrop-blur-lg border border-border-default shadow-md'
          )}
        >
          {/* Logo / Brand */}
          <Link
            href="/"
            className="group min-w-0 flex items-center gap-2 sm:gap-2.5 focus-visible:ring-2 focus-visible:ring-accent rounded-full px-1 py-0.5"
          >
            <div aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-bg-secondary border border-border-default flex items-center justify-center font-mono font-bold text-accent text-xs sm:text-sm group-hover:border-accent/50 group-hover:shadow-accent transition-all duration-200">
              MF
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors whitespace-nowrap">
                Mohammed Ferwana<span className="sr-only"> — Home</span>
              </span>
              <span className="text-[10px] font-mono text-text-muted hidden sm:block">
                Backend Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-bg-secondary/60 backdrop-blur-xs border border-border-subtle px-3 py-1.5 rounded-full shadow-inner">
            {allNavLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'text-text-primary bg-bg-tertiary shadow-xs'
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

          {/* Right Actions: Resume Dossier, Command Palette & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Resume Trigger - Direct 1-Click Download */}
            <a
              href="/resume/Mohammed_Ferwana_Resume.pdf"
              download="Mohammed_Ferwana_Resume.pdf"
              aria-label="CV — Download Resume (PDF)"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 border border-accent/25 hover:border-accent/40 text-accent text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>CV</span>
            </a>


            {/* Theme Toggle (Desktop) */}
            <ThemeToggle className="hidden lg:inline-flex" />

            {/* Mobile Menu Button with morphing animation */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden relative w-8 h-8 rounded-full bg-bg-secondary border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center"
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
