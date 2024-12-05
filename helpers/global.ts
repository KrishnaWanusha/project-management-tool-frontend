import { AxiosRequestConfig, AxiosResponse } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildRoute(path: string, query?: { [key: string]: any }) {
  let route = `/v1/${path}`;
  if (query) {
    const params = new URLSearchParams({});
    for (const param of Object.keys(query)) {
      if (query[param] && query[param] !== "")
        params.append(param, query[param]?.toString?.());
    }
    route += `?${params.toString()}`;
  }
  console.log("route", route);
  return route;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<U, K = any>(
  request: (
    params: K,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<U>>,
  params: K
) {
  return async () => (await request(params)).data;
}
