/* eslint-disable @typescript-eslint/no-explicit-any */
// app/projects/page.tsx
"use client";
import React, { useState } from "react";
import ProjectCard from "./projectCard";
import ButtonComponent from "@components/button.component";
import {
  EyeSlashIcon,
  ChevronUpDownIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useGetProjects } from "@services/project";
import CreateProjectModal from "./createProject";
import moment from "moment";

const ProjectsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: state, loading, mutate } = useGetProjects();

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
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
          <ButtonComponent
            title="New Project"
            icon={<PlusIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-600" />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state?.projects
              ?.slice()
              .sort((a, b) =>
                moment((b as any).created_at).isAfter(
                  moment((a as any).created_at)
                )
                  ? 1
                  : -1
              )
              .map((project) => (
                <ProjectCard key={project.displayId} project={project} />
              ))}
          </div>
        )}

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            mutate();
          }}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
