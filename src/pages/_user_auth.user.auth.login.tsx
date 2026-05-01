import { useQueryClient } from "@tanstack/react-query";
import type { AuthCredentials, LoginResponse } from "@/types/auth";
import { setTokens } from "@/shared/auth/tokenStorage";

export default function UserLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const loginMutation = useBBMutation<AuthCredentials, LoginResponse>(
    () => [
      "/users/auth/login",
      { username, password, grant_type: "password", scope: "all" },
    ],
    (data) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.invalidateQueries();
      navigate("/");
    },
  );

  return (
    <BBWidget widgetTitle="Login">
      <div className="p-4 space-y-4 max-w-sm mx-auto">
        {loginMutation.isError && (
          <p className="text-highlighted text-sm">
            Invalid username or password.
          </p>
        )}
        <BBForm>
          <div className="space-y-3">
            <BBInput
              label="Username:"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <BBInput
              label="Password:"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                id="stayLoggedIn"
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
              />
              <label
                htmlFor="stayLoggedIn"
                className="text-sm font-medium text-muted"
              >
                Always stay logged in
              </label>
            </div>
            <button
              type="button"
              className="w-full p-2 bg-accented border border-default"
              disabled={
                loginMutation.isPending || !username.trim() || !password.trim()
              }
              onClick={() => loginMutation.mutate()}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </BBForm>
        <div className="text-sm text-dimmed space-y-1 pt-1 border-t border-default">
          <p>
            Don't have an account?{" "}
            <BBLink to="/user/auth/registration">Register</BBLink>
          </p>
          <p>
            <BBLink to="/">Forgot your password?</BBLink>
          </p>
        </div>
      </div>
    </BBWidget>
  );
}
