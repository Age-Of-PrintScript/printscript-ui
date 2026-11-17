type CypressGlobal = { Cypress?: { env: (key: string) => string | undefined } };

const getEnv = (viteVal: string | undefined, key: string): string | undefined => {
  if (viteVal !== undefined) return viteVal;
  const cypressVal = (globalThis as CypressGlobal).Cypress?.env(key);
  if (cypressVal !== undefined) return cypressVal;
  return typeof process !== "undefined" ? process.env?.[key] : undefined;
};

export const FRONTEND_URL = getEnv(import.meta.env?.VITE_FRONTEND_URL, "VITE_FRONTEND_URL") ?? "http://localhost:5173"
export const BACKEND_URL = getEnv(import.meta.env?.VITE_BACKEND_URL, "VITE_BACKEND_URL") ?? "/api"
export const PERMISSIONS_URL = getEnv(import.meta.env?.VITE_PERMISSIONS_URL, "VITE_PERMISSIONS_URL") ?? "/api/permissions"
export const AUTH0_USERNAME = getEnv(import.meta.env?.VITE_AUTH0_USERNAME, "VITE_AUTH0_USERNAME") ?? ""
export const AUTH0_PASSWORD = getEnv(import.meta.env?.VITE_AUTH0_PASSWORD, "VITE_AUTH0_PASSWORD") ?? ""