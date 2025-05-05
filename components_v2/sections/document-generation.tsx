import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { Button } from "@/components_v2/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components_v2/ui/tabs";
import { FileIcon, FileTextIcon, FileCodeIcon } from "lucide-react";

export function DocumentGeneration() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Document Generation
        </h2>
        <p className="text-muted-foreground">
          Generate documentation for your project based on repository content.
        </p>
      </div>

      <Tabs defaultValue="readme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="readme">README</TabsTrigger>
          <TabsTrigger value="api">API Docs</TabsTrigger>
          <TabsTrigger value="contribute">Contributing</TabsTrigger>
        </TabsList>

        <TabsContent value="readme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>README Generator</CardTitle>
              <CardDescription>
                Create a comprehensive README file for your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Basic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">Simple project overview</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Standard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">Detailed documentation</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Advanced</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileCodeIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">With code examples</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button className="w-full">Custom README</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Generate API documentation from your codebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Select options and generate comprehensive API documentation
              </p>
              <Button className="w-full">Generate API Documentation</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contributing Guidelines</CardTitle>
              <CardDescription>
                Create guidelines for project contributors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate standard contributing guidelines for your project
              </p>
              <Button className="w-full">
                Generate Contributing Guidelines
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
