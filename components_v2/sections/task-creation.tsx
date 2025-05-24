"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components_v2/ui/button";
import { UploadIcon } from "lucide-react";
import { getRepositoryIssues } from "@/lib/github";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components_v2/ui/skeleton";
import { cn } from "@/lib/utils";
import { Issue, Priority } from "@/types/github";
import IssueCard, { getPriorityFromLabels } from "../issue-card";

const ITEMS_PER_PAGE = 5;

export function TaskCreation({
  repoName,
  owner,
}: {
  repoName: string;
  owner: string;
}) {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<Priority>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchIssues = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const data = await getRepositoryIssues(
        session.accessToken,
        owner,
        repoName
      );
      setIssues(data);
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, owner, repoName]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const filteredIssues = useMemo(() => {
    if (priorityFilter === "All") return issues;
    return issues.filter(
      (issue) => getPriorityFromLabels(issue.labels) === priorityFilter
    );
  }, [issues, priorityFilter]);

  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssues.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIssues, currentPage]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          {(["All", "High", "Medium", "Low"] as Priority[]).map((p) => (
            <Button
              key={p}
              variant={priorityFilter === p ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setPriorityFilter(p);
                setCurrentPage(1);
              }}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button variant="gradient">
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload new file
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
            ))
          : paginatedIssues.map((issue) => {
              return <IssueCard key={issue.id} issue={issue} />;
            })}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Button
              key={idx}
              variant={currentPage === idx + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(idx + 1)}
              className={cn(
                "w-8 h-8 p-0",
                currentPage === idx + 1 && "font-bold"
              )}
            >
              {idx + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default TaskCreation;
