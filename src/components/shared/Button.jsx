import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none';

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

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
