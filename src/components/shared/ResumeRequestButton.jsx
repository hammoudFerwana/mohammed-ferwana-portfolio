'use client';

import Button from '@/components/shared/Button';

export default function ResumeRequestButton({
  variant = 'secondary',
  size = 'md',
  magnetic = false,
  className = '',
  children = 'Download Resume',
}) {
  return (
    <Button
      href="/resume/Mohammed_Ferwana_Resume.pdf"
      download="Mohammed_Ferwana_Resume.pdf"
      variant={variant}
      size={size}
      magnetic={magnetic}
      className={className}
    >
      {children}
    </Button>
  );
}
