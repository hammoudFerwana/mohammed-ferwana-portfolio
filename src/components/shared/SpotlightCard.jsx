import { cn } from '@/lib/utils';

/**
 * SpotlightCard — Plain card container (spotlight and tilt removed in Horizon V2).
 */
export default function SpotlightCard({
  as: Component = 'div',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'rounded-[14px] bg-surface border border-line transition-colors duration-200 hover:border-violet focus-within:border-violet',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
