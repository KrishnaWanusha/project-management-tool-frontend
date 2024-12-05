import axiosInstance from "@helpers/axiosInstance.c";
import { AxiosResponse } from "axios";

export type PreviewIssue = {
  title: string;
  body: string;
  labels: string[];
};

export type SRSUploadRequest = {
  owner: string;
  repo: string;
  issues: PreviewIssue[];
};

export const createIssues = (data: SRSUploadRequest) => {
  return axiosInstance().post<
    SRSUploadRequest,
    AxiosResponse<{ success: boolean }>
  >(`/issues/create`, data, {
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
