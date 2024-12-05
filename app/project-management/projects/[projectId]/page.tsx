// app/projects/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Project } from "@models/project";
import ButtonComponent from "@components/button.component";
import {
  EyeSlashIcon,
  ChevronUpDownIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { get } from "@services/project";
import CreateProjectModal from "../createProject";
import { useParams } from "next/navigation";
import IssueCard from "./issueCard";
import ProjectDashboard from "./projectDashboard";

const ProjectPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [state, setState] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(true);

  const { projectId: id } = useParams();

  useEffect(() => {
    const loadProject = async (id: string) => {
      try {
        const data = await get(id);
        setState(data?.data?.project);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProject(id as string);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <ProjectDashboard project={state as Project} />
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <ButtonComponent
              title="Filter"
              type="secondary"
              icon={<AdjustmentsHorizontalIcon />}
            />
            <ButtonComponent
              title="Sort"
              type="secondary"
              icon={<ChevronUpDownIcon />}
            />
            <ButtonComponent
              title="Hide"
              type="secondary"
              icon={<EyeSlashIcon />}
            />
          </div>
          <div className="flex space-x-2">
            <ButtonComponent
              title="Upload SRS"
              icon={<DocumentArrowUpIcon />}
              onClick={() => setIsCreateModalOpen(true)}
            />
            <ButtonComponent
              title="New Issue"
              type="secondary"
              icon={<PlusIcon />}
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-600" />
          </div>
        ) : (
          <div className="py-4">
            {state?.issues?.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
