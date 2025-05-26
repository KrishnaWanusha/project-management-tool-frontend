import axiosInstance from "@helpers/axiosInstance.c";
import { useApi } from "@helpers/global";
import { Project } from "@models/project";
import { AxiosResponse } from "axios";
import useSWR from "swr";

type ProjectsResponse = {
  status: boolean;
  projects: Project[];
};

type ProjectResponse = {
  status: boolean;
  project: Project;
};

const getProjects = () => {
  return axiosInstance().get<null, AxiosResponse<ProjectsResponse>>(
    "project/search",
    {
      responseType: "json",
    }
  );
};

export function useGetProjects() {
  const { data, mutate, error, isValidating } = useSWR(
    "project/search",
    useApi(getProjects, undefined),
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

const getProject = (id: string) => {
  return axiosInstance().get<null, AxiosResponse<ProjectResponse>>(
    `project/get/${id}`
  );
};

export function useGetProject(id: string) {
  const { data, mutate, error, isValidating } = useSWR(
    `project/get/${id}`,
    useApi(getProject, id),
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

export const createProject = (data: Partial<Project>) => {
  return axiosInstance().post<
    Partial<Project>,
    AxiosResponse<{ success: boolean; projects: Project[] }>
  >(`/project/create`, data, {
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
