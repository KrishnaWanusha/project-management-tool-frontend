import { Repository } from "@/types/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { GitForkIcon, StarIcon, LockIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RepositoryCardProps {
  repository: Repository;
  className?: string;
}

export function RepositoryCard({ repository, className }: RepositoryCardProps) {
  return (
    <Link href={`/v2/dashboard/${repository.name}/document-generation`}>
      <Card
        className={cn(
          "h-full transition-all hover:border-primary/50 hover:shadow-md",
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold line-clamp-1">
              {repository.name}
            </CardTitle>
            {repository.private && (
              <LockIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {repository.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {repository.owner.login}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex w-full justify-between">
            <span>
              Updated {formatDistanceToNow(new Date(repository.updated_at))} ago
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <StarIcon className="mr-1 h-3.5 w-3.5" />
                <span>0</span>
              </div>
              <div className="flex items-center">
                <GitForkIcon className="mr-1 h-3.5 w-3.5" />
                <span>0</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
