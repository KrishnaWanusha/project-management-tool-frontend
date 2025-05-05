"use client";

import { useEffect } from "react";
import { Button } from "@/components_v2/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { buildV2Route } from "@helpers/global";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(buildV2Route("/repositories"));
    }
  }, [session, status, router]);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GitHubLogoIcon className="h-6 w-6" />
            <span className="font-semibold text-xl">ProjectHub</span>
          </div>
          <Button asChild>
            <Link href="/v2/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Project Management
              <br />
              for GitHub Repositories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Streamline your development workflow with integrated document
              generation, task management, risk assessment, and skill tracking.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/v2/login">
                <GitHubLogoIcon className="mr-2 h-5 w-5" />
                Login with GitHub
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">
                  Document Generation
                </h3>
                <p className="text-muted-foreground">
                  Automatically generate professional documentation for your
                  repositories.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Task Creation</h3>
                <p className="text-muted-foreground">
                  Create, assign and track tasks directly linked to your GitHub
                  repositories.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Identify and mitigate potential risks in your codebase and
                  development process.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Skill Assessment</h3>
                <p className="text-muted-foreground">
                  Track team skills and identify training needs based on project
                  requirements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ProjectHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
