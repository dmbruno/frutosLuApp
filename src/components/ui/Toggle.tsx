interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  variant?: 'pink' | 'green';
}

const CHECKED_CLASSES: Record<NonNullable<ToggleProps['variant']>, string> = {
  pink: 'bg-brand-pink',
  green: 'bg-green-500',
};

export function Toggle({ checked, onChange, label, variant = 'pink' }: ToggleProps) {
  return (
    <label className="flex items-center gap-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`h-6 w-10 shrink-0 cursor-pointer rounded-full transition hover:opacity-80 ${checked ? CHECKED_CLASSES[variant] : 'bg-neutral-300'}`}
      >
        <span
          className={`block h-4 w-4 translate-x-1 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
      {label && <span className="whitespace-nowrap text-xs text-neutral-600">{label}</span>}
    </label>
  );
}
