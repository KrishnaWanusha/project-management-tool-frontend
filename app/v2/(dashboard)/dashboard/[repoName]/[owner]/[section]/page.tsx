"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DocumentGeneration } from "@/components_v2/sections/document-generation";
import { TaskCreation } from "@/components_v2/sections/task-creation";
import { RiskAssessment } from "@/components_v2/sections/risk-assessment";
import { SkillAssessment } from "@/components_v2/sections/skill-assessment";
import { DashboardSection } from "@/types/github";
import { useIssues } from "../dashboard.context";

function DashboardPage({
  params,
}: {
  params: { repoName: string; owner: string; section: string };
}) {
  const { status } = useSession();
  const router = useRouter();
  const { owner, section } = params;
  const { issues, isLoading, fetchIssues } = useIssues();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/v2/login");
    }
  }, [status, router]);

  const renderSection = (section: string) => {
    switch (section as DashboardSection) {
      case "document-generation":
        return <DocumentGeneration />;
      case "task-creation":
        return <TaskCreation issues={issues} isLoading={isLoading} />;
      case "risk-assessment":
        return (
          <RiskAssessment
            issues={issues}
            isLoading={isLoading}
            fetchIssues={fetchIssues}
          />
        );
      case "skill-assessment":
        return <SkillAssessment owner={owner} repoName={params.repoName} />;
      default:
        return <DocumentGeneration />;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-6 mx-auto">
      {renderSection(section)}
    </div>
  );
}

export default DashboardPage;
