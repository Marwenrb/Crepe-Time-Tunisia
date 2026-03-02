import React from "react";
import { useQuery } from "react-query";
import * as authApi from "@/api/authApi";

type AppContextType = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  showToast?: (opts: { title: string; description?: string; type?: string }) => void;
};

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const hasStoredToken = !!localStorage.getItem("session_id") && !!localStorage.getItem("user_id");
  const storedIsAdmin = localStorage.getItem("is_admin") === "1";

  const { isError, isLoading, data } = useQuery("validateToken", authApi.validateToken, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: hasStoredToken,
  });

  const isLoggedIn =
    (!isLoading && !isError && !!data) ||
    (hasStoredToken && isError) ||
    (hasStoredToken && isLoading);

  const isAdmin = isLoggedIn && (data?.isAdmin ?? storedIsAdmin);

  return (
    <AppContext.Provider value={{ isLoggedIn, isAdmin }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
};
