// components/projects/CreateProjectModal.tsx

import { Meeting, MeetingType } from "@models/meeting";
import React, { useCallback, useState } from "react";
import Modal from "@components/modal.component";
import MembersStep from "./memberSteps";
import MeetingInfoStep from "./MeetingInfoStep";
import UploadMeetingStep from "./UploadMeetingStep"; // 🔹 New Upload Step
import ButtonComponent from "@components/button.component";
import axios from "axios";
import ProcessingModal from "@components/processing";
import { createMeeting } from "@services/meeting";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: Meeting = {
  name: "",
  description: "",
  type: "General" as MeetingType,
  date: "",
  uploadedFile: null,
  members: [],
};

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
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
      const newMeeting: Meeting = {
        ...formData,
      };
      setSubmitting(true);
      await createMeeting(newMeeting);
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
  }, [formData]);

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
                        ? "Create Meeting"
                        : step === 2
                        ? "Upload Meeting File"
                        : "Add Members"}
                    </h2>
                    <div className="text-sm text-gray-500">
                      Step {step} of 3
                    </div>
                  </div>
                  {/* Stepper Progress Bar */}
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
                  <MeetingInfoStep
                    formData={formData}
                    onChange={(data) => setFormData({ ...formData, ...data })}
                  />
                ) : step === 2 ? (
                  <UploadMeetingStep
                    onUpload={(file) => {
                      if (file instanceof File) {
                        setFormData({ ...formData, uploadedFile: file });
                      }
                    }}
                  />
                ) : (
                  <MembersStep
                    members={(formData.members as unknown as string[]) ?? []}
                    onChange={(members: any) =>
                      setFormData({ ...formData, members })
                    }
                  />
                )}

                {/* Navigation Buttons */}
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
                    title={step === 3 ? "Create Meeting" : "Next"}
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  />
                </div>
              </>
            ) : (
              <>
                {status.isError ? (
                  <div className="my-8 text-center">
                    <h4 className="text-xl text-gray-800 font-semibold mt-4">
                      Meeting creation failed!
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed mt-4">
                      {status?.message ?? "Something went wrong!"}
                    </p>
                  </div>
                ) : (
                  <div className="my-8 text-center">
                    <h4 className="text-xl text-gray-800 font-semibold mt-4">
                      Meeting created Successfully!
                    </h4>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <ProcessingModal />
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

export default CreateMeetingModal;
