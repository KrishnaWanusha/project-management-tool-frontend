import { getRepositoryIssues } from "@/lib/github";
import { getIssues } from "@/lib/issue";
import { Issue } from "@/types/github";
import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Handle tasks loaded from FileUploader
const handleTasksLoad = (loadedTasks: Issue[]) => {
  return loadedTasks?.map((task) => {
    if (task.teamEstimate !== undefined && task.teamEstimate !== null) {
      if (!task.storyPoint) return task;
      // Calculate difference and risk levels before sending to API
      const storyPoint = task.storyPoint;
      const teamEstimate = task.teamEstimate;

      // Calculate difference
      const difference = teamEstimate - storyPoint;
      const absDifference = Math.abs(difference);

      // Determine comparison status and risk level
      let comparisonStatus, riskLevel;

      if (absDifference > 5) {
        comparisonStatus =
          difference > 0 ? "severe-overestimate" : "severe-underestimate";
        riskLevel = "high";
      } else if (absDifference >= 3) {
        comparisonStatus =
          difference > 0 ? "mild-overestimate" : "mild-underestimate";
        riskLevel = "medium";
      } else if (absDifference > 0) {
        comparisonStatus =
          difference > 0 ? "slight-overestimate" : "slight-underestimate";
        riskLevel = "low";
      } else {
        comparisonStatus = "accurate";
        riskLevel = "low";
      }

      return {
        ...task,
        difference,
        comparisonStatus,
        riskLevel,
      };
    }

    return task;
  });
};

interface IssuesContextType {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  isLoading: boolean;
  fetchIssues: () => void;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const IssuesProvider = ({
  children,
  owner,
  repoName,
}: {
  children: React.ReactNode;
  owner: string;
  repoName: string;
}) => {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIssues = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const [githubIssues, dbIssuesRaw] = await Promise.all([
        getRepositoryIssues(session.accessToken, owner, repoName),
        getIssues(`${owner}/${repoName}`),
      ]);

      const dbIssues = Array.isArray(dbIssuesRaw?.data)
        ? dbIssuesRaw?.data
        : [];

      const dbMap = new Map(
        dbIssues.map((issue: any) => [issue.githubId, issue])
      );

      const merged = githubIssues.map((issue: any) => {
        const dbIssue = dbMap.get(issue.id);
        return dbIssue ? { ...issue, ...dbIssue } : issue;
      });

      setIssues(handleTasksLoad(merged));
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, owner, repoName]);

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <IssuesContext.Provider
      value={{ issues, setIssues, isLoading, fetchIssues }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context)
    throw new Error("useIssues must be used within an IssuesProvider");
  return context;
};
