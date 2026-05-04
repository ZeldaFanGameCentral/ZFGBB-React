import { getQueryClient } from "@/providers/query/queryProvider";
import { logoutRequest } from "@/shared/http/auth";
import type { Route } from "./+types/_user_auth.user.auth.logout";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  await logoutRequest();
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
