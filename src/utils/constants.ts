declare const Cypress: { env: (key: string) => string | undefined } | undefined;

interface MetaEnvHolder {
  env?: Record<string, string>;
}

const getEnvVar = (key: string, fallback: string = ""): string => {
  if (typeof Cypress !== "undefined" && typeof Cypress.env === "function") {
    const cyVal = Cypress.env(key) ?? Cypress.env(key.replace(/^VITE_/, ""));
    if (cyVal !== undefined && cyVal !== "") {
      return cyVal;
    }
  }
  if (typeof import.meta !== "undefined") {
    const metaEnv = (import.meta as unknown as MetaEnvHolder).env;
    if (metaEnv && metaEnv[key] !== undefined) {
      return metaEnv[key];
    }
  }
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined) {
    return process.env[key] as string;
  }
  return fallback;
};

export const FRONTEND_URL = getEnvVar("VITE_FRONTEND_URL", getEnvVar("FRONTEND_URL", "http://localhost:5173"));
export const BACKEND_URL = getEnvVar("VITE_BACKEND_URL", getEnvVar("BACKEND_URL", "/api"));
export const PERMISSIONS_URL = getEnvVar("VITE_PERMISSIONS_URL", getEnvVar("PERMISSIONS_URL", "/api/permissions"));
export const AUTH0_USERNAME = getEnvVar("VITE_AUTH0_USERNAME", getEnvVar("AUTH0_USERNAME", ""));
export const AUTH0_PASSWORD = getEnvVar("VITE_AUTH0_PASSWORD", getEnvVar("AUTH0_PASSWORD", ""));
