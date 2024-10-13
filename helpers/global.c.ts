import { Dispatch, SetStateAction } from "react";

export function loadLocalStorage<T>(
  path: string,
  setStateFn?: Dispatch<SetStateAction<T>>
): T | null {
  const data = localStorage.getItem(path);
  if (data) {
    setStateFn?.(JSON.parse(data));
    return JSON.parse(data);
  }
  return null;
}

export async function handleStorage<T>(
  path: string,
  u: T | undefined,
  noRemove = false
) {
  if (u) {
    localStorage.setItem(path, JSON.stringify(u));
  } else if (!noRemove) {
    localStorage.removeItem(path);
  }
}

export function createCustomSetStateFn<T>(
  path: string,
  origFn: Dispatch<SetStateAction<T | undefined>>,
  noRemove = false
): (u?: SetStateAction<T | undefined>) => void {
  return (u?: SetStateAction<T | undefined>) => {
    if (u instanceof Function) {
      origFn((cu) => {
        const r = u(cu);
        handleStorage<T>(path, r, noRemove);
        return r;
      });
    } else {
      origFn(u);
      handleStorage<T>(path, u, noRemove);
    }
  };
}
