import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { bbQueryOptions } from "@/hooks/bbQueryOptions";
import type { BaseBB } from "@/types/api";

/**
 * Prefetches a query for SSR with the current request's cookies forwarded so
 * the response reflects the user's auth, then returns a payload suitable for
 * a route loader's return value (consumed by `<HydrationBoundary state=...>`).
 */
export async function prefetchQueryDehydrated<T extends BaseBB | BaseBB[]>(
  request: Request,
  url: `/${string}`,
): Promise<{ dehydratedState: DehydratedState }> {
  const cookie = request.headers.get("Cookie") ?? "";
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    bbQueryOptions<T>(url, undefined, cookie ? { Cookie: cookie } : undefined),
  );
  return { dehydratedState: dehydrate(queryClient) };
}
