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
  return route;
}
