import React from "react";

interface InputComponentProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  type?: "text" | "password" | "email" | "number";
  icon?: JSX.Element;
  className?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  onChange,
  placeholder,
  value,
  type = "text",
  icon,
  className,
}) => {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          icon ? "" : "pl-4"
        } ${className ?? ""}`}
      />
    </div>
  );
};

export default InputComponent;
