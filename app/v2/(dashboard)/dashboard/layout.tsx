"use client";

import { Header } from "@/components_v2/layout/header";
import { Sidebar } from "@/components_v2/layout/sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
