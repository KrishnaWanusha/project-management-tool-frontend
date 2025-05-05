import { Button } from "@/components_v2/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import {
  CheckSquare,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components_v2/ui/badge";

export function TaskCreation() {
  const dummyTasks = [
    {
      id: 1,
      title: "Update README with installation instructions",
      priority: "High",
      status: "To Do",
    },
    {
      id: 2,
      title: "Fix broken links in documentation",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Review pull requests",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Add unit tests for new features",
      priority: "Medium",
      status: "To Do",
    },
    {
      id: 5,
      title: "Deploy to staging environment",
      priority: "Low",
      status: "To Do",
    },
  ];

  const getPriorityIcon = (priority: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Creation</h2>
          <p className="text-muted-foreground">
            Create and manage tasks for your repository
          </p>
        </div>
        <Button>
          <CheckSquare className="mr-2 h-4 w-4" />
          Create New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">To Do</CardTitle>
            <CardDescription>Tasks that need to be completed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dummyTasks
              .filter((task) => task.status === "To Do")
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-muted/40 rounded-md border"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{task.title}</span>
                    {getPriorityIcon(task.priority)}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">In Progress</CardTitle>
            <CardDescription>Tasks currently being worked on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dummyTasks
              .filter((task) => task.status === "In Progress")
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-muted/40 rounded-md border"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{task.title}</span>
                    {getPriorityIcon(task.priority)}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Completed</CardTitle>
            <CardDescription>Tasks that have been finished</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-center pt-10 pb-10">
            <p className="text-muted-foreground">No completed tasks yet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
