import FileUpload from "@components/fileUpload";
import Modal from "@components/modal.component";
import { useCallback, useState } from "react";
import PreviewCard from "./previewCard";
import ButtonComponent from "@components/button.component";
import {
  createIssues,
  SRSUploadRequest,
  uploadSRSFile,
} from "@services/issues";
import Processing from "@components/processing";
import axios from "axios";
import { Project } from "@models/project";
import ProcessingModal from "@components/processing";

type UploadModalProps = {
  isOpen: boolean;
  info?: Project;
  onClose: () => void;
};

type ModalState = "upload" | "preview" | "processing" | "success" | "error";

export default function UploadModal({
  isOpen,
  info,
  onClose,
}: UploadModalProps) {
  const [state, setState] = useState<SRSUploadRequest | null>(null);
  const [modalState, setModalState] = useState<ModalState>("upload");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const onUpload = useCallback(
    async (file: File) => {
      try {
        setLoading(true);
        const response = await uploadSRSFile(file);
        if (response?.data?.tasks?.length > 0) {
          setModalState("preview");
          setState({
            repo: info?.repo ?? "",
            owner: info?.owner ?? "",
            issues: response?.data?.tasks?.map((m) => ({
              title: m.requirement,
              body: m.tasks?.join("\n"),
            })),
          });
        } else {
          setErrorMessage("Failed to upload the SRS file");
          setModalState("error");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Error uploading the SRS file");
        setModalState("error");
      } finally {
        setLoading(false);
      }
    },
    [info?.owner, info?.repo]
  );

  const onSubmit = useCallback(async () => {
    if (state) {
      try {
        setModalState("processing");
        const data = await createIssues(state);
        if (data?.data?.success) {
          setModalState("success");
        }
      } catch (error) {
        let message = "An unexpected error occurred";
        if (axios.isAxiosError(error)) {
          message = error?.response?.data?.message || message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        setErrorMessage(message);
        setModalState("error");
      }
    }
  }, [state]);

  const handleClose = useCallback(() => {
    setState(null);
    setModalState("upload");
    setErrorMessage("");
    onClose();
  }, [onClose]);

  const renderContent = () => {
    switch (modalState) {
      case "upload":
        return (
          <>
            {!loading ? (
              <>
                <h1 className="text-xl font-semibold text-center mb-6">
                  Upload SRS Document
                </h1>
                <FileUpload buttonTitle="Upload Document" onSubmit={onUpload} />
              </>
            ) : (
              <ProcessingModal />
            )}
          </>
        );

      case "preview":
        return (
          <>
            <h1 className="text-xl font-semibold text-center mb-6">
              Preview Issues
            </h1>
            <div className="max-h-80 overflow-y-auto px-2">
              {state?.issues?.map((issue, index) => (
                <PreviewCard key={index} issue={issue} />
              ))}
            </div>
            <div className="flex justify-center pt-4 w-full sticky bottom-0 bg-white p-4">
              <ButtonComponent
                title="Submit"
                onClick={onSubmit}
                className="w-full"
              />
            </div>
          </>
        );

      case "processing":
        return <Processing />;

      case "success":
        return (
          <div className="my-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 shrink-0 fill-green-500 inline"
              viewBox="0 0 512 512"
            >
              <path d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z" />
              <path d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z" />
            </svg>
            <h4 className="text-xl text-gray-800 font-semibold mt-4">
              Issues created Successfully!
            </h4>
            <ButtonComponent
              title="Close"
              onClick={handleClose}
              className="mt-4"
            />
          </div>
        );

      case "error":
        return (
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
              Issue creation failed!
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed mt-4">
              {errorMessage || "Something went wrong!"}
            </p>
            <ButtonComponent
              title="Try Again"
              onClick={() => setModalState("upload")}
              className="mt-4"
            />
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="p-6">{renderContent()}</div>
    </Modal>
  );
}
