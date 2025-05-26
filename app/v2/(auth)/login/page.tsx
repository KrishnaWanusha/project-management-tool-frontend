"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components_v2/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 shadow-lg">
              <GitHubLogoIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Vortexa
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Streamline your GitHub project management workflow
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg">
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Access your GitHub repositories
                </span>
              </li>
              <li className="flex items-center text-sm">
                <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Generate project documentation
                </span>
              </li>
              <li className="flex items-center text-sm">
                <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Create and manage tasks
                </span>
              </li>
              <li className="flex items-center text-sm">
                <span className="mr-2 text-blue-500 dark:text-blue-400">✓</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Assess project risks and skills
                </span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() =>
              signIn("github", { callbackUrl: "/v2/repositories" })
            }
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 rounded-lg h-11 shadow-md hover:shadow-lg"
          >
            <GitHubLogoIcon className="mr-2 h-5 w-5" />
            Login with GitHub
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          By continuing, you agree to Vortexa&apos;s Terms of Service and
          Privacy Policy
        </div>
      </div>
    </div>
  );
}
