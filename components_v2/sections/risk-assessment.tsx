"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  OctagonAlert,
  TriangleAlert,
  LayoutList,
  Eye,
  Loader2,
  CircleCheckBig,
} from "lucide-react";
import { Issue } from "@/types/github";
import storyPointsApi from "@services/storypoint";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

// Get risk indicator
const getRiskIndicator = (task: any) => {
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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Dialog animation variants
const dialogVariants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel) {
    case "high":
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case "medium":
      return <AlertCircle className="w-5 h-5 text-amber-600" />;
    default:
      return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
};

export function RiskAssessment({
  issues,
  isLoading,
  fetchIssues,
}: {
  issues: Issue[];
  isLoading?: boolean;
  fetchIssues?: () => void;
}) {
  const { showToast } = useToast();
  const { repoName, owner } = useParams<{ repoName: string; owner: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnalyzeRisks = useCallback(async () => {
    const stories = (issues ?? [])
      ?.filter((f) => !f.storyPoint)
      ?.map((issue) => ({
        title: issue.title,
        description: issue.body,
        githubId: issue.id,
        repository: `${owner}/${repoName}`,
      }));

    if (!(stories?.length > 0)) {
      showToast(
        "All issues already have story points assigned",
        "No issues to analyze",
        "info"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await storyPointsApi.batchEstimate(stories);
      if (response?.data?.length > 0) {
        fetchIssues?.();
      }
    } catch (error) {
      console.log("error", error);
      showToast("Analyzing Risk Failed", "Error", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchIssues, issues, owner, repoName, showToast]);

  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(
    null
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [teamEstimate, setTeamEstimate] = useState<string>("");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const openTaskDetail = (index: number) => {
    setSelectedTaskIndex(index);
    const currentEstimate = issues[index].teamEstimate?.toString() || "";
    setTeamEstimate(currentEstimate);
    setShowDialog(true);
    setUpdateError(null);
  };

  const handleEstimateSubmit = useCallback(async () => {
    if (!teamEstimate) {
      showToast("No team estimation entered", "Error", "error");
      return;
    }

    try {
      setSubmitting(true);
      if (selectedTaskIndex === null) return;
      const response = await storyPointsApi.updateTeamEstimate(
        { ...issues[selectedTaskIndex], repository: `${owner}/${repoName}` },
        parseInt(teamEstimate ?? 0, 10)
      );
      if (response?.data) {
        fetchIssues?.();
      }
    } catch (error) {
      console.log("error", error);
      showToast("Analyzing Risk Failed", "Error", "error");
    } finally {
      setSubmitting(false);
    }
  }, [
    fetchIssues,
    issues,
    owner,
    repoName,
    selectedTaskIndex,
    showToast,
    teamEstimate,
  ]);

  const summaryStats = useMemo(() => {
    const dataToAnalyze = issues;

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
  }, [issues]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500">Loading risk assessment...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-white">
          Risk Assessment
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Evaluate potential risks and get recommendations for your project
        </p>
      </div>

      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Risk Summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on repository analysis
              </p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-card transition-all hover:shadow-md">
                <OctagonAlert
                  className="h-6 w-6 mb-2 text-orange-500"
                  color="#9a0404"
                />
                <div className="text-sm font-medium dark:text-white">
                  High Risk Tasks
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {summaryStats?.highRisk}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-card transition-all hover:shadow-md">
                <TriangleAlert
                  className="h-6 w-6 mb-2 text-green-500"
                  color="#eb510f"
                />
                <div className="text-sm font-medium dark:text-white">
                  Medium Risk Tasks
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {summaryStats?.mediumRisk}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-card transition-all hover:shadow-md">
                <TriangleAlert
                  className="h-6 w-6 mb-2 text-blue-500"
                  color="#e0e413"
                />
                <div className="text-sm font-medium dark:text-white">
                  Low Risk Tasks
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {summaryStats?.lowRisk}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-card transition-all hover:shadow-md">
                <CircleCheckBig
                  className="h-6 w-6 mb-2 text-blue-500"
                  color="#1dc217"
                />
                <div className="text-sm font-medium dark:text-white">
                  Accurate Estimates
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {summaryStats?.accurate}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-card transition-all hover:shadow-md">
                <LayoutList
                  className="h-6 w-6 mb-2 text-blue-500"
                  color="#29afec"
                />
                <div className="text-sm font-medium dark:text-white">
                  Not Estimated
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {summaryStats?.notEstimated}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAnalyzeRisks}
            disabled={isSubmitting}
            variant="gradient"
          >
            {isSubmitting ? "Analyzing..." : "Analyze Risks"}
          </Button>
        </div>
        {/* Issues Table */}
        <div className="bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Model Est.
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Team Est.
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Diff
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(issues ?? [])?.map((issue, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {issue.title}
                      </div>
                      {issue?.body && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {issue.body ?? issue?.body}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                      {issue.storyPoint ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                      {issue.teamEstimate ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                      {issue.difference !== undefined
                        ? issue.difference.toFixed(1)
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                      {getRiskIndicator(issue)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {issues?.length > 0 ? (
                        <Button
                          variant="gradient"
                          onClick={() => openTaskDetail(index)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showDialog && selectedTaskIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative shadow-2xl"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDialog(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                disabled={submitting}
              >
                <X className="w-6 h-6" />
              </motion.button>

              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Task Comparison
              </h3>

              <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {issues[selectedTaskIndex].title}
                </h4>
                {issues[selectedTaskIndex].body && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {issues[selectedTaskIndex].body}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl"
                >
                  <label className="text-sm text-blue-600 dark:text-blue-400 block mb-1">
                    Model Prediction
                  </label>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {issues[selectedTaskIndex]?.storyPoint?.toFixed(1) ?? "-"}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Confidence:{" "}
                    {issues?.[selectedTaskIndex]?.confidence
                      ? `${(
                          (issues?.[selectedTaskIndex]?.confidence ?? 1) * 100
                        ).toFixed(0)}%`
                      : "N/A"}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl"
                >
                  <label
                    htmlFor="team-estimate"
                    className="text-sm text-purple-600 dark:text-purple-400 block mb-1"
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
                    className="w-full bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-700 rounded-lg px-3 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={submitting}
                  />
                </motion.div>
              </div>

              {issues[selectedTaskIndex]?.comparisonStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                    issues[selectedTaskIndex].riskLevel === "high"
                      ? "bg-red-50 dark:bg-red-900/20"
                      : issues[selectedTaskIndex].riskLevel === "medium"
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : "bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  {getRiskIcon(issues[selectedTaskIndex].riskLevel ?? "low")}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getStatusText(
                        issues[selectedTaskIndex].comparisonStatus
                      )}
                    </div>
                    {issues[selectedTaskIndex].difference !== undefined && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Difference:{" "}
                        {issues?.[selectedTaskIndex]?.difference?.toFixed(1)}{" "}
                        points
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {updateError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6"
                >
                  <p className="font-semibold text-red-700 dark:text-red-300">
                    Error
                  </p>
                  <p className="text-red-600 dark:text-red-300 mt-1">
                    {updateError}
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDialog(false)}
                  disabled={submitting}
                  className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEstimateSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-lg text-sm font-medium  transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        ◌
                      </motion.span>
                      Saving...
                    </span>
                  ) : (
                    "Save Estimate"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
