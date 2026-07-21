import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl bg-brand-pink px-4 py-3 font-semibold text-white transition active:scale-95 ${className}`}
      {...props}
    />
  );
}
