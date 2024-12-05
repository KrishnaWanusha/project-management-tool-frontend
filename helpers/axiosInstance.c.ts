import axios, { AxiosInstance } from "axios";
import { loadLocalStorage } from "@helpers/global.c";
import { LoginResponse } from "@models/login";

let instance: AxiosInstance | undefined;
export function clearInstance() {
  instance = undefined;
}

export default function axiosInstance() {
  if (instance) return instance;

  const baseURL = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost:4000/";
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
