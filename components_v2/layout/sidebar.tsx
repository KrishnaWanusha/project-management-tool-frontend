"use client";

import { DASHBOARD_SECTIONS } from "@/types/github";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  CheckSquare,
  AlertTriangle,
  BookOpenCheck,
  X,
} from "lucide-react";
import { Button } from "@/components_v2/ui/button";

const sectionIcons = {
  "document-generation": <FileText className="mr-2 h-4 w-4" />,
  "task-creation": <CheckSquare className="mr-2 h-4 w-4" />,
  "risk-assessment": <AlertTriangle className="mr-2 h-4 w-4" />,
  "skill-assessment": <BookOpenCheck className="mr-2 h-4 w-4" />,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const params = useParams<{
    repoName: string;
    owner: string;
    section: string;
  }>();
  const currentRepo = params.repoName;
  const currentSection = params.section;
  const repoOwner = params.owner;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-50 w-64 border-r border-border bg-background p-4 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {currentRepo
              ? decodeURIComponent(currentRepo)
              : "Select Repository"}
          </p>

          {DASHBOARD_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={
                currentRepo
                  ? `/v2/dashboard/${currentRepo}/${repoOwner}/${section.id}`
                  : "#"
              }
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                currentSection === section.id
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground"
              )}
              onClick={(e) => {
                if (!currentRepo) e.preventDefault();
                if (isOpen) onClose();
              }}
            >
              {sectionIcons[section.id]}
              {section.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
