export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  default_branch: string;
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
  { id: "skill-assessment", label: "Skill Assessment" }
];