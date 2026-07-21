interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`h-7 w-12 rounded-full transition ${checked ? 'bg-brand-pink' : 'bg-neutral-300'}`}
      >
        <span
          className={`block h-5 w-5 translate-x-1 rounded-full bg-white transition ${checked ? 'translate-x-6' : ''}`}
        />
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
