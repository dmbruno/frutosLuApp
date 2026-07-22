import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base focus:border-brand-pink focus:outline-none ${className}`}
      {...props}
    />
  );
}
