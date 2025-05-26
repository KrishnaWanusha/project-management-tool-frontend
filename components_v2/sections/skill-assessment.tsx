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

const metricLabels = {
  cbo: "Coupling Between Objects",
  cboModified: "Modified Coupling",
  fanin: "Fan-In (Incoming Calls)",
  fanout: "Fan-Out (Outgoing Calls)",
  wmc: "Weighted Methods per Class",
  dit: "Depth of Inheritance Tree",
  noc: "Number of Children",
  rfc: "Response for a Class",
  lcom: "Lack of Cohesion (LCOM)",
  lcom_star: "Normalized LCOM",
  tcc: "Tight Class Cohesion",
  loc: "Lines of Code",
  returnQty: "Return Statements",
  loopQty: "Loop Count",
  comparisonsQty: "Comparison Operators",
  tryCatchQty: "Try-Catch Blocks",
  stringLiteralsQty: "String Literals",
  numbersQty: "Numeric Literals",
  assignmentsQty: "Assignment Operations",
  mathOperationsQty: "Math Operations",
  variablesQty: "Declared Variables",
  maxNestedBlocksQty: "Max Nested Blocks",
};

function renderMetricCard(key: keyof typeof metricLabels, value: number) {
  const label = metricLabels[key] || key;
  return (
    <div
      key={key}
      className="transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 hover:text-white rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
    >
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

export function SkillAssessment({
  repoName,
  owner,
}: {
  repoName: string;
  owner: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [pullRequests, setPullRequests] = useState<any[]>([]);

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
    if (total === 0) return [];
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
      <div className="text-center py-10 text-muted-foreground animate-pulse">
        Analyzing repository...
      </div>
    );
  }

  const cardClass =
    "p-3 bg-muted/40 rounded-md border-2 border-white dark:border-white/30 shadow-sm";

  return (
    <div className="space-y-10 px-4">
      <div className="text-left space-y-1">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Pull Request Analysis
        </h2>
        <p className="text-muted-foreground text-lg">
          Visual insights into code quality and complexity trends
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <GitPullRequest /> Analysis Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-center">
              {analyzedPRs.length}/{pullRequests.length}
            </div>
            <p className="text-center text-muted-foreground mt-1">
              Pull Requests Analyzed
            </p>
          </CardContent>
        </Card>

        {qualityDistribution.length > 0 && (
          <Card className={`md:col-span-2 ${cardClass}`}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity /> Quality Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
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
            </CardContent>
          </Card>
        )}
      </div>

      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <LineChart /> Quality Trends
          </CardTitle>
          <CardDescription>
            Track how quality and complexity change over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
        </CardContent>
      </Card>

      {averageMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>💻 Average Lines of Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageMetrics.loc}</div>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>📈 Average Complexity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {averageMetrics.complexity}
              </div>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>📎 Average Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {averageMetrics.variables}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyzedPRs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold"> Detailed PR Metrics</h3>
          {analyzedPRs.map((pr) => (
            <Card key={pr.pr_number} className={cardClass}>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  PR #{pr.pr_number}: {pr.title}
                </CardTitle>
                <CardDescription>
                  Quality Score:{" "}
                  <span className="font-bold">
                    {typeof pr.quality_score === "number"
                      ? `${pr.quality_score.toFixed(2)}%`
                      : pr.quality_score}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pr.metrics ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(pr.metrics).map(([key, value]) =>
                      renderMetricCard(
                        key as keyof typeof metricLabels,
                        value as number
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No metrics available.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
