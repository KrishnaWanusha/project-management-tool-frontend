// components/projects/ProjectCard.tsx
import BadgeComponent from "@components/badge.component";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Project } from "@models/project";
import { useRouter } from "next/navigation";
import React from "react";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();
  return (
    <div
      onClick={() =>
        router.push(
          `/project-management/projects/${project.displayId}/documents`
        )
      }
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer flex"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {project.name}
              </h3>
              <div className="flex flex-row items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 my-2">
                  {project.type}
                </span>

                <div className="inline-flex items-center my-2 mx-2">
                  <UsersIcon className="w-5 h-5" />
                  <span className="text-sm text-gray-600 ml-1">
                    {project?.members?.length}
                  </span>
                </div>
              </div>
            </div>
            <BadgeComponent
              title={project.status || "Active"}
              className={`${
                project.status === "Active"
                  ? "bg-green-200"
                  : project.status === "On Hold"
                  ? "bg-yellow-200"
                  : "bg-gray-200"
              }`}
            />
          </div>
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="flex justify-between items-end mt-4">
          {project.githubRepo && (
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.16 6.84 9.49.5.09.66-.22.66-.49v-1.7c-2.78.6-3.37-1.35-3.37-1.35-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.88 1.51 2.31 1.08 2.87.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.338 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.91.68 1.83v2.72c0 .27.16.58.67.49C19.14 20.16 22 16.41 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
