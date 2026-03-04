import fs from "node:fs";
import path from "node:path";

const loadDotEnvFile = (filename) => {
  const fullPath = path.join(process.cwd(), filename);
  if (!fs.existsSync(fullPath)) return;

  const content = fs.readFileSync(fullPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
};

loadDotEnvFile(".env");
loadDotEnvFile(".env.local");

const requiredAlways = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
const requiredInProd = ["VITE_API_BASE_URL"];

const isCiBuild = process.env.NETLIFY === "true" || process.env.CI === "true";
const isProdBuild = process.env.NODE_ENV === "production" || isCiBuild;

const missing = [];

for (const key of requiredAlways) {
  if (!process.env[key]) missing.push(key);
}

if (isProdBuild) {
  for (const key of requiredInProd) {
    if (!process.env[key]) missing.push(key);
  }
}

if (process.env.VITE_API_BASE_URL && /localhost|127\.0\.0\.1/i.test(process.env.VITE_API_BASE_URL)) {
  if (isProdBuild) {
    console.error("ERROR: VITE_API_BASE_URL cannot target localhost in production build.");
    process.exit(1);
  } else {
    console.warn("WARN: VITE_API_BASE_URL targets localhost.");
  }
}

if (missing.length > 0) {
  const mode = isProdBuild ? "production/CI" : "local";
  console.error(`ERROR: Missing environment variables for ${mode} build: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Environment validation passed.");
