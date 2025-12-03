import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  min?: number;
  step?: number;
  icon?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  options,
  placeholder,
  min,
  step,
  icon
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        
        {options ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`block w-full rounded-md border-gray-300 py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border bg-white ${icon ? 'pl-10' : ''}`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className={`block w-full rounded-md border-gray-300 py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border ${icon ? 'pl-10' : ''}`}
            placeholder={placeholder}
            min={min}
            step={step}
          />
        )}
      </div>
    </div>
  );
};