// components/layout/Header.tsx
import React from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import InputComponent from "@components/input.component";

interface HeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton,
  backButtonText,
  onBack,
}) => {
  return (
    <header className="py-2 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {backButtonText || "Back"}
          </button>
        )}
        <div className="relative">
          <InputComponent
            placeholder="Search..."
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 " />}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900">
          <BellIcon className="w-6 h-6" />
        </button>
        <button className="flex items-center text-gray-600 hover:text-gray-900">
          <span className="mr-2">Team</span>
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <UserCircleIcon className="w-8 h-8" />
        </button>
      </div>
    </header>
  );
};

export default Header;
