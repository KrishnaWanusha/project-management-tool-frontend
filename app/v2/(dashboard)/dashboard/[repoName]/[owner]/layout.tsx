"use client";

import { useParams } from "next/navigation";
import { IssuesProvider } from "./dashboard.context";

export default function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const owner = params.owner as string;
  const repoName = params.repoName as string;

  return (
    <IssuesProvider owner={owner} repoName={repoName}>
      {children}
    </IssuesProvider>
  );
}
