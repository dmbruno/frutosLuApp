import type { HTMLAttributes } from 'react';

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent';
}

const VARIANT_CLASSES: Record<NonNullable<PillProps['variant']>, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  accent: 'bg-brand-pink text-white',
};

export function Pill({ variant = 'neutral', className = '', ...props }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
