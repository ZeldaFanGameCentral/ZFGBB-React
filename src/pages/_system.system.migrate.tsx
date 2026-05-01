import { UserContext } from "@/providers/user/userProvider";
import type { BaseBB } from "@/types/api";
import type { Job, JobType, MigrateJobRequest } from "@/types/system";

const JOB_TYPES: JobType[] = [
  "MIGRATE_SMF_INSTALLATION",
  "USERS",
  "CATEGORIES",
  "BOARDS",
  "THREADS",
  "MESSAGES",
  "IPS",
  "MESSAGE_HISTORY",
  "USER_BIO_INFO",
  "ATTACHMENTS",
  "ATTACHMENT_FILES",
  "BBCODE_REWRITE",
  "USER_CONTACT_INFO",
  "POLLS",
  "POLL_CHOICES",
  "USER_POLL_CHOICES",
  "KARMA",
];

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

export default function SystemMigrate() {
  const user = useContext(UserContext);
  const isSiteAdmin = user.permissions?.some(
    (p) => p.permissionCode === "ZFGC_SITE_ADMIN",
  );

  const [smfHost, setSmfHost] = useState("");
  const [smfPort, setSmfPort] = useState(3306);
  const [smfDatabase, setSmfDatabase] = useState("");
  const [smfUser, setSmfUser] = useState("");
  const [smfPassword, setSmfPassword] = useState("");
  const [attachmentsSourcePath, setAttachmentsSourcePath] = useState("");
  const [attachmentsTargetPath, setAttachmentsTargetPath] = useState("");
  const [selectedType, setSelectedType] = useState<JobType>(
    "MIGRATE_SMF_INSTALLATION",
  );
  const [pollJobs, setPollJobs] = useState(false);

  const { data: jobs, refetch } = useBBQuery<Job[]>(
    "/system/migrate/jobs",
    0,
    0,
    0,
    "migrate-jobs",
    2000,
    isSiteAdmin && pollJobs,
  );

  const startJobMutation = useBBMutation<MigrateJobRequest, BaseBB>(
    () => [
      "/system/migrate/jobs",
      {
        type: selectedType,
        smfHost,
        smfPort,
        smfDatabase,
        smfUser,
        smfPassword,
        attachmentsSourcePath: attachmentsSourcePath || undefined,
        attachmentsTargetPath: attachmentsTargetPath || undefined,
      },
    ],
    () => setPollJobs(true),
  );

  if (!isSiteAdmin) {
    return (
      <BBWidget widgetTitle="Migration">
        <div className="p-4">
          <p>You do not have permission to access this page.</p>
        </div>
      </BBWidget>
    );
  }

  const canStart =
    smfHost.trim() &&
    smfDatabase.trim() &&
    smfUser.trim() &&
    smfPassword.trim();

  return (
    <div className="space-y-4">
      <BBWidget widgetTitle="SMF Database Connection">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BBInput
              label="Host"
              name="smfHost"
              type="text"
              placeholder="localhost"
              value={smfHost}
              onChange={(e) => setSmfHost(e.target.value)}
            />
            <BBInput
              label="Port"
              name="smfPort"
              type="number"
              value={smfPort}
              onChange={(e) => setSmfPort(Number(e.target.value))}
            />
            <BBInput
              label="Database"
              name="smfDatabase"
              type="text"
              value={smfDatabase}
              onChange={(e) => setSmfDatabase(e.target.value)}
            />
            <BBInput
              label="Username"
              name="smfUser"
              type="text"
              value={smfUser}
              onChange={(e) => setSmfUser(e.target.value)}
            />
            <BBInput
              label="Password"
              name="smfPassword"
              type="password"
              value={smfPassword}
              onChange={(e) => setSmfPassword(e.target.value)}
            />
          </div>
          <div className="space-y-3 pt-2 border-t border-default">
            <p className="text-xs text-dimmed">
              Attachment paths are server filesystem paths. Leave blank if not
              migrating attachments.
            </p>
            <BBInput
              label="Attachments source path"
              name="attachmentsSourcePath"
              type="text"
              placeholder="/path/to/smf/attachments"
              value={attachmentsSourcePath}
              onChange={(e) => setAttachmentsSourcePath(e.target.value)}
            />
            <BBInput
              label="Attachments target path"
              name="attachmentsTargetPath"
              type="text"
              placeholder="/path/to/zfgbb/attachments"
              value={attachmentsTargetPath}
              onChange={(e) => setAttachmentsTargetPath(e.target.value)}
            />
          </div>
        </div>
      </BBWidget>

      <BBWidget widgetTitle="Start Migration Job">
        <div className="p-4 space-y-3">
          <div className="flex gap-3">
            <select
              className="flex-1 p-2 bg-default border border-default"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as JobType)}
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="px-4 py-2 bg-accented border border-default disabled:opacity-50"
              disabled={startJobMutation.isPending || !canStart}
              onClick={() => startJobMutation.mutate()}
            >
              {startJobMutation.isPending ? "Starting..." : "Start"}
            </button>
          </div>
          {startJobMutation.isError && (
            <p className="text-highlighted text-sm">
              {(startJobMutation.error as Error)?.message ??
                "Failed to start job."}
            </p>
          )}
        </div>
      </BBWidget>

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
