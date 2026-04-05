import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AppContextProvider } from "./contexts/AppContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { API_BASE_URL } from "./lib/runtime-config";

// Keep backend wake-up off the initial critical path.
if (API_BASE_URL && !API_BASE_URL.includes("localhost")) {
  const ping = () => fetch(`${API_BASE_URL}/health`, { mode: "no-cors", keepalive: true }).catch(() => {});
  const scheduleKeepAlive = () => {
    window.setTimeout(() => {
      ping();
      window.setInterval(ping, 14 * 60 * 1000);
    }, 7000);
  };

  if (document.readyState === "complete") {
    scheduleKeepAlive();
  } else {
    window.addEventListener("load", scheduleKeepAlive, { once: true });
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15000),
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <AppRoutes />
          <Toaster visibleToasts={1} position="bottom-right" richColors />
        </AppContextProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
