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
            <span className="font-semibold text-xl">Vortexa</span>
          </div>
          <Button asChild  variant="gradient">
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
            <Button asChild size="lg" className="rounded-full px-8" variant="gradient">
              <Link href="/v2/login">
                <GitHubLogoIcon className="mr-2 h-5 w-5" />
                Login with GitHub
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Vortexa. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
