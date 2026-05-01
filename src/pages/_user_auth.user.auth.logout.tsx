import { getQueryClient } from "@/providers/query/queryProvider";
import { clearTokens, getRefreshToken } from "@/shared/auth/tokenStorage";
import type { Route } from "./+types/_user_auth.user.auth.logout";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await fetch(`${import.meta.env.REACT_ZFGBB_API_URL}/users/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  clearTokens();
  await getQueryClient().invalidateQueries();
}

export default function UserLogout() {
  return (
    <BBWidget widgetTitle="Logout">
      <div className="p-4 space-y-2">
        <p>You have been successfully logged out.</p>
        <BBLink to="/">Return to home</BBLink>
      </div>
    </BBWidget>
  );
}
