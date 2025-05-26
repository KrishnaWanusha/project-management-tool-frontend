import React from "react";

interface TextAreaComponentProps {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  value?: string;
  rows?: number;
  className?: string;
}

export default function TextAreaComponent({
  onChange,
  placeholder,
  value,
  rows = 3,
  className,
}: TextAreaComponentProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
        className={`pl-4 pr-4 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          className ?? ""
        }`}
      />
    </div>
  );
}
