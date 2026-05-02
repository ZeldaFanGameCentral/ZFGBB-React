import * as v from "valibot";

export const JOB_TYPES = [
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
] as const;

export const MigrateJobFormSchema = v.object({
  type: v.picklist(JOB_TYPES),
  smfHost: v.pipe(v.string(), v.nonEmpty("Host is required.")),
  smfPort: v.pipe(
    v.string(),
    v.nonEmpty("Port is required."),
    v.regex(/^\d+$/, "Port must be a positive integer."),
  ),
  smfDatabase: v.pipe(v.string(), v.nonEmpty("Database is required.")),
  smfUser: v.pipe(v.string(), v.nonEmpty("Username is required.")),
  smfPassword: v.pipe(v.string(), v.nonEmpty("Password is required.")),
  smfTablePrefix: v.string(),
  smfLegacyHost: v.string(),
  attachmentsSourcePath: v.string(),
  attachmentsTargetPath: v.string(),
});

export type MigrateJobForm = v.InferOutput<typeof MigrateJobFormSchema>;

export const InstallFormSchema = v.object({
  installToken: v.pipe(v.string(), v.nonEmpty("Install token is required.")),
  adminUserName: v.pipe(v.string(), v.nonEmpty("Admin username is required.")),
  adminDisplayName: v.pipe(
    v.string(),
    v.nonEmpty("Admin display name is required."),
  ),
  adminEmail: v.pipe(
    v.string(),
    v.nonEmpty("Admin email is required."),
    v.email("Must be a valid email address."),
  ),
  adminPassword: v.pipe(
    v.string(),
    v.nonEmpty("Admin password is required."),
    v.minLength(8, "Password must be at least 8 characters."),
  ),
  siteName: v.pipe(v.string(), v.nonEmpty("Site name is required.")),
  applySampleData: v.boolean(),
});

export type InstallForm = v.InferOutput<typeof InstallFormSchema>;
