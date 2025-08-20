import { Account } from "../../../db/entities/Account";
import { FeatureName } from "../../../db/entities/FeatureName";
import { IUserProfileService } from "../../../provider-matrix/IUserProfileService";
import { UserProfile } from "../../../provider-matrix/types/UserProfile";
import { MicrosoftProvider } from "./MicrosoftProvider";

export class MicrosoftUserProfileService extends MicrosoftProvider implements IUserProfileService {
  scopes: string = "offline_access User.Read";
  featureName: FeatureName = FeatureName.UserProfile;

  async fetchUserProfile(account: Account): Promise<UserProfile> {
    return Promise.resolve({
      id: account.providerUserId,
      name: account.name,
      email: account.email
    });
  }
}