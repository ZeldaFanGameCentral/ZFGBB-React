import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/user";
import { logoutRequest } from "@/shared/http/auth";

export function useAuthSession() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useBBQuery<User>("/users/loggedInUser");

  const logout = async () => {
    await logoutRequest();
    await queryClient.invalidateQueries();
  };

  return {
    user,
    isLoading,
    isLoggedIn: !!user?.id && Number(user.id) > 0,
    logout,
  };
}
