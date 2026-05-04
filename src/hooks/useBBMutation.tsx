import { useMutation } from "@tanstack/react-query";
import type { BaseBB } from "../types/api";
import { getApiBaseUrl } from "../shared/http/api";

type MutationOptions = {
  method?: string;
  headers?: Record<string, string>;
};

export const useBBMutation = <T extends BaseBB, U extends BaseBB = BaseBB>(
  config: () => [string, T] | [string, T, MutationOptions],
  onSuccess?: (data: U) => void,
) => {
  const mutator = useMutation({
    mutationFn: async () => {
      const result = config();
      const url = result[0];
      const postBody = result[1];
      const options = result[2] as MutationOptions | undefined;
      const method = options?.method ?? "POST";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options?.headers,
      };
      const hasBody = method !== "DELETE" && method !== "GET";
      return await handleResponseWithJason<U>(
        await fetch(`${getApiBaseUrl()}${url ?? "/"}`, {
          method,
          credentials: "include",
          headers,
          ...(hasBody ? { body: JSON.stringify(postBody) } : {}),
        }),
      );
    },
    onSuccess,
    onError: () => {},
  });

  return mutator;
};
