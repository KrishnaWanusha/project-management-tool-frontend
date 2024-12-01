"use client";
import React from "react";
import FileUpload from "@components/fileUpload"; // Import fileUpload component

const FileUploadPage = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Upload Your Meeting Files
      </h1>
      <FileUpload />
    </div>
  );
};

export default FileUploadPage;
