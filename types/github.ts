export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  private: boolean;
  language: string;
  updated_at: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export type DashboardSection =
  | "document-generation"
  | "task-creation"
  | "risk-assessment"
  | "skill-assessment";

export const DASHBOARD_SECTIONS: { id: DashboardSection; label: string }[] = [
  { id: "document-generation", label: "Document Generation" },
  { id: "task-creation", label: "Task Creation" },
  { id: "risk-assessment", label: "Risk Assessment" },
  { id: "skill-assessment", label: "Skill Assessment" },
];

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface User {
  login: string;
  avatar_url: string;
}

export interface Issue {
  id: number;
  title: string;
  state: string;
  body: string;
  labels: Label[];
  created_at: string;
  comments: number;
  user: User;
  html_url: string;
}

export type Priority = "All" | "High" | "Medium" | "Low";
