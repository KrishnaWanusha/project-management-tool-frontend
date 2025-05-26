import { Issue } from "@models/issue";

export type ProjectType =
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "Mobile"
  | "DevOps"
  | "Other";

export interface Member {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarUrl?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  type: ProjectType;
  members?: Member[];
  githubRepo?: string;
  status?: "Active" | "On Hold" | "Completed";
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
  repo?: string;
  authToken?: string;
  displayId?: number;
  issues?: Issue[];
}
