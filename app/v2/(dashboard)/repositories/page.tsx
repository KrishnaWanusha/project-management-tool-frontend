"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserRepositories } from "@/lib/github";
import { Repository } from "@/types/github";
import { RepositoryGrid } from "@/components_v2/repository-grid";
import { EmptyRepositories } from "@/components_v2/empty-repositories";
import { Button } from "@/components_v2/ui/button";
import { Input } from "@/components_v2/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Header } from "@/components_v2/layout/header";
import { buildV2Route } from "@helpers/global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components_v2/ui/select";
import { languageColors } from "@/components_v2/repository-card";

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageFilter, setLanguageFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");

  const uniqueLanguages = Array.from(
    new Set(repositories.map((repo) => repo.language).filter(Boolean))
  );

  const getLanguageColor = (lang: string) =>
    languageColors[lang] || languageColors.default;

  const fetchRepositories = useCallback(async () => {
    setIsLoading(true);
    try {
      if (session?.accessToken) {
        const repos = await getUserRepositories(session.accessToken);
        setRepositories(repos);
        setFilteredRepos(repos);
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(buildV2Route("/login"));
    }

    if (session?.accessToken) {
      fetchRepositories();
    }
  }, [session, status, router, fetchRepositories]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRepos(repositories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRepos(
        repositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(query) ||
            (repo.description && repo.description.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, repositories]);

  useEffect(() => {
    let filtered = repositories;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          (repo.description && repo.description.toLowerCase().includes(query))
      );
    }

    if (languageFilter) {
      filtered = filtered.filter((repo) => repo.language === languageFilter);
    }

    if (visibilityFilter) {
      filtered = filtered.filter((repo) =>
        visibilityFilter === "public" ? !repo.private : repo.private
      );
    }

    setFilteredRepos(filtered);
  }, [searchQuery, repositories, languageFilter, visibilityFilter]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-lg font-medium">Loading repositories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-6 mx-auto">
          <h1 className="text-3xl font-bold mx-auto">Repositories</h1>
          <p className="text-muted-foreground mx-auto">
            Select a repository to start managing your project
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search repositories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchRepositories}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select
            value={languageFilter}
            onValueChange={(value) =>
              setLanguageFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {uniqueLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${getLanguageColor(
                        lang
                      )}`}
                    />
                    {lang}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={visibilityFilter}
            onValueChange={(value) =>
              setVisibilityFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredRepos.length > 0 ? (
          <RepositoryGrid repositories={filteredRepos} />
        ) : (
          <EmptyRepositories />
        )}
      </div>
    </div>
  );
}
