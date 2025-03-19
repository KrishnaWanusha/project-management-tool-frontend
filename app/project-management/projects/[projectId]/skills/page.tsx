"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useGetProject } from "@services/project";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { projectId: id } = useParams();
  const { data: state, loading: prjLoading, mutate } = useGetProject(id as string);
  useEffect(() => {
    // Get the username from the URL query parameters or localStorage
    const params = new URLSearchParams(window.location.search);
    // const githubUser = params.get("username");
    const githubUser = state?.project?.owner;

    if (githubUser) {
      
    // window.location.href = `http://127.0.0.1:8000/analyze_all_repos?username=${githubUser}`;
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
      
      const response = await axios.get('http://127.0.0.1:8000/analyze_all_repos?username=DulanyaSevindi', { timeout: 300000})
      console.log('response', response)
  
      // Set mock data to state
      setRepoData(response?.data);
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
                            {/* <th className="border px-4 py-2">ML Prediction</th> */}
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
                              {/* <td
                                className={`border px-4 py-2 font-bold ${
                                  pr.ml_prediction === "Good"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {pr.ml_prediction}
                              </td> */}
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