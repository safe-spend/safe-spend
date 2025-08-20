import { PM } from "../../provider-matrix/ProviderMatrix";
import { GoogleUserProfileService } from "./google/GoogleUserProfileService";
import { MicrosoftEmailAccessService } from "./microsoft/MicrosoftEmailAccessService";
import { MicrosoftUserProfileService } from "./microsoft/MicrosoftUserProfileService";

export async function registerProviders() {
  
  // Microsoft
  PM().registerService(new MicrosoftEmailAccessService());
  PM().registerService(new MicrosoftUserProfileService());

  // Google
  PM().registerService(new GoogleUserProfileService());
}