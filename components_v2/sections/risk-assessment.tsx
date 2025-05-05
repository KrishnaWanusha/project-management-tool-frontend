import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { Button } from "@/components_v2/ui/button";
import {
  AlertTriangle,
  HelpCircle,
  Shield,
  Lock,
  FileWarning,
  AlarmCheck,
  Code,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Security", value: 75 },
  { name: "Code Quality", value: 60 },
  { name: "Dependencies", value: 40 },
  { name: "Performance", value: 85 },
  { name: "Documentation", value: 30 },
];

const getBarColor = (value: number) => {
  if (value < 50) return "hsl(var(--destructive))";
  if (value < 70) return "hsl(38, 92%, 50%)";
  return "hsl(142, 71%, 45%)";
};

export function RiskAssessment() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Risk Assessment</h2>
        <p className="text-muted-foreground">
          Evaluate potential risks and get recommendations for your project
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Overall Risk Score</CardTitle>
          <CardDescription>Based on repository analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Score</span>
              <span className="text-sm font-medium">62/100</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-center mt-4">
              <div className="flex-1 p-3 border rounded-md">
                <Shield className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                <div className="text-sm font-medium">Medium Risk</div>
                <div className="text-xs text-muted-foreground">
                  Some issues found
                </div>
              </div>
              <div className="flex-1 p-3 border rounded-md">
                <AlarmCheck className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <div className="text-sm font-medium">Last Checked</div>
                <div className="text-xs text-muted-foreground">
                  Today at 10:30 AM
                </div>
              </div>
              <div className="flex-1 p-3 border rounded-md">
                <Code className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <div className="text-sm font-medium">Files Analyzed</div>
                <div className="text-xs text-muted-foreground">127 files</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
            <CardDescription>Assessment scores by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value}/100`, "Score"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.value)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Risks Identified</CardTitle>
            <CardDescription>
              Issues that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted/40 rounded-md border">
                <div className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">
                      Security vulnerabilities in dependencies
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Multiple outdated packages with known vulnerabilities
                      detected
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-md border">
                <div className="flex items-start gap-2">
                  <FileWarning className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">
                      Incomplete documentation
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Key API functions are missing documentation
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-md border">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">
                      Code complexity in key modules
                    </span>
                    <span className="text-sm text-muted-foreground">
                      High cyclomatic complexity detected in 3 core files
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button>
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
