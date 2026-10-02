const AUTH_KEY = "sthevan-admin-auth";

/** Altere esta senha para a sua. */
export const ADMIN_PASSWORD = "sthevan2026";

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function login(password: string) {
  if (password !== ADMIN_PASSWORD) return false;
  sessionStorage.setItem(AUTH_KEY, "1");
  return true;
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}
