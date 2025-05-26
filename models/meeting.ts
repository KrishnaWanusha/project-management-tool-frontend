export type MeetingType =
  | "General"
  | "Technical"
  | "Business"
  | "HR"
  | "Training"
  | "Other";

export interface Member {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarUrl?: string;
}

export interface SentimentAnalysis {
  label: string; // e.g., "positive", "negative", "neutral"
  score?: number; // Optional sentiment score
}

export interface Meeting {
  id?: string; 
  name: string; 
  description: string; 
  type: MeetingType; 
  date: string; 
  uploadedFile?: File | null;
  members?: Member[]; 
  transcript?: string; 
  summary?: string; 
  sentimentAnalysis?: SentimentAnalysis;  
  createdAt?: Date; 
  updatedAt?: Date; 
  displayId?: number; 
}
