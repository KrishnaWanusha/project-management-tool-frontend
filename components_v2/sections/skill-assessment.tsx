import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { Activity, GitPullRequest, LineChart } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useSession } from "next-auth/react";
import { analyzeRepository } from "@/lib/pr-analyze";

type Metrics = {
  cbo: number;
  cboModified: number;
  fanin: number;
  fanout: number;
  wmc: number;
  dit: number;
  noc: number;
  rfc: number;
  lcom: number;
  lcom_star: number;
  tcc: number;
  loc: number;
  returnQty: number;
  loopQty: number;
  comparisonsQty: number;
  tryCatchQty: number;
  stringLiteralsQty: number;
  numbersQty: number;
  assignmentsQty: number;
  mathOperationsQty: number;
  variablesQty: number;
  maxNestedBlocksQty: number;
};

type PullRequest = {
  pr_number: number;
  title: string;
  unsupported_files: string[];
  quality_score: number | string;
  ml_prediction: string;
  metrics?: Metrics;
};

export function SkillAssessment({
  repoName,
  owner,
}: {
  repoName: string;
  owner: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);

  const analyse = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const data = await analyzeRepository(
        session.accessToken,
        owner,
        repoName
      );
      setPullRequests(
        Array.isArray(data?.pull_requests) ? data?.pull_requests : []
      );
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, owner, repoName]);

  useEffect(() => {
    analyse();
  }, [analyse]);

  const analyzedPRs = useMemo(
    () => pullRequests.filter((pr) => typeof pr.quality_score === "number"),
    [pullRequests]
  );

  const qualityDistribution = useMemo(() => {
    const total = analyzedPRs.length;
    const good = analyzedPRs.filter((pr) => pr.ml_prediction === "Good").length;
    return [
      { name: "Good", value: (good / total) * 100, color: "#10b981" },
      {
        name: "Needs Improvement",
        value: ((total - good) / total) * 100,
        color: "#f59e0b",
      },
    ];
  }, [analyzedPRs]);

  const complexityTrend = useMemo(
    () =>
      analyzedPRs.map((pr) => ({
        pr: `PR-${pr.pr_number}`,
        complexity: pr.metrics?.cbo || 0,
        loc: pr.metrics?.loc || 0,
        quality: typeof pr.quality_score === "number" ? pr.quality_score : 0,
      })),
    [analyzedPRs]
  );

  const averageMetrics = useMemo(() => {
    if (analyzedPRs.length === 0) return null;

    const metrics = analyzedPRs.reduce(
      (acc, pr) => {
        if (!pr.metrics) return acc;
        return {
          loc: acc.loc + pr.metrics.loc,
          complexity: acc.complexity + pr.metrics.cboModified,
          variables: acc.variables + pr.metrics.variablesQty,
        };
      },
      { loc: 0, complexity: 0, variables: 0 }
    );

    return {
      loc: Math.round(metrics.loc / analyzedPRs.length),
      complexity: Math.round(metrics.complexity / analyzedPRs.length),
      variables: Math.round(metrics.variables / analyzedPRs.length),
    };
  }, [analyzedPRs]);

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading analysis...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Pull Request Analysis
        </h2>
        <p className="text-muted-foreground">
          Code quality and complexity metrics across pull requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Analysis Coverage</CardTitle>
              <GitPullRequest className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[200px]">
              <div className="text-4xl font-bold">
                {analyzedPRs.length}/{pullRequests.length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">PRs Analyzed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quality Distribution</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {qualityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${Math.round(value as number)}%`,
                      "Percentage",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Quality Trends</CardTitle>
            <LineChart className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription>
            Quality score and complexity over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={complexityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pr" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke="#10b981"
                  name="Quality Score"
                />
                <Line
                  type="monotone"
                  dataKey="complexity"
                  stroke="#f59e0b"
                  name="Complexity"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {averageMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Avg. Lines of Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMetrics.loc}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Avg. Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageMetrics.complexity}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Avg. Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageMetrics.variables}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
