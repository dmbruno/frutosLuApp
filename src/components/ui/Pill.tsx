import type { HTMLAttributes } from 'react';

type PillProps = HTMLAttributes<HTMLSpanElement>;

export function Pill({ className = '', ...props }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-medium text-brand-amber ${className}`}
      {...props}
    />
  );
}
