import { Account } from "../../../db/entities/Account";
import { FeatureName } from "../../../db/entities/FeatureName";
import { IUserProfileService } from "../../../provider-matrix/IUserProfileService";
import { UserProfile } from "../../../provider-matrix/types/UserProfile";
import { GoogleProvider } from "./GoogleProvider";

export class GoogleUserProfileService extends GoogleProvider implements IUserProfileService {
  scopes: string = 'openid email profile';
  featureName: FeatureName = FeatureName.UserProfile;

  fetchUserProfile(account: Account): Promise<UserProfile> {
    return Promise.resolve({
      id: account.providerUserId,
      name: account.name,
      email: account.email
    });
  }
}