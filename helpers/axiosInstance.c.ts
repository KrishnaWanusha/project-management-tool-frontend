import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { buildRoute } from "@/helpers/global";
import { loadLocalStorage } from "@/helpers/global.c";
import { LoginResponse } from "@/services/login";

let instance: AxiosInstance | undefined;
export function clearInstance() {
  instance = undefined;
}

export default function axiosInstance() {
  if (instance) return instance;

  const baseURL =
    process.env.NEXT_PUBLIC_API_HOST ?? "https://localhost:4000/api/v1/";
  const headers: { [key: string]: string } = {};

  const u = loadLocalStorage<LoginResponse | undefined>("authUser");
  if (u?.token) {
    headers.Authorization = `Basic ${u.token}`;
  }

  instance = axios.create({
    baseURL,
    headers,
  });

  return instance;
}
