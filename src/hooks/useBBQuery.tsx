import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { getApiBaseUrl } from "@/shared/http/api";
import { getResponseStatus } from "@/shared/http/response.handler";
import * as v from "valibot";

export type UseBBQueryOptions<T> = Omit<
  UseQueryOptions<T, Error, T, QueryKey>,
  "queryKey" | "queryFn"
> & {
  queryKey?: string;
  schema?: v.GenericSchema<unknown, T>;
};

export const useBBQuery = <T,>(
  url: `/${string}`,
  options: UseBBQueryOptions<T> = {},
) => {
  const {
    queryKey,
    schema,
    retry = 0,
    gcTime = 300000,
    staleTime = 100000,
    enabled = true,
    throwOnError = (error: Error) => getResponseStatus(error) === 403,
    ...rest
  } = options;

  return useQuery<T, Error, T, QueryKey>({
    queryKey: [queryKey ?? url],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}${url ?? "/"}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await handleResponseWithJason<unknown>(response);
      return schema ? v.parse(schema, data) : (data as T);
    },
    retry,
    gcTime,
    staleTime,
    enabled,
    throwOnError,
    ...rest,
  });
};
