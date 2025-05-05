"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components_v2/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to ProjectHub
          </CardTitle>
          <CardDescription>
            Connect with GitHub to manage your projects
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative mb-8 h-24 w-24">
            <GitHubLogoIcon className="h-full w-full" />
          </div>
          <Button
            className="w-full"
            onClick={() =>
              signIn("github", { callbackUrl: "/v2/repositories" })
            }
          >
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            Login with GitHub
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  );
}
