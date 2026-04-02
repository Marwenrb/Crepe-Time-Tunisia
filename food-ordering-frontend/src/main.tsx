import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AppContextProvider } from "./contexts/AppContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { API_BASE_URL } from "./lib/runtime-config";

// ── Keep Render backend awake — skip in local dev to avoid console noise ────
if (API_BASE_URL && !API_BASE_URL.includes("localhost")) {
  const ping = () =>
    fetch(`${API_BASE_URL}/health`, { mode: "no-cors" }).catch(() => {});
  ping();
  setInterval(ping, 14 * 60 * 1000);
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
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

// ── Dismiss the HTML preloader once React has painted its first frame ────────
const dismissPreloader = () => {
  const el = document.getElementById("app-preloader");
  if (!el) return;
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 450);
};
requestAnimationFrame(() => requestAnimationFrame(dismissPreloader));
