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
import { AnimatePresence } from "framer-motion";
import FileUploadModal from "../ui/file-upload";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

export function TaskCreation({
  repoName,
  owner,
}: {
  repoName: string;
  owner: string;
}) {
  const { data: session } = useSession();
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []);

  const filteredIssues = useMemo(() => {
    if (priorityFilter === "All") return issues;
    return issues.filter(
      (issue) =>
        getPriorityFromLabels((issue as Issue)?.labels) === priorityFilter
    );
  }, [issues, priorityFilter]);

  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssues.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIssues, currentPage]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  const highCount = issues.filter(
    (issue) => getPriorityFromLabels((issue as Issue).labels) === "High"
  ).length;
  const mediumCount = issues.filter(
    (issue) => getPriorityFromLabels((issue as Issue).labels) === "Medium"
  ).length;
  const lowCount = issues.filter(
    (issue) => getPriorityFromLabels((issue as Issue).labels) === "Low"
  ).length;
  const openCount = issues.filter(
    (issue) => (issue as Issue).state === "open"
  ).length;
  const closedCount = issues.filter(
    (issue) => (issue as Issue).state === "closed"
  ).length;

  const stats = [
    {
      title: "High Priority",
      value: highCount,
      icon: AlertCircle,
      color: "red",
    },
    {
      title: "Medium Priority",
      value: mediumCount,
      icon: AlertTriangle,
      color: "amber",
    },
    {
      title: "Low Priority",
      value: lowCount,
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Open",
      value: openCount,
      icon: Clock,
      color: "blue",
    },
    {
      title: "Closed",
      value: closedCount,
      icon: XCircle,
      color: "gray",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
            relative overflow-hidden rounded-lg bg-card p-4
            transition-all duration-300 hover:shadow-lg
            border-1.2 border-l-4 border-${stat.color}-500
          `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`
              rounded-full p-2
              text-${stat.color}-500
            `}
              >
                <stat.icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <p
                  className={`
                text-sm font-medium 
                text-${stat.color}-500
              `}
                >
                  {stat.title}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>

            <div
              className={`
            absolute right-0 top-0 -z-10
            h-full w-1/3 bg-gradient-to-r from-transparent
            to-${stat.color}-50
          `}
            />
          </div>
        ))}
      </div>
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
        <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload new file
        </Button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <FileUploadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUpload={() => {
              // Handle successful upload
              console.log("File uploaded successfully");
            }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
            ))
          : paginatedIssues.map((issue) => {
              return <IssueCard key={(issue as any)?.id} issue={issue} />;
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
