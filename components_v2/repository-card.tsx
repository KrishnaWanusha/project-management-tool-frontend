import { Repository } from "@/types/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { GitForkIcon, StarIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components_v2/ui/badge";

interface RepositoryCardProps {
  repository: Repository;
  className?: string;
}

// Helper to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Language color map
const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  Go: "bg-blue-400",
  Rust: "bg-orange-500",
  "C++": "bg-pink-500",
  C: "bg-gray-500",
  "C#": "bg-purple-500",
  Ruby: "bg-red-600",
  PHP: "bg-indigo-400",
  HTML: "bg-orange-600",
  CSS: "bg-blue-600",
  Shell: "bg-green-600",
  default: "bg-gray-400",
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Link
      href={`/v2/dashboard/${repository.name}/${repository.owner.login}/document-generation`}
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold truncate">
              {repository.name}
            </CardTitle>
            {repository.private ? (
              <Badge variant="outline">Private</Badge>
            ) : null}
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {repository.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {repository.language ? (
            <div className="flex items-center gap-1">
              <div
                className={`h-3 w-3 rounded-full ${
                  languageColors[repository.language] || languageColors.default
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {repository.language}
              </span>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground pt-0">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <StarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{repository.stargazers_count}</span>
            </div>
            <div className="flex items-center">
              <GitForkIcon className="h-3.5 w-3.5 mr-1" />
              <span>{repository.forks_count}</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-3.5 w-3.5 mr-1" />
              <span>{repository.watchers_count}</span>
            </div>
          </div>
          <div>Updated {formatDate(repository.updated_at)}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}
