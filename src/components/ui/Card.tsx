import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  return <div className={`rounded-2xl border border-neutral-200 bg-white p-4 ${className}`} {...props} />;
}
