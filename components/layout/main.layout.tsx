// components/layout/MainLayout.tsx
import React, { ReactNode } from "react";
import SideNav from "./sideNav";
import Header from "./header";

interface MainLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showBackButton,
  backButtonText,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="ml-64">
        <Header
          showBackButton={showBackButton}
          backButtonText={backButtonText}
          onBack={onBack}
        />
        <main className="p-2">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
