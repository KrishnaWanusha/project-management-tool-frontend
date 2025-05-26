import React, { useState } from "react";
import { Button } from "@/components_v2/ui/button";
import { UploadIcon, X, FileIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const FileUploadModal = ({ isOpen, onClose, onUpload }: any) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrop = (e: any) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    clearInterval(interval);
    setUploadProgress(100);

    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setUploadProgress(0);
      onClose();
      onUpload();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "var(--overlay-bg)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Upload File</h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        >
          {file ? (
            <div className="flex items-center justify-center space-x-3">
              <FileIcon className="w-8 h-8 text-blue-500" />
              <span className="text-gray-700">{(file as any)?.name}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600">
                  Drag and drop your file here, or{" "}
                  <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported files: PDF, DOC, DOCX, XLS, XLSX
                </p>
              </div>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {uploadProgress < 100
                ? `Uploading... ${uploadProgress}%`
                : "Processing..."}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploadModal;
