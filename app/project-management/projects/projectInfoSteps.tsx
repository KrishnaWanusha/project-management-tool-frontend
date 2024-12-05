import React from "react";
import { ProjectType } from "@models/project";
import InputComponent from "@components/input.component";
import TextAreaComponent from "@components/textArea.component";
import SelectComponent from "@components/select.component";

interface ProjectInfoStepProps {
  formData: {
    name: string;
    description: string;
    type: ProjectType;
    githubRepo: string;
  };
  onChange: (data: Partial<ProjectInfoStepProps["formData"]>) => void;
}

const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Project Name
      </label>
      <InputComponent
        type="text"
        value={formData.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />

      <label className="block mt-4 text-sm font-medium text-gray-700 mb-1">
        Type
      </label>
      <SelectComponent
        options={[
          { label: "Frontend", value: "Frontend" },
          { label: "Backend", value: "Backend" },
          { label: "Mobile", value: "Mobile" },
          { label: "Full Stack", value: "FullStack" },
          { label: "Dev Ops", value: "DevOps" },
        ]}
        onChange={(e) => onChange({ type: e.target.value as ProjectType })}
      />
      <label className="block mt-4 text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <TextAreaComponent
        value={formData.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <label className="block mt-4 text-sm font-medium text-gray-700">
        GitHub Repository
      </label>
      <InputComponent
        value={formData.githubRepo}
        placeholder="https://github.com/example/project"
        onChange={(e) => onChange({ githubRepo: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
  );
};

export default ProjectInfoStep;
