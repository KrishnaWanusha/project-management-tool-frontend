"use client";

import { Issue } from "@/types/github";
import axiosInstance from "@helpers/axiosInstance.c";
import { useApi } from "@helpers/global";
import { AxiosResponse } from "axios";
import useSWR from "swr";

// Response types
interface Story {
  id?: string;
  title: string;
  description?: string;
  teamEstimate?: number;
  storyPoint: number;
  rfPrediction?: number;
  confidence?: number;
  fullAdjustment?: number;
  appliedAdjustment?: number;
  dqnInfluence?: number;
  comparisonStatus?: string;
  riskLevel?: string;
  difference?: number;
  createdAt?: string;
  updatedAt?: string;
  projectId?: string;
}

interface StoryInput {
  title?: string;
  description?: string;
  teamEstimate?: number;
  projectId?: string;
}

interface StoriesResponse {
  success: boolean;
  results: number;
  data: Story[];
}

interface EstimationResponse {
  success: boolean;
  data: Story;
}

interface BatchEstimationResponse {
  success: boolean;
  data: Story[];
}

interface ValidationResponse {
  success: boolean;
  data: {
    accuracy: number;
    mae: number;
    rmse: number;
  };
}

interface OptimalInfluenceResponse {
  success: boolean;
  data: {
    optimalInfluence: number;
    metrics: {
      mae: number;
      rmse: number;
    };
  };
}

interface UpdateTeamEstimateResponse {
  success: boolean;
  data: Story;
}

interface SaveStoryResponse {
  success: boolean;
  data: Story;
}

// API Functions

// Add interceptor for HTML response handling
if (typeof window !== "undefined") {
  axiosInstance().interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error);

      // Handle HTML response error specifically
      if (
        error.response?.data &&
        typeof error.response.data === "string" &&
        error.response.data.includes("<!DOCTYPE")
      ) {
        const customError = new Error(
          "Server returned an HTML error page instead of JSON. The backend might be experiencing an error."
        );
        customError.name = "HTMLResponseError";
        return Promise.reject(customError);
      }

      return Promise.reject(error);
    }
  );
}

// Get all saved stories
const getSavedStories = () => {
  return axiosInstance().get<null, AxiosResponse<StoriesResponse>>(
    "/estimate/stories"
  );
};

// Get stories by project id
const getStoriesByProjectId = (projectId: string) => {
  return axiosInstance().get<null, AxiosResponse<StoriesResponse>>(
    `/estimate/projects/${projectId}/stories`
  );
};

// Single story estimation
const estimateStory = (
  title: string,
  description: string = "",
  dqnInfluence: number = 0.3
) => {
  return axiosInstance().post<
    { title: string; description: string; dqnInfluence: number },
    AxiosResponse<EstimationResponse>
  >("/estimate", {
    title,
    description,
    dqnInfluence,
  });
};

// Batch estimation
const batchEstimate = (stories: StoryInput[], dqnInfluence: number = 0.3) => {
  return axiosInstance().post<
    { stories: StoryInput[]; dqnInfluence: number },
    AxiosResponse<BatchEstimationResponse>
  >("/estimate/batch", {
    stories,
    dqnInfluence,
  });
};

// Validate model
const validateModel = (testData: StoryInput[]) => {
  return axiosInstance().post<
    { testData: StoryInput[] },
    AxiosResponse<ValidationResponse>
  >("/estimate/validate", {
    testData,
  });
};

// Find optimal DQN influence
const findOptimalInfluence = (
  trainData: StoryInput[],
  testData: StoryInput[]
) => {
  return axiosInstance().post<
    { trainData: StoryInput[]; testData: StoryInput[] },
    AxiosResponse<OptimalInfluenceResponse>
  >("/estimate/optimal-influence", {
    trainData,
    testData,
  });
};

// Update team estimate
const updateTeamEstimate = (issue: Issue, teamEstimate: number) => {
  return axiosInstance().put<
    { storyId: string; teamEstimate: number },
    AxiosResponse<UpdateTeamEstimateResponse>
  >("/estimate/update-team-estimate", {
    issue,
    teamEstimate,
  });
};

// Save story
const saveStory = (story: StoryInput) => {
  return axiosInstance().post<StoryInput, AxiosResponse<SaveStoryResponse>>(
    "/estimate/save-story",
    story
  );
};

// SWR hooks
export function useGetSavedStories() {
  const { data, error, isValidating, mutate } = useSWR(
    "/estimate/stories",
    useApi(getSavedStories, undefined),
    {
      errorRetryCount: 3,
      revalidateOnFocus: false,
    }
  );

  const loading = (!data && !error) || isValidating;

  return {
    data,
    error,
    loading,
    mutate,
  };
}

export function useGetStoriesByProjectId(projectId: string) {
  const { data, error, isValidating, mutate } = useSWR(
    projectId ? `/estimate/projects/${projectId}/stories` : null,
    projectId ? useApi(getStoriesByProjectId, projectId) : null,
    {
      errorRetryCount: 3,
      revalidateOnFocus: false,
    }
  );

  const loading = (!data && !error) || isValidating;

  return {
    data,
    error,
    loading,
    mutate,
  };
}

// Exported API object
export const storyPointsApi = {
  // Get functions
  getSavedStories,
  getStoriesByProjectId,

  // Estimation functions
  estimateStory: async (
    title: string,
    description: string = "",
    dqnInfluence: number = 0.3
  ) => {
    try {
      const response = await estimateStory(title, description, dqnInfluence);
      return response.data;
    } catch (error) {
      console.error("Story estimation error:", error);
      throw error;
    }
  },

  // Batch estimation
  batchEstimate: async (stories: StoryInput[], dqnInfluence: number = 0.3) => {
    try {
      const response = await batchEstimate(stories, dqnInfluence);
      return response.data;
    } catch (error) {
      console.error("Batch estimation error:", error);
      throw error;
    }
  },

  // Validation functions
  validateModel: async (testData: StoryInput[]) => {
    try {
      const response = await validateModel(testData);
      return response.data;
    } catch (error) {
      console.error("Model validation error:", error);
      throw error;
    }
  },

  findOptimalInfluence: async (
    trainData: StoryInput[],
    testData: StoryInput[]
  ) => {
    try {
      const response = await findOptimalInfluence(trainData, testData);
      return response.data;
    } catch (error) {
      console.error("Optimal influence calculation error:", error);
      throw error;
    }
  },

  // Management functions
  updateTeamEstimate: async (issue: Issue, teamEstimate: number) => {
    try {
      const response = await updateTeamEstimate(issue, teamEstimate);
      return response.data;
    } catch (error) {
      console.error("Team estimate update error:", error);
      throw error;
    }
  },

  saveStory: async (story: StoryInput) => {
    try {
      const response = await saveStory(story);
      return response.data;
    } catch (error) {
      console.error("Story save error:", error);
      throw error;
    }
  },
};

export default storyPointsApi;
