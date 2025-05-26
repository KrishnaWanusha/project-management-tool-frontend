import React from "react";
import InputComponent from "@components/input.component";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface GithubInfoStepProps {
  formData: {
    owner: string;
    repo: string;
    authToken: string;
  };
  onChange: (data: Partial<GithubInfoStepProps["formData"]>) => void;
}

const GithubInfoStep: React.FC<GithubInfoStepProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Owner
          </label>
          <InputComponent
            type="text"
            value={formData.owner}
            onChange={(e) => onChange({ owner: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Repository Name
          </label>
          <InputComponent
            type="text"
            value={formData.repo}
            onChange={(e) => onChange({ repo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Auth Token
        </label>
        <div className="relative group">
          <InputComponent
            type="text"
            placeholder="github_pat_"
            value={formData.authToken}
            onChange={(e) => onChange({ authToken: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <InformationCircleIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div className="absolute bottom-10 right-3 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md p-2 shadow-md">
            DO NOT PANIC! This token will securely store in our database.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubInfoStep;
