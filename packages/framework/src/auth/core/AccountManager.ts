import { BaseRepository } from '../../db/repositories/BaseRepository';
import { Feature, Provider, UserAccount } from '../../db/entities/UserAccount';
import { EntityName } from '../../db/entities/Entity';
import { IAuthProvider } from '../providers/IAuthProvider';

export class AccountManager {
    
    static instance: AccountManager;
    static getInstance(): AccountManager {
        if (!AccountManager.instance) {
            AccountManager.instance = new AccountManager();
        }
        return AccountManager.instance;
    }

    private db: BaseRepository<UserAccount>;
    private authProviderMap: Map<Provider, IAuthProvider>;

    private constructor() {
        this.db = BaseRepository.getInstance(EntityName.UserAccounts);
        this.authProviderMap = new Map<Provider, IAuthProvider>();
    }

    registerProvider(authProvider: IAuthProvider): void {
        this.authProviderMap.set(authProvider.provider, authProvider);
    }

    getSupportedProviders(feature: Feature): IAuthProvider[] {
        return Array.from(this.authProviderMap.values())
            .filter(provider => provider.supportedFeatures.includes(feature));
    }

    async requestNewAccount(provider: Provider, feature: Feature): Promise<string> {
        const authProvider = this.authProviderMap.get(provider);
        if (!authProvider) throw new Error('Provider not registered');

        return authProvider.generateAuthUrl(feature);
    }

    async handleCallback(provider: string, code: string, state: string): Promise<UserAccount> {
        const authProvider = this.authProviderMap.get(provider as Provider);
        if (!authProvider) throw new Error('Provider not registered');

        const user = await authProvider.handleCode(code, state);
        this.db.save(user);
        return user;
    }

    async getAccessToken(account: UserAccount): Promise<string> {
        const authProvider = this.authProviderMap.get(account.provider);
        if (!authProvider) throw new Error('Provider not registered');

        const token = authProvider.getAccessToken(account);
        this.db.save(account);
        return token;
    }

    async revokeAccess(account: UserAccount): Promise<void> {
        const authProvider = this.authProviderMap.get(account.provider);
        if (!authProvider) throw new Error('Provider not registered');

        await authProvider.revokeAccess(account);
        this.db.delete(account.id);
    }
}