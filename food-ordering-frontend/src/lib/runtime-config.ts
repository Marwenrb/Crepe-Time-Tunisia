const LOCAL_API_FALLBACK = "http://localhost:5000";

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const isLocalhostUrl = (value: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimTrailingSlashes(value));

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const normalizedApiBaseUrl = trimTrailingSlashes(rawApiBaseUrl);

const missingApiBaseInProd = import.meta.env.PROD && !normalizedApiBaseUrl;
const localhostApiInProd =
  import.meta.env.PROD &&
  Boolean(normalizedApiBaseUrl) &&
  isLocalhostUrl(normalizedApiBaseUrl);

if (missingApiBaseInProd || localhostApiInProd) {
  console.error(
    "[Config] VITE_API_BASE_URL is missing or invalid in production. Set it to your deployed backend URL."
  );
}

export const API_BASE_URL =
  normalizedApiBaseUrl || (import.meta.env.DEV ? LOCAL_API_FALLBACK : "");

export const HAS_WORKING_API_URL = Boolean(API_BASE_URL) && !localhostApiInProd;

const browserOrigin = typeof window !== "undefined" ? window.location.origin : "";
const rawAppUrl = (import.meta.env.VITE_APP_URL || browserOrigin).trim();
export const APP_BASE_URL = trimTrailingSlashes(rawAppUrl);
