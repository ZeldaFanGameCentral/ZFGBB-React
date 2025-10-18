import { useMutation } from "@tanstack/react-query";
import type { BaseBB } from "../types/api";

export const useBBMutation = <T extends BaseBB, U extends BaseBB>(
  config: () => [string, T],
  onSuccess?: (data: U) => void,
) => {
  const mutator = useMutation({
    mutationFn: async () => {
      const [url, postBody] = config();
      return await handleResponseWithJason<U>(
        await fetch(`${import.meta.env.REACT_ZFGBB_API_URL}${url ?? "/"}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        }),
      );
    },
    onSuccess,
    onError: () => {},
  });

  return mutator;
};
