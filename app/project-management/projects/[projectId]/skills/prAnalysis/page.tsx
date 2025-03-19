"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the username from the URL query parameters or localStorage
    const params = new URLSearchParams(window.location.search);
    const githubUser = params.get("username");

    if (githubUser) {
      localStorage.setItem("github_username", githubUser);
      setUsername(githubUser);
    } else {
      const storedUsername = localStorage.getItem("github_username");
      if (!storedUsername) {
        router.push("/"); // Redirect to login if no username found
        return;
      }
      setUsername(storedUsername);
    }

    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
  
    const storedUsername = localStorage.getItem("github_username");
    if (!storedUsername) {
      router.push("/"); // Redirect if username is not available
      return;
    }
  
    try {
      const response = axios.get('http://127.0.0.1:8000/analyze_all_repos?username=DulanyaSevindi')
      console.log('response', response)
      // 🔹 Simulated API Response Data (with more repositories)
      const mockData = {
        username: "DulanyaSevindi",
        repositories: [
          {
            repo_name: "DulanyaSevindi/PersonalPortfolio",
            pull_requests: [
              {
                pr_number: 3,
                title: "Update UI components",
                unsupported_files: ["src/assets/logo.png", "src/assets/bg.jpg"],
                quality_score: 85,
                ml_prediction: "Good",
                metrics: {
                  cbo: 1,
                  wmc: 10,
                  loc: 250,
                  returnQty: 3,
                  loopQty: 2,
                  assignmentsQty: 15,
                  maxNestedBlocksQty: 3,
                },
              },
            ],
          },
          {
            repo_name: "DulanyaSevindi/EcomMobile",
            pull_requests: [
              {
                pr_number: 2,
                title: "Added new checkout feature",
                unsupported_files: ["app/src/main/res/layout/checkout.xml"],
                quality_score: 79,
                ml_prediction: "Good",
                metrics: {
                  cbo: 0,
                  wmc: 5,
                  loc: 300,
                  returnQty: 5,
                  loopQty: 4,
                  assignmentsQty: 20,
                  maxNestedBlocksQty: 5,
                },
              },
              {
                pr_number: 1,
                title: "Fixed login bug",
                unsupported_files: ["app/src/main/res/layout/login.xml"],
                quality_score: 65,
                ml_prediction: "Bad",
                metrics: {
                  cbo: 3,
                  wmc: 7,
                  loc: 180,
                  returnQty: 2,
                  loopQty: 1,
                  assignmentsQty: 10,
                  maxNestedBlocksQty: 2,
                },
              },
            ],
          },
          {
            repo_name: "DulanyaSevindi/AI-Chatbot",
            pull_requests: [
              {
                pr_number: 5,
                title: "Improved NLP Processing",
                unsupported_files: ["data/training_set.csv"],
                quality_score: 91,
                ml_prediction: "Good",
                metrics: {
                  cbo: 2,
                  wmc: 15,
                  loc: 400,
                  returnQty: 6,
                  loopQty: 5,
                  assignmentsQty: 25,
                  maxNestedBlocksQty: 4,
                },
              },
              {
                pr_number: 4,
                title: "Fixed response delay issue",
                unsupported_files: ["src/config/config.json"],
                quality_score: 88,
                ml_prediction: "Good",
                metrics: {
                  cbo: 1,
                  wmc: 9,
                  loc: 350,
                  returnQty: 4,
                  loopQty: 3,
                  assignmentsQty: 18,
                  maxNestedBlocksQty: 3,
                },
              },
            ],
          },
          {
            repo_name: "DulanyaSevindi/MachineLearningModels",
            pull_requests: [
              {
                pr_number: 7,
                title: "Added Support Vector Machine model",
                unsupported_files: ["models/svm_model.pkl"],
                quality_score: 95,
                ml_prediction: "Good",
                metrics: {
                  cbo: 3,
                  wmc: 20,
                  loc: 500,
                  returnQty: 8,
                  loopQty: 6,
                  assignmentsQty: 30,
                  maxNestedBlocksQty: 6,
                },
              },
            ],
          },
          {
            repo_name: "DulanyaSevindi/OpenSource-Contributions",
            pull_requests: [
              {
                pr_number: 10,
                title: "Fixed security vulnerabilities",
                unsupported_files: ["src/security/auth.py"],
                quality_score: 82,
                ml_prediction: "Good",
                metrics: {
                  cbo: 4,
                  wmc: 14,
                  loc: 380,
                  returnQty: 5,
                  loopQty: 2,
                  assignmentsQty: 22,
                  maxNestedBlocksQty: 4,
                },
              },
              {
                pr_number: 9,
                title: "Refactored database queries",
                unsupported_files: ["src/db/queries.sql"],
                quality_score: 75,
                ml_prediction: "Good",
                metrics: {
                  cbo: 2,
                  wmc: 10,
                  loc: 320,
                  returnQty: 4,
                  loopQty: 1,
                  assignmentsQty: 15,
                  maxNestedBlocksQty: 3,
                },
              },
              {
                pr_number: 8,
                title: "Updated API endpoints",
                unsupported_files: ["src/api/endpoints.py"],
                quality_score: 60,
                ml_prediction: "Bad",
                metrics: {
                  cbo: 5,
                  wmc: 8,
                  loc: 250,
                  returnQty: 2,
                  loopQty: 1,
                  assignmentsQty: 12,
                  maxNestedBlocksQty: 2,
                },
              },
            ],
          },
        ],
      };
  
      // Simulate network delay (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Set mock data to state
      setRepoData(mockData);
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching repository analysis.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center">GitHub Repo Dashboard</h1>
        <p className="text-center text-gray-700">Welcome, {username}!</p>

        {/* Refresh Button */}
        <button
          onClick={fetchAnalysis}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
        >
          Refresh Data
        </button>

        {/* Loading State */}
        {loading && <p className="text-center mt-4">Loading repository analysis...</p>}

        {/* Error Handling */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Show Repo Data */}
        {repoData && (
          <div className="mt-6">
            {repoData.repositories.length > 0 ? (
              repoData.repositories.map((repo: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded mt-4 shadow">
                  <h2 className="text-lg font-bold">{repo.repo_name}</h2>
                  {typeof repo.pull_requests === "string" ? (
                    <p className="text-gray-700 mt-2">{repo.pull_requests}</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border mt-4">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border px-4 py-2">PR #</th>
                            <th className="border px-4 py-2">Title</th>
                            <th className="border px-4 py-2">Quality Score</th>
                            <th className="border px-4 py-2">ML Prediction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repo.pull_requests.map((pr: any, prIndex: number) => (
                            <tr key={prIndex} className="text-center">
                              <td className="border px-4 py-2">{pr.pr_number}</td>
                              <td className="border px-4 py-2">{pr.title}</td>
                              <td className="border px-4 py-2 font-bold">
                                {pr.quality_score ? `${pr.quality_score}%` : "N/A"}
                              </td>
                              <td
                                className={`border px-4 py-2 font-bold ${
                                  pr.ml_prediction === "Good"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {pr.ml_prediction}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-700 mt-4">No repositories found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}