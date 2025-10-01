import React, { useState } from 'react';

// Reusable UI components
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-gray-600 dark:text-neutral-400">{label}</div>
      {children}
    </label>
  );
}

export function NumberInput({
  value,
  setValue,
  step = 1,
  min,
  disabled,
  dark
}: {
  value: number;
  setValue: (n: number) => void;
  step?: number;
  min?: number;
  disabled?: boolean;
  dark?: boolean;
}) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Allow empty string temporarily
    if (val === '' || val === '-') {
      return;
    }

    const numVal = Number(val);
    if (!isNaN(numVal)) {
      setValue(numVal);
    }
  };

  const handleBlur = () => {
    // On blur, ensure we have a valid number
    const numVal = Number(inputValue);
    if (isNaN(numVal) || inputValue === '' || inputValue === '-') {
      const defaultVal = min !== undefined ? min : 0;
      setValue(defaultVal);
      setInputValue(defaultVal.toString());
    } else {
      // Update to match the actual value (in case of formatting differences)
      setInputValue(value.toString());
    }
  };

  // Sync with external value changes
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <input
      type="number"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      step={step}
      min={min}
      disabled={disabled}
      className={`w-full px-3 py-2 rounded-xl border ${dark ? "bg-neutral-900 border-neutral-700 text-neutral-100" : "bg-white border-gray-200"} disabled:opacity-60`}
    />
  );
}

export function SummaryCard({ title, value, dark }: { title: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 shadow flex flex-col gap-1 border ${dark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}`}>
      <div className={`text-sm ${dark ? "text-neutral-400" : "text-gray-600"}`}>{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
