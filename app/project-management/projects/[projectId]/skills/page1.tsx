"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const params = useParams()

  const handleLogin = () => {
    // Redirect to GitHub login
    window.location.href = "http://127.0.0.1:8000/login";

    // Set a timeout to navigate to dashboard after 10 seconds
    setTimeout(() => {
      router.push(`project-management/projcts/${params?.projectId}/prAnalysis`);
    }, 10000); // 10 seconds delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">GitHub Repo Quality Analyze Skill assement</h1>

      <button
        onClick={handleLogin}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login with GitHub
      </button>
    </div>
  );
}