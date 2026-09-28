import { useState, type KeyboardEvent } from 'react';

interface CheckboxGroupWithOtherProps {
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}

// Grilla de checkboxes (mismo estilo que "Músculos secundarios") + un checkbox
// "Otro" que despliega un input para sumar valores libres, uno por uno, como
// chips removibles. Pensado para reusar en cualquier campo de selección
// múltiple que necesite una salida para lo que no está en la lista precargada.
export function CheckboxGroupWithOther({ options, value, onChange }: CheckboxGroupWithOtherProps) {
  const [customInput, setCustomInput] = useState('');
  const [addingCustom, setAddingCustom] = useState(false);

  const customItems = value.filter((v) => !options.includes(v));

  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  function addCustom() {
    const trimmed = customInput.trim();
    if (!trimmed || value.includes(trimmed)) {
      setCustomInput('');
      return;
    }
    onChange([...value, trimmed]);
    setCustomInput('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  }

  function removeCustom(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-neutral-300 p-3 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 cursor-pointer accent-brand-pink"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            className="h-4 w-4 shrink-0 cursor-pointer accent-brand-pink"
            checked={addingCustom}
            onChange={() => setAddingCustom((o) => !o)}
          />
          Otro
        </label>
      </div>

      {addingCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: soga, conos..."
            className="min-w-0 flex-1 rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={addCustom}
            className="shrink-0 cursor-pointer rounded-full bg-neutral-900 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Agregar
          </button>
        </div>
      )}

      {customItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
            >
              {item}
              <button
                type="button"
                onClick={() => removeCustom(item)}
                aria-label={`Quitar ${item}`}
                className="cursor-pointer text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
