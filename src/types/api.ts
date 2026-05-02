export type BaseBB = {
  id?: number | string;
};

export type BBPermission =
  | "ZFGC_MESSAGE_VIEWER"
  | "ZFGC_MESSAGE_EDITOR"
  | "ZFGC_MESSAGE_ADMIN"
  | "ZFGC_SITE_ADMIN";
