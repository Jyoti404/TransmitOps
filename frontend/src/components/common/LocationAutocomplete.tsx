import { useState } from 'react';
import { Input } from '../../atoms/Input';
import { useLocationSearch } from '../../hooks/useLocationSearch';

interface LocationAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function LocationAutocomplete({ id, value, onChange, placeholder, required }: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: suggestions = [], isFetching } = useLocationSearch(value);

  return (
    <div className="relative">
      <Input
        id={id}
        required={required}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        // Delay so a click on a suggestion (which also blurs the input) has
        // time to register before the dropdown unmounts.
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      />

      {isOpen && value.trim().length >= 3 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
          {isFetching ? (
            <p className="px-3 py-2 text-xs text-slate-400">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-3 py-2 text-xs text-slate-400">No matches.</p>
          ) : (
            <>
              <ul className="max-h-56 overflow-y-auto py-1">
                {suggestions.map((s) => (
                  <li key={`${s.lat},${s.lon}`}>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        onChange(s.label);
                        setIsOpen(false);
                      }}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-slate-100 px-3 py-1 text-[10px] text-slate-300">
                Powered by OpenStreetMap contributors
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
