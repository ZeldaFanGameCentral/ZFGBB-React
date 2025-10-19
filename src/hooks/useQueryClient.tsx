import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const useQueryClient = () => {
  return queryClient;
};
