import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

type MediaUploadProps = {
  buttonTitle: string;
  onSubmit: (file: File) => void;
};

const MediaUpload = ({ buttonTitle, onSubmit }: MediaUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": [], // Accepts all video types
      "audio/*": [], // Accepts all audio types
    },
    onDrop: (acceptedFiles) => {
      console.log("acceptedFiles", acceptedFiles[0]);
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="flex items-center justify-center w-full">
      <form
        className="w-full max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) {
            alert("Please upload a file.");
            return;
          }
          if (!(file instanceof File)) {
            alert("Invalid file type.");
            return;
          }
          onSubmit(file);
        }}
      >
        {/* File Upload */}
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-indigo-500 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 focus:ring-4 focus:ring-indigo-300"
        >
          <div
            {...getRootProps({ onClick: (event) => event.stopPropagation() })}
            className="flex flex-col items-center justify-center pt-5 pb-6"
          >
            <svg
              className="w-12 h-12 mb-4 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm font-semibold text-indigo-700">
              <span className="text-indigo-800">Click or drag</span> to upload
            </p>
            <p className="text-xs text-indigo-600">
              Accepts Video & Audio files
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            {...getInputProps()}
          />
        </label>

        {/* Show File Name and Size */}
        {file && (
          <div className="mt-4 text-center">
            <p className="font-semibold text-gray-800">File: {file.name}</p>
            <p className="text-sm text-gray-500">
              Size: {Math.round(file.size / 1024)} KB
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-500"
          >
            {buttonTitle}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaUpload;
