import React, { useState } from "react";
import MediaUpload from "@components/mediaUpload.component";

interface UploadMeetingStepProps {
  onUpload: (file: File) => void;
}

const UploadMeetingStep: React.FC<UploadMeetingStepProps> = ({ onUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    onUpload(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Upload Meeting Recording</h3>
      <p className="text-sm text-gray-600">
        Upload a video or audio file of the meeting. Supported formats: MP4, MP3, WAV, AVI, etc.
      </p>

      <MediaUpload buttonTitle="Upload File" onSubmit={handleFileUpload} />

      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Uploaded File:</strong> {uploadedFile.name}
          </p>
          <p className="text-xs text-gray-500">
            Size: {Math.round(uploadedFile.size / 1024)} KB
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadMeetingStep;
