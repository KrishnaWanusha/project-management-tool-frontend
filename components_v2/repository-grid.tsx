import { Repository } from "@/types/github";
import { RepositoryCard } from "@/components_v2/repository-card";

interface RepositoryGridProps {
  repositories: Repository[];
}

export function RepositoryGrid({ repositories }: RepositoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </div>
  );
}
