"use client";

import { buildRoute } from "@helpers/global";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl py-16 sm:py-28 lg:py-32">
      <div className="text-center">
        <h1 className="text-5xl font-semibold text-gray-900 sm:text-7xl">
          AI Insights to Transform Project Management
        </h1>
        <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl/8">
          Transforming complex discussions into actionable summaries and precise
          project plans, faster and more efficiently
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => router.push(buildRoute("/upload-meeting"))}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
