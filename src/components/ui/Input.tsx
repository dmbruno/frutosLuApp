import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base focus:border-neutral-900 focus:outline-none ${className}`}
      {...props}
    />
  );
}
