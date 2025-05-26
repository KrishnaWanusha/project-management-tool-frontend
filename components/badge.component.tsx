import React from "react";

interface BadgeComponentProps {
  title: string;
  className?: string;
}

const BadgeComponent: React.FC<BadgeComponentProps> = ({
  title,
  className,
}) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold text-black rounded-md ${className}`}
    >
      {title}
    </span>
  );
};

export default BadgeComponent;
