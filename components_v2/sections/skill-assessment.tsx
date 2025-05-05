import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { Button } from "@/components_v2/ui/button";
import { Progress } from "@/components_v2/ui/progress";
import { BookOpenCheck, Award, Users, FileSpreadsheet } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const SKILLS_DATA = [
  { name: "JavaScript", value: 65, color: "#f1c40f" },
  { name: "TypeScript", value: 45, color: "#3498db" },
  { name: "React", value: 55, color: "#1abc9c" },
  { name: "Node.js", value: 30, color: "#27ae60" },
  { name: "HTML/CSS", value: 75, color: "#e74c3c" },
];

export function SkillAssessment() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Skill Assessment</h2>
        <p className="text-muted-foreground">
          Analyze skills required for your project and team competencies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Required Skills</CardTitle>
              <Award className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Based on repository analysis
            </p>
            <div className="space-y-4">
              {SKILLS_DATA.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {skill.value}%
                    </span>
                  </div>
                  <Progress
                    value={skill.value}
                    className="h-2"
                    style={
                      {
                        "--theme-primary": skill.color,
                      } as React.CSSProperties
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Skill Distribution</CardTitle>
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Breakdown of technical skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SKILLS_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {SKILLS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Required Level"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
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
            <CardTitle>Team Assessment</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription>
            Compare required skills with team capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Upload your team&apos;s skill profile to identify gaps and training
            opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              <BookOpenCheck className="mr-2 h-4 w-4" />
              Generate Skill Report
            </Button>
            <Button variant="outline">Upload Team Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
