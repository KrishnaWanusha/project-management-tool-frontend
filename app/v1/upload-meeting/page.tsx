"use client";
import React, { useState } from "react";
import { buildRoute } from "@helpers/global";
import FileUpload from "@components/fileUpload"; // Import fileUpload component
import { useRouter } from "next/navigation";

const FileUploadPage = () => {
  const router = useRouter(); // Initialize useRouter
  const [meetingTitle, setMeetingTitle] = useState(""); // Meeting title state

  const handleTitleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMeetingTitle(event.target.value); // Update meeting title
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Simulate uploading the file
    alert("File is being uploaded!");

    // Redirect to the Processing page after file upload
    router.push(buildRoute("/upload-meeting/processing"));
  };
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Upload Your Meeting Files
      </h1>
      <div className="mb-4">
        <label
          htmlFor="meetingTitle"
          className="block text-sm font-medium text-gray-700"
        >
          Meeting Title
        </label>
        <input
          type="text"
          id="meetingTitle"
          name="meetingTitle"
          value={meetingTitle}
          onChange={handleTitleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter meeting title"
        />
      </div>
      <FileUpload
        buttonTitle="Upload and Generate Document"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FileUploadPage;
