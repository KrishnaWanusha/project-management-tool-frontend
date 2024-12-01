type ButtonComponentProps = {
  title: string;
  className?: string;
  spinner?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function ButtonComponent({
  title,
  className,
  spinner,
  disabled,
  onClick,
}: ButtonComponentProps) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled || spinner}
        className={`rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
            hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-indigo-600 ${className ?? ""} `}
      >
        {title}
      </button>
    </>
  );
}
