type CypressGlobal = { Cypress?: { env: (key: string) => string | undefined } };

const getEnv = (key: string): string | undefined => {
  const viteVal = import.meta.env?.[key];
  if (viteVal !== undefined) return viteVal;
  const cypressVal = (globalThis as CypressGlobal).Cypress?.env(key);
  if (cypressVal !== undefined) return cypressVal;
  return typeof process !== "undefined" ? process.env?.[key] : undefined;
};

export const FRONTEND_URL = getEnv("VITE_FRONTEND_URL") ?? "http://localhost:5173"
export const BACKEND_URL = getEnv("VITE_BACKEND_URL") ?? "/api"
export const PERMISSIONS_URL = getEnv("VITE_PERMISSIONS_URL") ?? "/api/permissions"
export const AUTH0_USERNAME = getEnv("VITE_AUTH0_USERNAME") ?? ""
export const AUTH0_PASSWORD = getEnv("VITE_AUTH0_PASSWORD") ?? ""