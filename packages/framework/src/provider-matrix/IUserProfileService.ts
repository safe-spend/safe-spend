import { Account } from "../db/entities/Account";
import { UserProfile } from "./types/UserProfile";

export interface IUserProfileService {
  fetchUserProfile: (account: Account) => Promise<UserProfile>;
}