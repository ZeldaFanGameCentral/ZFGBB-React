import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getApiBaseUrl } from "@/shared/http/api";
import { getResponseStatus } from "@/shared/http/response.handler";

let refreshState: "idle" | "refreshing" | "stale" = "idle";

async function tryRefresh() {
  if (refreshState !== "idle") return;
  if (import.meta.env.SSR) return;
  refreshState = "refreshing";
  try {
    const response = await fetch(`${getApiBaseUrl()}/users/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      await queryClient.invalidateQueries();
      refreshState = "idle";
    } else {
      refreshState = "stale";
    }
  } catch {
    refreshState = "stale";
  }
}

function on401(error: unknown) {
  if (getResponseStatus(error) !== 401) return;
  void tryRefresh();
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: on401 }),
  mutationCache: new MutationCache({ onError: on401 }),
});

export const getQueryClient = () => queryClient;

const QueryProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
