import { Card, CardContent } from "@/components_v2/ui/card";
import { Badge } from "@/components_v2/ui/badge";
import { Issue, Label, Priority } from "@/types/github";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case "High":
      return <ArrowUpCircle className="h-4 w-4 text-destructive" />;
    case "Medium":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "Low":
      return <ArrowDownCircle className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const getPriorityFromLabels = (labels: Label[]): Priority => {
  if (labels.some((l) => l.name.toLowerCase().includes("high"))) return "High";
  if (labels.some((l) => l.name.toLowerCase().includes("medium")))
    return "Medium";
  return "Low";
};

export default function IssueCard({ issue }: { issue: Issue }) {
  const priority = getPriorityFromLabels(issue.labels);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        key={issue.id}
        onClick={() => window.open(issue.html_url, "_blank")}
        className="p-2 cursor-pointer transition-transform hover:shadow-md hover:scale-[1.01]"
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <h3 className="text-lg font-semibold">{issue.title}</h3>
              {getPriorityIcon(priority)}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {issue.body}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {issue.labels.map((label) => (
                <Badge
                  key={label.id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    backgroundColor: `#${label.color}15`,
                    borderColor: `#${label.color}`,
                    color: `#${label.color}`,
                  }}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={issue.user.avatar_url}
                  alt={issue.user.login}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-muted-foreground">
                  {issue.user.login}
                </span>
              </div>
              <div className="flex gap-4 items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(issue.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {issue.comments}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
