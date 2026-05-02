import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { UserContext } from "@/providers/user/userProvider";
import {
  JOB_TYPES,
  JobListSchema,
  MigrateJobFormSchema,
  type Job,
  type MigrateJobForm,
  type MigrateJobRequest,
} from "@/schemas/system";
import type { BaseBB } from "@/types/api";

function stateClass(state: Job["state"]): string {
  switch (state) {
    case "RUNNING":
      return "text-highlighted font-semibold";
    case "COMPLETED":
      return "text-highlighted";
    case "FAILED":
      return "text-highlighted font-semibold";
    case "CANCELLED":
      return "text-dimmed";
    default:
      return "text-muted";
  }
}

function JobRow({
  job,
  onCancelSuccess,
}: {
  job: Job;
  onCancelSuccess: () => void;
}) {
  const cancelMutation = useBBMutation<BaseBB, BaseBB>(
    () => [
      `/system/migrate/jobs/${job.id}`,
      {} as BaseBB,
      { method: "DELETE" },
    ],
    onCancelSuccess,
  );

  const canCancel = job.state === "QUEUED" || job.state === "RUNNING";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 p-2 border-b border-default text-sm">
      <span className="w-52 truncate font-mono">{job.type}</span>
      <span className={`w-24 ${stateClass(job.state)}`}>{job.state}</span>
      <span className="w-40 text-dimmed">
        <BBDate dateStr={job.submittedAt} />
      </span>
      <span className="w-40 text-dimmed">
        <BBDate dateStr={job.startedAt} />
      </span>
      <span className="w-40 text-dimmed">
        <BBDate dateStr={job.finishedAt} />
      </span>
      {job.error && (
        <span className="flex-1 text-highlighted truncate" title={job.error}>
          {job.error}
        </span>
      )}
      {canCancel && (
        <button
          className="ml-auto px-2 py-1 border border-default text-sm"
          disabled={cancelMutation.isPending}
          onClick={() => cancelMutation.mutate()}
        >
          {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
        </button>
      )}
    </div>
  );
}

const JOB_TYPE_OPTIONS = JOB_TYPES.map((type) => ({
  value: type,
  label: type,
}));

export default function SystemMigrate() {
  const user = useContext(UserContext);
  const isSiteAdmin = user.permissions?.some(
    (p) => p.permissionCode === "ZFGC_SITE_ADMIN",
  );

  const [pollJobs, setPollJobs] = useState(false);

  const { data: jobs, refetch } = useBBQuery<Job[]>("/system/migrate/jobs", {
    retry: 0,
    gcTime: 0,
    staleTime: 0,
    queryKey: "migrate-jobs",
    refetchInterval: 2000,
    enabled: isSiteAdmin && pollJobs,
    schema: JobListSchema,
  });

  const startJobMutation = useMutation<unknown, Error, MigrateJobRequest>({
    mutationFn: async (body) => {
      const response = await fetch(`${getApiBaseUrl()}/system/migrate/jobs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return handleResponseWithJason<unknown>(response);
    },
    onSuccess: () => setPollJobs(true),
  });

  const form = useForm({
    defaultValues: {
      type: "MIGRATE_SMF_INSTALLATION",
      smfHost: "",
      smfPort: "3306",
      smfDatabase: "",
      smfUser: "",
      smfPassword: "",
      smfTablePrefix: "",
      smfLegacyHost: "",
      attachmentsSourcePath: "",
      attachmentsTargetPath: "",
      force: false,
    } as MigrateJobForm,
    validators: {
      onBlur: MigrateJobFormSchema,
      onSubmit: MigrateJobFormSchema,
    },
    onSubmit: async ({ value }) => {
      const body: MigrateJobRequest = {
        type: value.type,
        smfHost: value.smfHost,
        smfPort: Number(value.smfPort),
        smfDatabase: value.smfDatabase,
        smfUser: value.smfUser,
        smfPassword: value.smfPassword,
        smfTablePrefix: value.smfTablePrefix || undefined,
        smfLegacyHost: value.smfLegacyHost || undefined,
        appBaseUrl: window.location.origin,
        attachmentsSourcePath: value.attachmentsSourcePath || undefined,
        attachmentsTargetPath: value.attachmentsTargetPath || undefined,
        force: value.force || undefined,
      };
      await startJobMutation.mutateAsync(body);
    },
  });

  if (!isSiteAdmin) {
    return (
      <BBWidget widgetTitle="Migration">
        <div className="p-4">
          <p>You do not have permission to access this page.</p>
        </div>
      </BBWidget>
    );
  }

  return (
    <div className="space-y-4">
      <BBForm
        form={form}
        className="space-y-4"
        errorMessage={
          startJobMutation.isError
            ? ((startJobMutation.error as Error)?.message ??
              "Failed to start job.")
            : null
        }
      >
        <BBWidget widgetTitle="SMF Database Connection">
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <BBField label="Host" name="smfHost" placeholder="localhost" />
              <BBField label="Port" name="smfPort" type="number" />
              <BBField label="Database" name="smfDatabase" />
              <BBField label="Username" name="smfUser" />
              <BBField label="Password" name="smfPassword" type="password" />
              <BBField
                label="Table prefix"
                name="smfTablePrefix"
                placeholder="smf_"
                helperText="Whatever prefix you chose during SMF install. Defaults to smf_ if blank."
              />
              <BBField
                label="Legacy host"
                name="smfLegacyHost"
                placeholder="zfgc.com"
                helperText="The host that appears in URLs inside SMF post bodies (e.g. localhost:8090 for a local install). zfgc.com is always rewritten; this adds an additional host."
              />
            </div>
            <div className="space-y-3 pt-2 border-t border-default">
              <p className="text-xs text-dimmed">
                Attachment paths are server filesystem paths. Leave blank if not
                migrating attachments.
              </p>
              <BBField
                label="Attachments source path"
                name="attachmentsSourcePath"
                placeholder="/path/to/smf/attachments"
              />
              <BBField
                label="Attachments target path"
                name="attachmentsTargetPath"
                placeholder="/path/to/zfgbb/attachments"
              />
            </div>
          </div>
        </BBWidget>

        <BBWidget widgetTitle="Start Migration Job">
          <div className="p-4 space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <BBSelectField
                  name="type"
                  label="Job type"
                  options={JOB_TYPE_OPTIONS}
                />
              </div>
              <BBSubmit
                pendingChildren="Starting..."
                className="px-4 py-2 bg-accented border border-default disabled:opacity-50"
              >
                Start
              </BBSubmit>
            </div>
            <BBCheckboxField
              name="force"
              label="Force re-migration"
              helperText="Re-update existing rows even when migration_hash hasn't changed. Use when re-running after a config change (legacy host, table prefix) so already-migrated entities get refreshed."
            />
          </div>
        </BBWidget>
      </BBForm>

      <BBWidget widgetTitle="Jobs">
        {!jobs || jobs.length === 0 ? (
          <p className="p-4 text-dimmed">No jobs found.</p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-x-4 p-2 border-b-2 border-default text-sm font-semibold">
              <span className="w-52">Type</span>
              <span className="w-24">State</span>
              <span className="w-40">Submitted</span>
              <span className="w-40">Started</span>
              <span className="w-40">Finished</span>
            </div>
            {jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                onCancelSuccess={() => refetch()}
              />
            ))}
          </div>
        )}
      </BBWidget>
    </div>
  );
}
