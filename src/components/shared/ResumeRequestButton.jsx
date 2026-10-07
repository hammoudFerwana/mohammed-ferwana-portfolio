'use client';

import Button from '@/components/shared/Button';
import { useOverlay } from '@/context/OverlayContext';

export default function ResumeRequestButton({
  variant = 'secondary',
  size = 'md',
  magnetic = false,
  className = '',
  children = 'Request Resume',
}) {
  const { openResumeModal } = useOverlay();

  return (
    <Button
      onClick={openResumeModal}
      variant={variant}
      size={size}
      magnetic={magnetic}
      className={className}
    >
      {children}
    </Button>
  );
}
