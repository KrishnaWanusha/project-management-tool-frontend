import axiosInstance from "@helpers/axiosInstance.c";
import { useApi } from "@helpers/global";
import { Meeting } from "@models/meeting";
import { AxiosResponse } from "axios";
import useSWR from "swr";

type MeetingsResponse = {
  status: boolean;
  meetings: Meeting[];
};

type MeetingResponse = {
  status: boolean;
  meeting: Meeting;
};
const getMeetings = () => {
  return axiosInstance().get<null, AxiosResponse<MeetingsResponse>>(
    "meeting/all",
    {
      responseType: "json",
    }
  );
};

export function useGetMeetings() {
  const { data, mutate, error, isValidating } = useSWR(
    "meeting/all",
    useApi(getMeetings, undefined),
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

const getMeeting = (id: string) => {
  return axiosInstance().get<null, AxiosResponse<MeetingResponse>>(
    `meeting/get/${id}`
  );
};

export function useGetMeeting(id: string) {
  const { data, mutate, error, isValidating } = useSWR(
    `meeting/get/${id}`,
    useApi(getMeeting, id),
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

export const createMeeting = (data: Meeting) => {
  const formData = new FormData();
  if (data?.uploadedFile) {
    formData.append("date", data?.date);
    formData.append("description", data?.description);
    formData.append("name", data?.name);
    formData.append("type", data?.type);
    formData.append("uploadedFile", data?.uploadedFile);
  }
  console.log(typeof data?.uploadedFile);
  console.log("data?.uploadedFile", data?.uploadedFile);
  return axiosInstance().post<
    Meeting,
    AxiosResponse<{ success: boolean; meetings: Meeting[] }>
  >(`/meeting/create`, formData, {
    responseType: "json",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
