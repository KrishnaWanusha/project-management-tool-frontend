import axiosInstance from "@helpers/axiosInstance.c";
import { Project } from "@models/project";
import { AxiosResponse } from "axios";

type ProjectsResponse = {
  status: boolean;
  projects: Project[];
};

type ProjectResponse = {
  status: boolean;
  project: Project;
};

export const projects = () => {
  return axiosInstance().get<null, AxiosResponse<ProjectsResponse>>(
    `project/search`
  );
};

export const get = (id: string) => {
  return axiosInstance().get<null, AxiosResponse<ProjectResponse>>(
    `project/get/${id}`
  );
};

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
