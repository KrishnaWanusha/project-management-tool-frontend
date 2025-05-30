import React from "react";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectComponentProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SelectComponent({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: SelectComponentProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white ${
          className ?? ""
        }`}
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>\')',
          backgroundPosition: "right 1rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1rem",
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
