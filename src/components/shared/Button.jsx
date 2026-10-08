'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/shared/Magnetic';
import { soundFx } from '@/lib/soundFx';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  href,
  onClick,
  className = '',
  external = false,
  type = 'button',
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  magnetic = false,
  magneticStrength = 0.28,
  ...props
}) {
  const baseStyles = 'group inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-accent/25 hover:shadow-lg',
    secondary: 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-border-default hover:border-border-strong',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60',
    outline: 'border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  let formattedChildren = children;
  let trailingArrow = null;

  if (typeof children === 'string' && (children.includes('→') || children.includes('↗'))) {
    const isExternalArrow = children.includes('↗');
    const arrowSymbol = isExternalArrow ? '↗' : '→';
    formattedChildren = children.replace(/[→↗]/g, '').trim();
    trailingArrow = (
      <span className="ml-1.5 w-5 h-5 rounded-full bg-white/20 inline-flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0">
        {arrowSymbol}
      </span>
    );
  }

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{formattedChildren}</span>
      {trailingArrow}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  const handleMouseEnter = () => {
    soundFx.playHover();
  };

  const handleClick = (e) => {
    soundFx.playClick();
    onClick?.(e);
  };

  let element = null;

  if (href) {
    if (external) {
      element = (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          data-cursor-target
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          {...props}
        >
          {content}
        </a>
      );
    } else {
      element = (
        <Link
          href={href}
          className={classes}
          data-cursor-target
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          {...props}
        >
          {content}
        </Link>
      );
    }
  } else {
    element = (
      <button
        type={type}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={disabled}
        className={classes}
        data-cursor-target
        {...props}
      >
        {content}
      </button>
    );
  }

  if (magnetic) {
    return (
      <Magnetic strength={magneticStrength} className="inline-block">
        {element}
      </Magnetic>
    );
  }

  return element;
}
