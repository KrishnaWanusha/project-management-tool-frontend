type ButtonComponentProps = {
  title: string;
  type?: "primary" | "secondary";
  className?: string;
  spinner?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: JSX.Element;
};

export default function ButtonComponent({
  title,
  type = "primary",
  className,
  spinner,
  disabled,
  onClick,
  icon,
}: ButtonComponentProps) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled || spinner}
        className={`rounded-md px-3.5 py-1.5 text-sm font-semibold shadow-sm 
      ${
        type === "primary"
          ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          : "bg-white text-black border-2 border-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      }
      ${className ?? ""}`}
      >
        <div className="flex items-center justify-center space-x-2">
          {icon && <span className="inline-block w-4">{icon}</span>}
          <span>{title}</span>
        </div>
      </button>
    </>
  );
}
