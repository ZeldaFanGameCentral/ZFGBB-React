import { getApiBaseUrl } from "./api";

export async function logoutRequest(): Promise<void> {
  await fetch(`${getApiBaseUrl()}/users/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }).catch(() => {});
}
