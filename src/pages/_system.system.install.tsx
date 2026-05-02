import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Navigate } from "react-router";
import * as v from "valibot";
import {
  InstallFormSchema,
  InstallResponseSchema,
  InstallStatusResponseSchema,
  type InstallForm,
  type InstallResponse,
  type InstallStatusResponse,
} from "@/schemas/system";

export default function SystemInstall() {
  const { data: status, isLoading } = useBBQuery<InstallStatusResponse>(
    "/system/install/status",
    { schema: InstallStatusResponseSchema },
  );

  const queryClient = useQueryClient();

  const installMutation = useMutation<InstallResponse, Error, InstallForm>({
    mutationFn: async (values) => {
      const { installToken, ...body } = values;
      const response = await fetch(`${getApiBaseUrl()}/system/install`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Install-Token": installToken,
        },
        body: JSON.stringify(body),
      });
      const data = await handleResponseWithJason<unknown>(response);
      return v.parse(InstallResponseSchema, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/system/install/status"] });
      queryClient.invalidateQueries({ queryKey: ["/users/loggedInUser"] });
    },
  });

  const form = useForm({
    defaultValues: {
      installToken: "",
      adminUserName: "",
      adminDisplayName: "",
      adminEmail: "",
      adminPassword: "",
      siteName: "ZFGBB",
      applySampleData: false,
    } as InstallForm,
    validators: {
      onBlur: InstallFormSchema,
      onSubmit: InstallFormSchema,
    },
    onSubmit: async ({ value }) => {
      await installMutation.mutateAsync(value);
    },
  });

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
        <BBForm
          form={form}
          errorMessage={
            installMutation.isError
              ? "Installation failed. Check your install token and try again."
              : null
          }
        >
          <BBField label="Install Token" name="installToken" type="password" />
          <BBField label="Admin Username" name="adminUserName" />
          <BBField label="Admin Display Name" name="adminDisplayName" />
          <BBField label="Admin Email" name="adminEmail" type="email" />
          <BBField
            label="Admin Password"
            name="adminPassword"
            type="password"
          />
          <BBField label="Site Name" name="siteName" />
          <BBCheckboxField name="applySampleData" label="Apply sample data" />
          <BBSubmit pendingChildren="Installing...">Install</BBSubmit>
        </BBForm>
      </div>
    </BBWidget>
  );
}
