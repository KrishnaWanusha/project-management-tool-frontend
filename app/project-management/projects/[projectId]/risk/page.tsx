// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import FileUploader from "./storyPointFileUploader";
import TaskList from "./taskList";
import axiosInstance from "../../../../../helpers/axiosInstance.c";

// Interface for task data
interface Task {
  id?: string;
  title: string;
  storyId: string;
  description?: string;
  teamEstimate?: number;
  existingEstimate?: number;
  storyPoint: number; // Model prediction - required by TaskList
  rfPrediction?: number;
  confidence?: number;
  fullAdjustment?: number;
  appliedAdjustment?: number;
  dqnInfluence?: number;
  comparisonStatus?: string;
  riskLevel?: string;
  difference?: number;
  createdAt?: string;
  projectId?: string;
}

export default function StoryEstimateHomePage() {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pastStories, setPastStories] = useState<Task[]>([]);
  const [showTaskList, setShowTaskList] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showPastStories, setShowPastStories] = useState<boolean>(false);
  const [loadingPastStories, setLoadingPastStories] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Handle tasks loaded from FileUploader
  const handleTasksLoad = (loadedTasks: Task[]) => {
    const processedTasks = loadedTasks.map((task) => {
      if (task.teamEstimate !== undefined && task.teamEstimate !== null) {
        // Calculate difference and risk levels before sending to API
        const storyPoint = task.storyPoint;
        const teamEstimate = task.teamEstimate;

        // Calculate difference
        const difference = teamEstimate - storyPoint;
        const absDifference = Math.abs(difference);

        // Determine comparison status and risk level
        let comparisonStatus, riskLevel;

        if (absDifference > 5) {
          comparisonStatus =
            difference > 0 ? "severe-overestimate" : "severe-underestimate";
          riskLevel = "high";
        } else if (absDifference >= 3) {
          comparisonStatus =
            difference > 0 ? "mild-overestimate" : "mild-underestimate";
          riskLevel = "medium";
        } else if (absDifference > 0) {
          comparisonStatus =
            difference > 0 ? "slight-overestimate" : "slight-underestimate";
          riskLevel = "low";
        } else {
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

    // Set the processed tasks
    setTasks(processedTasks);
    setShowTaskList(true);

    // Hide past stories if they were showing
    setShowPastStories(false);
  };

  // Handle task update from TaskList
  const handleUpdateTask = (index: number, updatedTask: Task) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);

    // Show success notification
    setNotification({
      type: "success",
      message: "Team estimate updated successfully",
    });

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Process past stories to ensure they have risk assessment data
  const processPastStories = (stories: Task[]) => {
    return stories.map((story) => {
      // If the story has a team estimate but is missing risk assessment data, calculate it
      if (
        story.teamEstimate !== undefined &&
        story.teamEstimate !== null &&
        (!story.difference || !story.comparisonStatus || !story.riskLevel)
      ) {
        const storyPoint =
          typeof story.storyPoint === "number" ? story.storyPoint : 0;
        const teamEstimate =
          typeof story.teamEstimate === "number" ? story.teamEstimate : 0;

        // Calculate difference
        const difference = teamEstimate - storyPoint;
        const absDifference = Math.abs(difference);

        // Determine comparison status and risk level
        let comparisonStatus, riskLevel;

        if (absDifference > 5) {
          comparisonStatus =
            difference > 0 ? "severe-overestimate" : "severe-underestimate";
          riskLevel = "high";
        } else if (absDifference >= 3) {
          comparisonStatus =
            difference > 0 ? "mild-overestimate" : "mild-underestimate";
          riskLevel = "medium";
        } else if (absDifference > 0) {
          comparisonStatus =
            difference > 0 ? "slight-overestimate" : "slight-underestimate";
          riskLevel = "low";
        } else {
          comparisonStatus = "accurate";
          riskLevel = "low";
        }

        return {
          ...story,
          difference,
          comparisonStatus,
          riskLevel,
        };
      }

      return story;
    });
  };

  // Toggle and load past stories
  const togglePastStories = async () => {
    // If we're turning off past stories, just toggle the state
    if (showPastStories) {
      setShowPastStories(false);
      return;
    }

    // If we haven't loaded past stories yet, load them
    if (pastStories.length === 0) {
      try {
        setLoadingPastStories(true);

        const response = await axiosInstance().get("/estimate/stories");

        console.log("API response status:", response.status);
        console.log("API response data:", response.data);

        // Handle the response, which should already be JSON
        const data = response.data;

        if (data.success && Array.isArray(data.data)) {
          // Log first story with all fields to check structure
          if (data.data.length > 0) {
            console.log("First story from API:", data.data[0]);
          }

          // Process the stories on client-side
          const processedStories = processPastStories(data.data);
          setPastStories(processedStories);

          console.log("Processed stories to display:", processedStories.length);

          setNotification({
            type: "success",
            message: `Loaded ${processedStories.length} past user stories`,
          });
          setTimeout(() => setNotification(null), 3000);
        } else {
          console.error("Invalid response format for stories:", data);
          throw new Error("Invalid response format from server");
        }
      } catch (error: any) {
        console.error("Error fetching past stories:", error);
        setNotification({
          type: "error",
          message: `Failed to load past stories: ${
            error.message || "Unknown error"
          }`,
        });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setLoadingPastStories(false);
      }
    }

    // Toggle the state to show past stories
    setShowPastStories(true);
  };
  // Get status text for display
  const getStatusText = (status?: string) => {
    if (!status) return "Not Estimated";

    switch (status) {
      case "severe-overestimate":
        return "Severe Overestimate";
      case "mild-overestimate":
        return "Mild Overestimate";
      case "slight-overestimate":
        return "Slight Overestimate";
      case "severe-underestimate":
        return "Severe Underestimate";
      case "mild-underestimate":
        return "Mild Underestimate";
      case "slight-underestimate":
        return "Slight Underestimate";
      case "accurate":
        return "Accurate";
      default:
        return "Not Estimated";
    }
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    const dataToAnalyze = showPastStories ? pastStories : tasks;

    return dataToAnalyze.reduce(
      (acc, task) => {
        if (!task.riskLevel) {
          acc.notEstimated++;
        } else if (task.riskLevel === "high") {
          acc.highRisk++;
        } else if (task.riskLevel === "medium") {
          acc.mediumRisk++;
        } else if (task.riskLevel === "low") {
          if (task.comparisonStatus === "accurate") {
            acc.accurate++;
          } else {
            acc.lowRisk++;
          }
        }
        return acc;
      },
      { highRisk: 0, mediumRisk: 0, lowRisk: 0, accurate: 0, notEstimated: 0 }
    );
  };

  // Export results to CSV
  const exportToCSV = () => {
    const dataToExport = showPastStories ? pastStories : tasks;

    const csvRows = [
      [
        "Title",
        "Description",
        "Model Prediction",
        "Team Estimate",
        "Difference",
        "Status",
        "Risk Level",
        "Date",
      ].join(","),
      ...dataToExport.map((task) => {
        return [
          `"${(task.title || "").replace(/"/g, '""')}"`,
          `"${(task.description || "").replace(/"/g, '""')}"`,
          task.storyPoint?.toFixed(1) || "",
          task.teamEstimate !== undefined ? task.teamEstimate.toString() : "",
          task.difference !== undefined ? task.difference.toFixed(1) : "",
          `"${getStatusText(task.comparisonStatus)}"`,
          `"${task.riskLevel || "Not estimated"}"`,
          task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "",
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      showPastStories ? "past_stories.csv" : "task_estimation_results.csv"
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle summary view
  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  // Get summary statistics
  const summaryStats = getSummaryStats();

  // Get row background color based on risk level
  const getRowBackgroundColor = (task: Task) => {
    if (!task.riskLevel || !task.comparisonStatus) return "";

    if (task.riskLevel === "high") return "bg-red-50";
    if (task.riskLevel === "medium") return "bg-orange-50";
    return task.comparisonStatus === "accurate"
      ? "bg-green-50"
      : "bg-yellow-50";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 rounded-md p-4 shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === "success" ? "✅" : "❌"}
            </span>
            <p className="text-sm">{notification.message}</p>
            <button
              className="ml-4 text-sm"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">
        {showPastStories ? "Past User Stories" : "Story Point Estimator"}
      </h1>

      {!showTaskList ? (
        <FileUploader onTasksLoad={handleTasksLoad} />
      ) : (
        <>
          {showSummary && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Risk Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-red-100 rounded-md">
                  <div className="text-2xl font-bold">
                    {summaryStats.highRisk}
                  </div>
                  <div className="text-sm text-gray-700">High Risk Tasks</div>
                </div>

                <div className="p-4 bg-orange-100 rounded-md">
                  <div className="text-2xl font-bold">
                    {summaryStats.mediumRisk}
                  </div>
                  <div className="text-sm text-gray-700">Medium Risk Tasks</div>
                </div>

                <div className="p-4 bg-yellow-100 rounded-md">
                  <div className="text-2xl font-bold">
                    {summaryStats.lowRisk}
                  </div>
                  <div className="text-sm text-gray-700">Low Risk Tasks</div>
                </div>

                <div className="p-4 bg-green-100 rounded-md">
                  <div className="text-2xl font-bold">
                    {summaryStats.accurate}
                  </div>
                  <div className="text-sm text-gray-700">
                    Accurate Estimates
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-md">
                  <div className="text-2xl font-bold">
                    {summaryStats.notEstimated}
                  </div>
                  <div className="text-sm text-gray-700">Not Estimated</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {showPastStories ? "Past User Stories" : "Task List"}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={toggleSummary}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {showSummary ? "Hide Summary" : "Show Summary"}
                </button>
                <button
                  onClick={togglePastStories}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                  disabled={loadingPastStories}
                >
                  {loadingPastStories
                    ? "Loading..."
                    : showPastStories
                    ? "Current Tasks"
                    : "Past User Stories"}
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setShowTaskList(false)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  Upload New File
                </button>
              </div>
            </div>

            {showPastStories ? (
              loadingPastStories ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : pastStories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2 border">Title</th>
                        <th className="text-center p-2 border">
                          Model Estimate
                        </th>
                        <th className="text-center p-2 border">
                          Team Estimate
                        </th>
                        <th className="text-center p-2 border">Difference</th>
                        <th className="text-center p-2 border">Status</th>
                        <th className="text-center p-2 border">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastStories.map((task, index) => {
                        if (index < 2) {
                          console.log(`Rendering past story ${index}:`, {
                            id: task.id,
                            title: task.title,
                            storyPoint: task.storyPoint,
                            teamEstimate: task.teamEstimate,
                            difference: task.difference,
                            status: task.comparisonStatus,
                            createdAt: task.createdAt,
                          });
                        }

                        return (
                          <tr
                            key={`past-${task.id || index}`}
                            className={`border-b ${getRowBackgroundColor(
                              task
                            )}`}
                          >
                            <td className="p-2 border">
                              <div className="font-medium">
                                {task.title || "Untitled"}
                              </div>
                              {task.description && (
                                <p
                                  className="text-xs text-gray-500 truncate max-w-xs"
                                  title={task.description}
                                >
                                  {task.description}
                                </p>
                              )}
                            </td>
                            <td className="p-2 border text-center">
                              {task.storyPoint !== undefined &&
                              task.storyPoint !== null
                                ? Number(task.storyPoint).toFixed(1)
                                : "-"}
                            </td>
                            <td className="p-2 border text-center">
                              {task.teamEstimate !== undefined &&
                              task.teamEstimate !== null
                                ? Number(task.teamEstimate).toString()
                                : "-"}
                            </td>
                            <td
                              className={`p-2 border text-center ${
                                task.riskLevel === "high"
                                  ? "text-red-600"
                                  : task.riskLevel === "medium"
                                  ? "text-amber-500"
                                  : task.comparisonStatus === "accurate"
                                  ? "text-green-600"
                                  : "text-yellow-500"
                              }`}
                            >
                              {task.difference !== undefined &&
                              task.difference !== null
                                ? Number(task.difference).toFixed(1)
                                : "-"}
                            </td>
                            <td className="p-2 border text-center">
                              {getStatusText(task.comparisonStatus)}
                            </td>
                            <td className="p-2 border text-center text-sm">
                              {task.createdAt
                                ? new Date(task.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-md">
                  No past stories found
                </div>
              )
            ) : (
              <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
