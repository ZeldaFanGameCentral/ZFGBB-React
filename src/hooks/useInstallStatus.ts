import {
  InstallStatusResponseSchema,
  type InstallStatusResponse,
} from "@/schemas/system";

export const useInstallStatus = () => {
  return useBBQuery<InstallStatusResponse>("/system/install/status", {
    retry: 0,
    gcTime: 0,
    staleTime: 0,
    schema: InstallStatusResponseSchema,
  });
};
