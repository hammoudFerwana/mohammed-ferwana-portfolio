import { cn } from '@/lib/utils';

export default function Badge({
  children,
  variant = 'accent', // 'accent' | 'neutral' | 'success' | 'warning' | 'outline'
  size = 'md', // 'sm' | 'md'
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-full select-none';

  const variants = {
    accent: 'bg-accent/10 border border-accent/25 text-accent',
    neutral: 'bg-bg-tertiary border border-border-default text-text-secondary',
    success: 'bg-functional-success/10 border border-functional-success/25 text-functional-success',
    warning: 'bg-functional-warning/10 border border-functional-warning/25 text-functional-warning',
    outline: 'border border-border-strong text-text-secondary hover:text-text-primary',
  };

  const sizes = {
    sm: 'text-[10px] uppercase tracking-wider px-2 py-0.5 gap-1',
    md: 'text-xs uppercase tracking-wide px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
