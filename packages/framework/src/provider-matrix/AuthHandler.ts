import { Account, ProviderName } from "../db/entities/Account";
import { EntityName } from "../db/entities/Entity";
import { FeatureName, Token } from "../db/entities/Token";
import { BaseRepository } from "../db/repositories/BaseRepository";
import { getPlatform } from "../platform/IPlatform";
import { StateProperties } from "./types/StateProperties";

export abstract class AuthHandler {
  redirectUri = 'safespend://auth'
  abstract providerName: ProviderName;
  abstract featureName: FeatureName;
  abstract generateLoginUrl: () => Promise<string>;
  abstract handleLoginCallback: (props: StateProperties, code: string) => Promise<Account>;
  abstract getAccessToken: (account: Account) => Promise<string>;
  abstract revokeAccess: (account: Account) => Promise<void>;

  private accountsDb: BaseRepository<Account>;
  private tokenDb: BaseRepository<Token>;
  private secretProvider = getPlatform().getSecretProvider();

  constructor() {
    this.accountsDb = BaseRepository.getInstance<Account>(EntityName.Accounts);
    this.tokenDb = BaseRepository.getInstance<Token>(EntityName.Tokens);
    this.secretProvider = getPlatform().getSecretProvider();
  }

  protected async saveAccount(account: Account): Promise<void> {
    account.id = `${this.providerName}-${account.providerUserId}`;
    await this.accountsDb.save(account);
  }

  protected async getToken(account: Account): Promise<Token | null> {
    const tokenId = this.tokenId(account);
    return await this.tokenDb.get(tokenId);
  }

  protected async saveToken(account: Account, token: Token): Promise<void> {
    token.id = this.tokenId(account);
    await this.tokenDb.save(token);
  }

  protected async deleteToken(account: Account): Promise<void> {
    const tokenId = this.tokenId(account);
    await this.tokenDb.delete(tokenId);
    const allTokens = await this.tokenDb.find({ where: { accountId: account.id } });
    if (allTokens.length == 0) {
      await this.accountsDb.delete(account.id!);
    }
  }

  protected async getSecret(account: Account, secretSuffix: string): Promise<string | null> {
    const tokenId = this.tokenId(account);
    return await this.secretProvider.getSecret(`${tokenId}.${secretSuffix}`);
  }

  protected async saveSecret(account: Account, secretSuffix: string, secretValue: string): Promise<void> {
    const tokenId = this.tokenId(account);
    await this.secretProvider.storeSecret(`${tokenId}.${secretSuffix}`, secretValue);
  }

  protected async deleteSecret(account: Account, secretSuffix: string): Promise<void> {
    const tokenId = this.tokenId(account);
    await this.secretProvider.deleteSecret(`${tokenId}.${secretSuffix}`);
  }

  protected generateState(suffix: string): string {
    return `${this.providerName}.${this.featureName}.${suffix}`;
  }

  private tokenId(account: Account): string {
    return `token.${this.providerName}.${account.providerUserId}.${this.featureName}`;
  }


}