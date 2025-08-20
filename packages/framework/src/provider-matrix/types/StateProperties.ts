import { ProviderName } from "../../db/entities/Account";
import { FeatureName } from "../../db/entities/Token";


export interface StateProperties {
  providerName: ProviderName;
  featureName: FeatureName;
  suffix: string;
}