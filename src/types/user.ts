import type { BaseBB, BBPermission } from "./api";

export type User = BaseBB & {
  displayName: string;
  theme?: string;

  bioInfo?: UserBioInfo;
  contactInfo?: UserContactInfo;

  permissions?: Permission[];
};

export type UserBioInfo = BaseBB & {
  personalText?: string;
  customTitle?: string;
  userId: number;
  signature?: string;
  avatar?: Avatar;
};

export type Avatar = BaseBB & {
  userId: number;
  id: number;
  activeFlag: boolean;
  url?: `${string}://${string}/${string}`;
  contentResourceId?: number;
};

export type Permission = BaseBB & {
  permissionCode: string;
  permissionName: BBPermission;
};

export type UserContactInfo = BaseBB & {
  emailAddress: EmailAddress;
  allowEmailFlag: boolean;
  allowPmFlag: boolean;
};

export type EmailAddress = BaseBB & {
  emailAddress?: string;
  spammerFlag: boolean;
};
