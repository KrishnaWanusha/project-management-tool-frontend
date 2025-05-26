// components/TaskList.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHistory } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../../../../helpers/axiosInstance.c";

interface Task {
  id?: string;
  _id?: string;
  title: string;
  storyId: string;
  description?: string;
  teamEstimate?: number;
  existingEstimate?: number;
  storyPoint: number; // Model prediction
  rfPrediction?: number;
  confidence?: number;
  fullAdjustment?: number;
  appliedAdjustment?: number;
  dqnInfluence?: number;
  comparisonStatus?: string;
  riskLevel?: string;
  difference?: number;
  createdAt?: string;
}

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (index: number, updatedTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = (props) => {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(
    null
  );
  const [teamEstimate, setTeamEstimate] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [pastStories, setPastStories] = useState<Task[]>([]);
  const [showPastStories, setShowPastStories] = useState<boolean>(false);
  const [loadingPastStories, setLoadingPastStories] = useState<boolean>(false);

  // Open task details dialog
  const openTaskDetail = (index: number) => {
    setSelectedTaskIndex(index);
    const currentEstimate = props.tasks[index].teamEstimate?.toString() || "";
    setTeamEstimate(currentEstimate);
    setShowDialog(true);
    setUpdateError(null);
  };

  // Calculate comparison and risk
  const calculateComparison = (
    modelEstimate: number,
    teamEstimate?: number
  ) => {
    if (teamEstimate === undefined) {
      return {
        status: "unestimated",
        riskLevel: "none",
        difference: undefined,
      };
    }

    const difference = teamEstimate - modelEstimate;
    const absDifference = Math.abs(difference);

    let status = "";
    let riskLevel = "";

    if (absDifference > 5) {
      // High risk: difference greater than 5
      status = difference > 0 ? "severe-overestimate" : "severe-underestimate";
      riskLevel = "high";
    } else if (absDifference >= 3) {
      // Medium risk: difference greater than or equal to 3
      status = difference > 0 ? "mild-overestimate" : "mild-underestimate";
      riskLevel = "medium";
    } else if (absDifference > 0) {
      // Low risk: any non-zero difference up to 3 (exclusive)
      status = difference > 0 ? "slight-overestimate" : "slight-underestimate";
      riskLevel = "low";
    } else {
      // Accurate: exactly equal (difference is 0)
      status = "accurate";
      riskLevel = "low";
    }

    return { status, riskLevel, difference };
  };

  const handleEstimateSubmit = async () => {
    if (selectedTaskIndex === null) return;

    const numericEstimate = parseFloat(teamEstimate);
    if (isNaN(numericEstimate)) {
      setUpdateError("Please enter a valid number");
      return;
    }

    setSubmitting(true);
    setUpdateError(null);

    try {
      const task = props.tasks[selectedTaskIndex];
      console.log("Full task object:", task);

      // For tasks from the past stories API, need to explicitly save them
      if (!task.id && !task._id && !showPastStories) {
        console.log("Creating new story in database...");
        try {
          // Call the save-story API endpoint
          const response = await axiosInstance().post("/estimate/save-story", {
            title: task.title,
            description: task.description || "",
            storyPoint: task.storyPoint,
            rfPrediction: task.rfPrediction,
            confidence: task.confidence,
            fullAdjustment: task.fullAdjustment || 0,
            appliedAdjustment: task.appliedAdjustment || 0,
            dqnInfluence: task.dqnInfluence || 0.3,
            teamEstimate: numericEstimate,
          });

          console.log("Story saved to database:", response.data);

          // Update the task with server response data
          const savedTask = response.data.data;
          props.onUpdateTask(selectedTaskIndex, savedTask);
          setShowDialog(false);
          return;
        } catch (error) {
          console.error("Error saving story to database:", error);
          setUpdateError("Failed to save story to database");
        }
      }

      // Try to find any ID field using different possible names
      const taskId = task.id || task._id || task.storyId;

      // If the task has an ID, we should call the API to update it
      if (taskId) {
        try {
          console.log(
            `Sending update for task ID: ${taskId}, estimate: ${numericEstimate}`
          );

          // Use axios for the API call
          const response = await axiosInstance().put(
            "/estimate/update-team-estimate",
            {
              storyId: taskId,
              teamEstimate: numericEstimate,
            }
          );

          console.log(`API Response status: ${response.status}`);
          console.log("API response data:", response.data);

          const result = response.data;

          if (!result.success) {
            throw new Error(result.error || "Operation failed on server");
          }

          // Use the response from server
          const updatedTask = result.data;
          console.log("Updated task from server:", updatedTask);

          props.onUpdateTask(selectedTaskIndex, updatedTask);
          setShowDialog(false);
        } catch (error: any) {
          console.error("Error updating team estimate:", error);
          setUpdateError(error.message || "Failed to update team estimate");

          // Fall back to local calculation
          const updatedTask = { ...task, teamEstimate: numericEstimate };
          const { status, riskLevel, difference } = calculateComparison(
            updatedTask.storyPoint,
            numericEstimate
          );
          updatedTask.comparisonStatus = status;
          updatedTask.riskLevel = riskLevel;
          updatedTask.difference = difference;

          console.log("Using local fallback calculation:", updatedTask);
          props.onUpdateTask(selectedTaskIndex, updatedTask);
          setShowDialog(false);
        }
      } else {
        // No ID, just update locally
        console.log("Task has no ID, updating locally only");
        const updatedTask = { ...task, teamEstimate: numericEstimate };
        const { status, riskLevel, difference } = calculateComparison(
          updatedTask.storyPoint,
          numericEstimate
        );
        updatedTask.comparisonStatus = status;
        updatedTask.riskLevel = riskLevel;
        updatedTask.difference = difference;

        console.log("Local calculation result:", updatedTask);
        props.onUpdateTask(selectedTaskIndex, updatedTask);
        setShowDialog(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Get risk indicator
  const getRiskIndicator = (task: Task) => {
    if (!task.riskLevel) return null;

    let icon = "";
    let color = "";

    switch (task.riskLevel) {
      case "high":
        icon = "🛑"; // Red stop sign
        color = "red";
        break;
      case "medium":
        icon = "⚠️"; // Warning sign
        color = "orange";
        break;
      case "low":
        if (task.comparisonStatus === "accurate") {
          icon = "✅"; // Green checkmark
          color = "green";
        } else {
          icon = "⚠️"; // Warning sign
          color = "yellow";
        }
        break;
    }

    return <span style={{ color }}>{icon}</span>;
  };

  // Get status display text
  const getStatusText = (status?: string) => {
    if (!status) return "Not estimated";

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
        return "Not estimated";
    }
  };

  // Toggle past stories and fetch them if necessary
  const togglePastStories = async () => {
    if (!showPastStories && pastStories.length === 0) {
      // Only fetch if we're showing and haven't loaded them yet
      try {
        setLoadingPastStories(true);
        const response = await fetch("/api/estimate/stories");

        if (!response.ok) {
          throw new Error("Failed to fetch past stories");
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPastStories(data.data);
        } else {
          console.error("Invalid response format for stories:", data);
        }
      } catch (error) {
        console.error("Error fetching past stories:", error);
      } finally {
        setLoadingPastStories(false);
      }
    }

    setShowPastStories(!showPastStories);
  };

  return (
    <div>
      {/* Past Stories Toggle Button (This would be in the parent component) */}
      {!showPastStories ? (
        <div className="mb-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border">Title</th>
                <th className="text-center p-2 border">Model Estimate</th>
                <th className="text-center p-2 border">Team Estimate</th>
                <th className="text-center p-2 border">Difference</th>
                <th className="text-center p-2 border">Risk</th>
                <th className="text-center p-2 border w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.tasks.map((task, index) => (
                <tr key={`row-${index}`} className="border-b">
                  <td className="p-2 border">
                    <div className="font-medium">{task.title}</div>
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
                    {task.storyPoint.toFixed(1)}
                  </td>
                  <td className="p-2 border text-center">
                    {task.teamEstimate !== undefined ? task.teamEstimate : "-"}
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
                    {task.difference !== undefined
                      ? task.difference.toFixed(1)
                      : "-"}
                  </td>
                  <td className="p-2 border text-center">
                    {getRiskIndicator(task)}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => openTaskDetail(index)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "white", fontSize: "11px" }}
                      />
                      <span
                        style={{
                          fontFamily: "Arial",
                          fontSize: "11px",
                        }}
                      >
                        View
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Past Stories Table
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Past User Stories</h3>
            <button
              onClick={togglePastStories}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
            >
              Back to Current Tasks
            </button>
          </div>

          {loadingPastStories ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : pastStories.length > 0 ? (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border">Title</th>
                  <th className="text-center p-2 border">Model Estimate</th>
                  <th className="text-center p-2 border">Team Estimate</th>
                  <th className="text-center p-2 border">Difference</th>
                  <th className="text-center p-2 border">Risk</th>
                  <th className="text-center p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {pastStories.map((task, index) => (
                  <tr key={`past-${index}`} className="border-b">
                    <td className="p-2 border">
                      <div className="font-medium">{task.title}</div>
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
                      {task.storyPoint.toFixed(1)}
                    </td>
                    <td className="p-2 border text-center">
                      {task.teamEstimate !== undefined
                        ? task.teamEstimate
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
                      {task.difference !== undefined
                        ? task.difference.toFixed(1)
                        : "-"}
                    </td>
                    <td className="p-2 border text-center">
                      {getRiskIndicator(task)}
                    </td>
                    <td className="p-2 border text-center text-sm">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-md">
              No past stories found
            </div>
          )}
        </div>
      )}

      {showDialog && selectedTaskIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Task Comparison</h3>

            <div className="mb-4">
              <h4 className="font-medium">
                {props.tasks[selectedTaskIndex].title}
              </h4>
              {props.tasks[selectedTaskIndex].description && (
                <p className="text-sm text-gray-500">
                  {props.tasks[selectedTaskIndex].description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-500 block">
                  Model Prediction
                </label>
                <div className="text-xl font-bold">
                  {props.tasks[selectedTaskIndex].storyPoint.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">
                  Confidence:{" "}
                  {props.tasks[selectedTaskIndex].confidence
                    ? `${(
                        props.tasks[selectedTaskIndex].confidence * 100
                      ).toFixed(0)}%`
                    : "N/A"}
                </div>
              </div>

              <div>
                <label
                  htmlFor="team-estimate"
                  className="text-sm text-gray-500 block"
                >
                  Team Estimate
                </label>
                <input
                  id="team-estimate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={teamEstimate}
                  onChange={(e) => setTeamEstimate(e.target.value)}
                  placeholder="Enter estimate"
                  className="w-full border rounded px-2 py-1 mt-1"
                  disabled={submitting}
                />
              </div>
            </div>

            {props.tasks[selectedTaskIndex].comparisonStatus && (
              <div
                className={`p-3 rounded-md mb-4 ${
                  props.tasks[selectedTaskIndex].riskLevel === "high"
                    ? "bg-red-100"
                    : props.tasks[selectedTaskIndex].riskLevel === "medium"
                    ? "bg-amber-100"
                    : "bg-green-100"
                }`}
              >
                <div className="font-semibold">
                  Status:{" "}
                  {getStatusText(
                    props.tasks[selectedTaskIndex].comparisonStatus
                  )}
                </div>
                {props.tasks[selectedTaskIndex].difference !== undefined && (
                  <div className="text-sm">
                    Difference:{" "}
                    {props.tasks[selectedTaskIndex].difference.toFixed(1)}{" "}
                    points
                  </div>
                )}
              </div>
            )}

            {updateError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-bold">Error</p>
                <p>{updateError}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDialog(false)}
                disabled={submitting}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEstimateSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Estimate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
