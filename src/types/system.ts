import type { BaseBB } from "./api";

export type InstallStatusResponse = BaseBB & {
  installed: boolean;
  siteName: string | null;
};

export type InstallRequest = BaseBB & {
  adminUserName: string;
  adminDisplayName: string;
  adminEmail: string;
  adminPassword: string;
  siteName?: string;
  applySampleData?: boolean;
  useTokens?: boolean;
};

export type InstallResponse = BaseBB & {
  installed: boolean;
  adminUserId: number;
  siteName: string;
  sampleDataApplied: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
};

export type JobType =
  | "USERS"
  | "CATEGORIES"
  | "BOARDS"
  | "THREADS"
  | "MESSAGES"
  | "IPS"
  | "MESSAGE_HISTORY"
  | "USER_BIO_INFO"
  | "ATTACHMENTS"
  | "ATTACHMENT_FILES"
  | "BBCODE_REWRITE"
  | "USER_CONTACT_INFO"
  | "POLLS"
  | "POLL_CHOICES"
  | "USER_POLL_CHOICES"
  | "KARMA"
  | "MIGRATE_SMF_INSTALLATION";

export type JobState =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type Job = BaseBB & {
  id: string;
  type: JobType;
  state: JobState;
  submittedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
};

export type MigrateJobRequest = BaseBB & {
  type: JobType;
  smfHost: string;
  smfPort?: number;
  smfDatabase: string;
  smfUser: string;
  smfPassword: string;
  attachmentsSourcePath?: string;
  attachmentsTargetPath?: string;
};
