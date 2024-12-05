// components/projects/CreateProjectModal.tsx
import { Project, ProjectType } from "@models/project";
import React, { useCallback, useState } from "react";
import Modal from "@components/modal.component";
import MembersStep from "./memberSteps";
import ProjectInfoStep from "./projectInfoSteps";
import ButtonComponent from "@components/button.component";
import GithubInfoStep from "./githubInfoSteps";
import { createProject } from "@services/project";
import axios from "axios";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
  name: "",
  description: "",
  type: "Frontend" as ProjectType,
  githubRepo: "",
  members: [],
  owner: "",
  repo: "",
  authToken: "",
};

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<
    { isError?: boolean; message?: string } | undefined
  >(undefined);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = useCallback(async () => {
    try {
      const newProject: Project = {
        ...formData,
      };
      setSubmitting(true);
      await createProject(newProject);
      setStatus({ isError: false, message: "" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setStatus({
          isError: true,
          message:
            error?.response?.data?.message || "An unknown error occurred",
        });
      } else if (error instanceof Error) {
        setStatus({ isError: true, message: error.message });
      } else {
        setStatus({ isError: true, message: "An unexpected error occurred" });
      }
    } finally {
      setSubmitting(false);
    }
  }, [formData, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setFormData(initialFormData);
        setStep(1);
        setStatus(undefined);
        setSubmitting(false);
        onClose();
      }}
      maxWidth="2xl"
    >
      <div className="p-6">
        {!submitting ? (
          <>
            {!status ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {step === 1
                        ? "Create a new Project"
                        : step === 2
                        ? "Github Info"
                        : "Add Members"}
                    </h2>
                    <div className="text-sm text-gray-500">
                      Step {step} of 3
                    </div>
                  </div>
                  <div className="mt-4 relative">
                    <div className="absolute left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="absolute h-1 bg-gradient-to-r from-indigo-500 to-indigo-800 transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {step === 1 ? (
                  <ProjectInfoStep
                    formData={formData}
                    onChange={(data) => setFormData({ ...formData, ...data })}
                  />
                ) : step === 2 ? (
                  <GithubInfoStep
                    formData={formData}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(data) => setFormData({ ...formData, ...data })}
                  />
                ) : (
                  <MembersStep
                    members={formData.members}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(members: any) =>
                      setFormData({ ...formData, members })
                    }
                  />
                )}

                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <ButtonComponent
                      title="Back"
                      type="secondary"
                      onClick={handleBack}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    />
                  )}
                  <ButtonComponent
                    onClick={step === 3 ? handleSubmit : handleNext}
                    title={step === 3 ? "Create Project" : "Next"}
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  />
                </div>
              </>
            ) : (
              <>
                {status.isError ? (
                  <div className="my-8 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-14 shrink-0 fill-red-500 inline"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 0C114.62 0 0 114.62 0 256s114.62 256 256 256 256-114.62 256-256S397.38 0 256 0zm0 472c-119.39 0-216-96.61-216-216S136.61 40 256 40s216 96.61 216 216-96.61 216-216 216z" />
                      <path d="M256 134c-11.046 0-20 8.954-20 20v114c0 11.046 8.954 20 20 20s20-8.954 20-20V154c0-11.046-8.954-20-20-20z" />
                      <circle cx="256" cy="370" r="24" />
                    </svg>
                    <h4 className="text-xl text-gray-800 font-semibold mt-4">
                      Project creation failed!
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed mt-4">
                      {status?.message ?? "Something went wrong!"}
                    </p>
                  </div>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
                      viewBox="0 0 320.591 320.591"
                    >
                      <path
                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                        data-original="#000000"
                      ></path>
                    </svg>

                    <div className="my-8 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-14 shrink-0 fill-green-500 inline"
                        viewBox="0 0 512 512"
                      >
                        <path
                          d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z"
                          data-original="#000000"
                        />
                        <path
                          d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z"
                          data-original="#000000"
                        />
                      </svg>
                      <h4 className="text-xl text-gray-800 font-semibold mt-4">
                        Project created Successfully!
                      </h4>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <div className="my-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 shrink-0 fill-blue-500 animate-spin inline"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray="200"
                strokeDashoffset="150"
              />
            </svg>
            <h4 className="text-xl text-gray-800 font-semibold mt-4">
              Processing...
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed mt-4">
              Please wait while we complete your request.
            </p>
          </div>
        )}
        {!submitting && status && (
          <ButtonComponent
            title="Got it"
            className="w-full h-10"
            onClick={() => {
              setStatus(undefined);
              setFormData(initialFormData);
              setSubmitting(false);
              setStep(1);
              onClose();
            }}
          />
        )}
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
