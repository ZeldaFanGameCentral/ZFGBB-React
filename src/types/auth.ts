import type { BaseBB } from "./api";
import type { User } from "./user";

export type AuthCredentials = BaseBB & {
  username: string;
  password: string;
  grant_type: string;
  scope: string;
};

export type LoginResponse = BaseBB & {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RefreshRequest = BaseBB & {
  refreshToken: string;
};

export type TokenPair = BaseBB & {
  accessToken: string;
  refreshToken: string;
};
