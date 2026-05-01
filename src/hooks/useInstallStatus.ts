import type { InstallStatusResponse } from "@/types/system";

export const useInstallStatus = () => {
  return useBBQuery<InstallStatusResponse>("/system/install/status", 0, 0, 0);
};
