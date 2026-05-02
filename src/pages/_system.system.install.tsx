import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router";
import type {
  InstallRequest,
  InstallResponse,
  InstallStatusResponse,
} from "@/types/system";

export default function SystemInstall() {
  const { data: status, isLoading } = useBBQuery<InstallStatusResponse>(
    "/system/install/status",
  );

  const [installToken, setInstallToken] = useState("");
  const [adminUserName, setAdminUserName] = useState("");
  const [adminDisplayName, setAdminDisplayName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [siteName, setSiteName] = useState("ZFGBB");
  const [applySampleData, setApplySampleData] = useState(false);

  const queryClient = useQueryClient();

  const installMutation = useBBMutation<InstallRequest, InstallResponse>(
    () => [
      "/system/install",
      {
        adminUserName,
        adminDisplayName,
        adminEmail,
        adminPassword,
        siteName,
        applySampleData,
      },
      { headers: { "X-Install-Token": installToken } },
    ],
    () => {
      queryClient.invalidateQueries({ queryKey: ["/system/install/status"] });
      queryClient.invalidateQueries({ queryKey: ["/users/loggedInUser"] });
    },
  );

  if (isLoading) {
    return (
      <BBWidget widgetTitle="Setup">
        <div className="p-4">
          <p>Loading...</p>
        </div>
      </BBWidget>
    );
  }

  if (installMutation.isSuccess && installMutation.data) {
    return (
      <div className="space-y-4">
        <BBWidget widgetTitle="Setup Complete">
          <div className="p-4 space-y-2">
            <p>
              Installation complete! Welcome to {installMutation.data.siteName}.
            </p>
            <p>
              Admin account created (user ID: {installMutation.data.adminUserId}
              ).
            </p>
            {installMutation.data.sampleDataApplied && (
              <p>Sample data has been applied.</p>
            )}
            <BBLink to="/">Go to home</BBLink>
          </div>
        </BBWidget>

        <BBWidget widgetTitle="Migrate from an Existing Forum?">
          <div className="p-4 space-y-3">
            <p>
              If you have an existing forum you'd like to import, you can set up
              a migration now. The following platforms are supported:
            </p>
            <div className="flex items-center justify-between p-2 border border-default">
              <span>SMF 2.0.x</span>
              <BBLink to="/system/migrate">Set up migration</BBLink>
            </div>
          </div>
        </BBWidget>
      </div>
    );
  }

  if (status?.installed) {
    return <Navigate to="/" replace />;
  }

  return (
    <BBWidget widgetTitle="Forum Setup">
      <div className="p-4 space-y-4">
        {installMutation.isError && (
          <p className="text-highlighted">
            Installation failed. Check your install token and try again.
          </p>
        )}
        <BBForm>
          <div className="space-y-3">
            <BBInput
              label="Install Token"
              name="installToken"
              type="password"
              value={installToken}
              onChange={(e) => setInstallToken(e.target.value)}
            />
            <BBInput
              label="Admin Username"
              name="adminUserName"
              type="text"
              value={adminUserName}
              onChange={(e) => setAdminUserName(e.target.value)}
            />
            <BBInput
              label="Admin Display Name"
              name="adminDisplayName"
              type="text"
              value={adminDisplayName}
              onChange={(e) => setAdminDisplayName(e.target.value)}
            />
            <BBInput
              label="Admin Email"
              name="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
            <BBInput
              label="Admin Password"
              name="adminPassword"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <BBInput
              label="Site Name"
              name="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                id="applySampleData"
                type="checkbox"
                checked={applySampleData}
                onChange={(e) => setApplySampleData(e.target.checked)}
              />
              <label
                htmlFor="applySampleData"
                className="text-sm font-medium text-muted"
              >
                Apply sample data
              </label>
            </div>
            <button
              type="button"
              className="w-full p-2 bg-accented border border-default"
              disabled={installMutation.isPending}
              onClick={() => installMutation.mutate()}
            >
              {installMutation.isPending ? "Installing..." : "Install"}
            </button>
          </div>
        </BBForm>
      </div>
    </BBWidget>
  );
}
