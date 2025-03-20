// app/projects/page.tsx
"use client";
import React, { useState } from "react";
import { Project } from "@models/project";
import ButtonComponent from "@components/button.component";
import {
  EyeSlashIcon,
  ChevronUpDownIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import IssueCard from "./issueCard";
import ProjectDashboard from "./projectDashboard";
import UploadModal from "./upload";
import { useGetProject } from "@services/project";

const ProjectPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { projectId: id } = useParams();

  const { data: state, loading, mutate } = useGetProject(id as string);

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <ProjectDashboard
          project={state?.project as Project}
          loading={loading}
        />
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
          <>
            <div className="py-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="w-full py-12 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-300 mt-2 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-4">
            {state?.project?.issues?.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}

        <UploadModal
          isOpen={isCreateModalOpen}
          info={state?.project}
          onClose={() => {
            setIsCreateModalOpen(false);
            mutate();
          }}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
