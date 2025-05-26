// components/FileUploader.tsx
"use client";

import { useState } from "react";
import Papa from "papaparse";
import storyPointsApi from "@services/storypoint";

interface FileUploaderProps {
  onTasksLoad: (tasks: any[]) => void;
}

const FileUploader = (props: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
    console.log(message);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setLogs([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLogs([]);
    addLog(`Processing file: ${file.name}`);

    try {
      // Parse CSV file - Fixed version with proper typing
      const parseResult = await new Promise<Papa.ParseResult<any>>(
        (resolve, reject) => {
          Papa.parse<any>(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              resolve(results);
            },
            error: function (error) {
              reject(error);
            },
          });
        }
      );

      addLog(`CSV parsed successfully. Found ${parseResult.data.length} rows.`);

      if (parseResult.data.length === 0) {
        throw new Error("CSV file is empty");
      }

      // Validate and map data
      const stories = parseResult.data.map((row: any, index: number) => {
        if (!row.title) {
          addLog(
            `Warning: Row ${index + 1} is missing a title, using default name.`
          );
          row.title = `Task ${index + 1}`;
        }

        return {
          title: row.title,
          description: row.description || "",
          teamEstimate: row.teamEstimate
            ? parseFloat(row.teamEstimate)
            : undefined,
        };
      });

      addLog(`Prepared ${stories.length} stories for API.`);
      addLog("Sending request to API...");

      // Call API
      try {
        const response = await storyPointsApi.batchEstimate(stories);

        addLog(`Received successful response from API.`);

        // Process the results to add comparison metrics
        const processedTasks = response.data.map((task: any) => {
          // Add comparison metrics if team estimate exists
          if (task.teamEstimate !== undefined) {
            const difference = task.teamEstimate - task.storyPoint;
            const absDifference = Math.abs(difference);

            let comparisonStatus, riskLevel;

            if (absDifference > 5) {
              // High risk: difference greater than 5
              comparisonStatus =
                difference > 0 ? "severe-overestimate" : "severe-underestimate";
              riskLevel = "high";
            } else if (absDifference >= 3) {
              // Medium risk: difference greater than or equal to 3
              comparisonStatus =
                difference > 0 ? "mild-overestimate" : "mild-underestimate";
              riskLevel = "medium";
            } else if (absDifference > 0) {
              // Low risk: any non-zero difference up to 3 (exclusive)
              comparisonStatus =
                difference > 0 ? "slight-overestimate" : "slight-underestimate";
              riskLevel = "low";
            } else {
              // Accurate: exactly equal (difference is 0)
              comparisonStatus = "accurate";
              riskLevel = "low";
            }

            return {
              ...task,
              difference,
              comparisonStatus,
              riskLevel,
            };
          }

          return task;
        });

        addLog(`Processing complete. ${processedTasks.length} tasks ready.`);
        props.onTasksLoad(processedTasks);
      } catch (apiError: any) {
        if (apiError.name === "HTMLResponseError") {
          addLog(
            "Received HTML instead of JSON. Server might be returning an error page."
          );
          throw new Error(
            "Backend error: The server returned an HTML error page instead of JSON. Check backend logs for details."
          );
        } else {
          addLog(`API error: ${apiError.message}`);
          throw apiError;
        }
      }
    } catch (err: any) {
      console.error("Error during file processing:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Tasks</h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload a CSV file with task information to compare model predictions
        with team estimates
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Your CSV file should include columns for title, description
            (optional), and teamEstimate (optional).
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="text-sm block border border-gray-300 rounded p-2 w-60"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded mt-4">
            <p className="font-bold mb-2">Processing Logs:</p>
            <pre className="text-xs overflow-auto max-h-40 p-2">
              {logs.join("\n")}
            </pre>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Upload and Analyze"}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
