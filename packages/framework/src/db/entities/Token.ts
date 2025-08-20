import { Entity } from "./Entity";

export interface Token extends Entity {
  accountId: string;
  featureName: FeatureName;
  accessToken: string;
  refreshToken: string;
  expiry: string;
}

export enum FeatureName {
  UserProfile = "UserProfile",
  EmailAccess = "EmailAccess",
}