import React, { useState, useEffect } from "react";

const Processing = () => {
  const [processStage, setProcessStage] = useState(0); // Track the current processing stage
  const [stageNamesVisible, setStageNamesVisible] = useState([false, false, false, false]); // Track visibility of each stage name

  useEffect(() => {
    // Simulate the stages of processing after some time
    const stageTimeouts = [
      setTimeout(() => {
        setProcessStage(1);
        setStageNamesVisible((prev) => {
          const newState = [...prev];
          newState[0] = true; // Show "Processing Video" after 1 second
          return newState;
        });
      }, 1000), // Video processing
      setTimeout(() => {
        setProcessStage(2);
        setStageNamesVisible((prev) => {
          const newState = [...prev];
          newState[1] = true; // Show "Audio Extraction" after 3 seconds
          return newState;
        });
      }, 3000), // Audio extraction
      setTimeout(() => {
        setProcessStage(3);
        setStageNamesVisible((prev) => {
          const newState = [...prev];
          newState[2] = true; // Show "Cleaning" after 5 seconds
          return newState;
        });
      }, 5000), // Cleaning
      setTimeout(() => {
        setProcessStage(4);
        setStageNamesVisible((prev) => {
          const newState = [...prev];
          newState[3] = true; // Show "Transcribing" after 7 seconds
          return newState;
        });
      }, 7000), // Transcribing
    ];

    // Cleanup timeouts when the component unmounts
    return () => {
      stageTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Helper function to return the appropriate classes for each stage
  const getStageClass = (stage) => {
    if (processStage >= stage) {
      return "bg-blue-500 text-white"; // Filled stage (blue)
    } else {
      return "bg-gray-200 text-gray-600"; // Unfilled stage (gray)
    }
  };

  return (
    <div className="space-y-6">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {/* Video Processing */}
        <li className="mb-10 ml-4">
          <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border ${getStageClass(1)}`}></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Video</time>
          {stageNamesVisible[0] && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Video</h3>
          )}
        </li>

        {/* Audio Extraction */}
        <li className="mb-10 ml-4">
          <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border ${getStageClass(2)}`}></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Audio</time>
          {stageNamesVisible[1] && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Extraction</h3>
          )}
        </li>

        {/* Cleaning */}
        <li className="mb-10 ml-4">
          <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border ${getStageClass(3)}`}></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Cleaning</time>
          {stageNamesVisible[2] && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cleaning Audio</h3>
          )}
        </li>

        {/* Transcribing */}
        <li className="mb-10 ml-4">
          <div className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border ${getStageClass(4)}`}></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Transcribing</time>
          {stageNamesVisible[3] && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transcribing Audio</h3>
          )}
        </li>
      </ol>
    </div>
  );
};

export default Processing;
