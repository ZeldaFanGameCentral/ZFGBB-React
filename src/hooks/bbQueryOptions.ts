import { queryOptions } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { BaseBB } from "@/types/api";
import { handleResponseWithJason } from "@/shared/http/response.handler";
import { getApiBaseUrl } from "@/shared/http/api";

export const bbQueryOptions = <T extends BaseBB | BaseBB[]>(
  url: `/${string}`,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
  requestHeaders?: Record<string, string>,
) =>
  queryOptions<T>({
    queryKey: [url],
    queryFn: () =>
      fetch(`${getApiBaseUrl()}${url}`, {
        credentials: import.meta.env.SSR ? "omit" : "include",
        headers: {
          "Content-Type": "application/json",
          ...requestHeaders,
        },
      }).then((r) => handleResponseWithJason<T>(r)),
    staleTime: 100_000,
    gcTime: 300_000,
    ...options,
  });
