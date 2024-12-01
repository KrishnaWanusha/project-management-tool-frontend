// src/pages/FileUploadPage.js
import React from "react";
import Layout from "../components/Layout"; // Import Layout component
import FileUpload from "../components/FileUpload"; // Import FileUpload component

const FileUploadPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-semibold text-center mb-6">Upload Your Meeting Files</h1>
        <FileUpload />
      </div>
    </Layout>
  );
};

export default FileUploadPage;
