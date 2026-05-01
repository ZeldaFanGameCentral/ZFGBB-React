import { queryOptions } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { BaseBB } from "@/types/api";
import { handleResponseWithJason } from "@/shared/http/response.handler";
import { getAuthHeaders } from "@/shared/auth/tokenStorage";

export const bbQueryOptions = <T extends BaseBB | BaseBB[]>(
  url: `/${string}`,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) =>
  queryOptions<T>({
    queryKey: [url],
    queryFn: () =>
      fetch(`${import.meta.env.REACT_ZFGBB_API_URL}${url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      }).then((r) => handleResponseWithJason<T>(r)),
    staleTime: 100_000,
    gcTime: 300_000,
    ...options,
  });
