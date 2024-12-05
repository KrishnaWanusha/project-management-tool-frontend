import React from "react";
import {
  UsersIcon,
  ExclamationCircleIcon,
  CodeBracketIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { Project } from "@models/project";

interface ProjectDashboardProps {
  loading: boolean;
  project: Project;
}

const ProjectDashboard = ({ loading, project }: ProjectDashboardProps) => {
  return (
    <div className="space-y-6 mb-4">
      <div className="space-y-6 mb-4">
        {/* Project Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {loading ? (
                <>
                  {/* Loading Skeletons for Title and Info */}
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {project?.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      <CodeBracketIcon className="w-4 h-4 mr-1" />
                      {project?.type}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <CheckBadgeIcon className="w-4 h-4 mr-1" />
                      {project?.status}
                    </span>
                  </div>
                </>
              )}
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            ) : (
              <a
                href={project?.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
                View Repository
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Members Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Team Members</p>
              <p className="text-2xl font-bold text-blue-700">
                {project?.members?.length}
              </p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-full">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Issues Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">
                Total Issues
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {project?.issues?.length}
              </p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-full">
              <ExclamationCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
