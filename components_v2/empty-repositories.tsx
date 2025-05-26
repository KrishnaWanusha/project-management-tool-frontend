import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components_v2/ui/button";
import Link from "next/link";

export function EmptyRepositories() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <GitHubLogoIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No Repositories Found</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        We couldn't find any GitHub repositories associated with your account.
        Make sure you have repositories and have granted the necessary
        permissions.
      </p>
      <Button asChild>
        <Link
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create a Repository
        </Link>
      </Button>
    </div>
  );
}
