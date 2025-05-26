/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { clearInstance } from "@/helpers/axiosInstance.c";
import { createCustomSetStateFn, loadLocalStorage } from "@/helpers/global.c";

type AuthContextType = {
  user?: any;
  setUser: Dispatch<SetStateAction<any | undefined>>;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocalStorage("user", setUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    clearInstance();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, setUser: createCustomSetStateFn("authUser", setUser) }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export default AuthContext;
