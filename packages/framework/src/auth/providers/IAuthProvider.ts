import { Feature, Provider, UserAccount } from "../../db/entities/UserAccount";

export interface IAuthProvider {
    provider: Provider;
    supportedFeatures: Feature[];
    getDisplayDetails(feature: Feature): { displayName: string, description: string, icon: string };
    generateAuthUrl(feature: Feature): Promise<string>;
    handleCode(code: string, state: string): Promise<UserAccount>;
    getAccessToken(account: UserAccount): Promise<string>;
    revokeAccess(account: UserAccount): Promise<void>;
}