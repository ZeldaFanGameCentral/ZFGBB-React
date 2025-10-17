import { useQuery } from "@tanstack/react-query";
import type { BaseBB } from "../types/api";
import { handleResponseWithJason } from "@/shared/http/response.handler";

export const useBBQuery = <T extends BaseBB | BaseBB[]>(
  url: `/${string}`,
  retry: number = 0,
  gcTime: number = 300000,
  staleTime: number = 100000,
  queryKey?: string,
) => {
  return useQuery({
    queryKey: [queryKey ? queryKey : url],
    queryFn: () =>
      fetch(`${import.meta.env.REACT_ZFGBB_API_URL}${url ?? "/"}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => handleResponseWithJason<T>(response)),
    retry,
    gcTime,
    staleTime,
    select: useCallback((data?: T) => data as T, []),
  });
};
