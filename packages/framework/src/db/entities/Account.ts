import { Entity } from "./Entity";

export interface Account extends Entity {
  providerName: ProviderName;
  providerUserId: string;
  name: string;
  email: string;
}

export enum ProviderName {
  Microsoft = "Microsoft",
  Google = "Google",
}