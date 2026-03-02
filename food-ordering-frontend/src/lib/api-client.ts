import axios from "axios";
import { supabase } from "@/lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config: import("axios").InternalAxiosRequestConfig) => {
  let token: string | null = localStorage.getItem("session_id");
  if (!token) {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (accessToken) {
      token = accessToken;
      localStorage.setItem("session_id", accessToken);
    }
  }
  config.headers.Authorization = token ? `Bearer ${token}` : null;
  return config;
});
