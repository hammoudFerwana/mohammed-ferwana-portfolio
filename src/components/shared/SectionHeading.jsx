import { cn } from '@/lib/utils';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left', // 'left' | 'center'
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div className={cn('mb-12 md:mb-16', isCenter && 'text-center', className)}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold px-2.5 py-1 rounded bg-accent/10 border border-accent/20">
            {eyebrow}
          </span>
        </div>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary text-balance">
          {title}
        </h2>
      )}
      {description && (
        <p
          className={cn(
            'mt-3 text-base md:text-lg text-text-secondary leading-relaxed max-w-[65ch]',
            isCenter && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
