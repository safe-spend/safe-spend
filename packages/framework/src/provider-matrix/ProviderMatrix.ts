import { QueryOptions } from "../db/core/types";
import { Account } from "../db/entities/Account";
import { EntityName } from "../db/entities/Entity";
import { FeatureName } from "../db/entities/FeatureName";
import { ProviderName } from "../db/entities/ProviderName";
import { Token } from "../db/entities/Token";
import { BaseRepository } from "../db/repositories/BaseRepository";
import { AuthHandler } from "./AuthHandler";
import { StateProperties } from "./types/StateProperties";

export class ProviderMatrix {

  static instance: ProviderMatrix | undefined;

  static getInstance(): ProviderMatrix {
    if (!ProviderMatrix.instance) {
      throw new Error("ProviderMatrix is not initialized.");
    }
    return ProviderMatrix.instance;
  }

  static initialize(): void {
    ProviderMatrix.instance = new ProviderMatrix();
  }

  static generateState(props: StateProperties): string {
    return `${props.providerName}.${props.featureName}.${props.suffix}`;
  }

  static readState(string: string): StateProperties {
    const [providerName, featureName, suffix] = string.split('.');
    return {
      providerName: providerName as ProviderName,
      featureName: featureName as FeatureName,
      suffix
    };
  }

  private providerMap: Map<ProviderName, Map<FeatureName, AuthHandler>>;
  private accountsDb: BaseRepository<Account>;
  private tokensDb: BaseRepository<Token>;

  private constructor() {
    this.providerMap = new Map<ProviderName, Map<FeatureName, AuthHandler>>();
    this.accountsDb = BaseRepository.getInstance<Account>(EntityName.Accounts);
    this.tokensDb = BaseRepository.getInstance<Token>(EntityName.Tokens);
  }

  registerService(handler: AuthHandler): void {
    const { providerName, featureName } = handler;

    if (!this.providerMap.has(providerName)) {
      this.providerMap.set(providerName, new Map<FeatureName, AuthHandler>());
    }

    const featureMap = this.providerMap.get(providerName)!;
    featureMap.set(featureName, handler);
  }

  get(providerName: ProviderName, featureName: FeatureName): AuthHandler | undefined {
    const featureMap = this.providerMap.get(providerName);
    return featureMap ? featureMap.get(featureName) : undefined;
  }

  getProviders(featureName?: FeatureName): ProviderName[] {
    let entries = Array.from(this.providerMap.entries());
    if (featureName) {
      entries = entries.filter(([_, featureMap]) => featureMap.has(featureName));
    }
    return entries.map(([providerName]) => providerName);
  }

  getFeatures(providerName?: ProviderName): FeatureName[] {
    let supportedFeatures: FeatureName[];
    if (providerName) {
      supportedFeatures = Array.from(this.providerMap.get(providerName)?.keys() || []);
    } else {
      supportedFeatures = Array.from(this.providerMap.values()).flatMap(featureMap => Array.from(featureMap.keys()));
    }
    return Array.from(new Set(supportedFeatures));
  }

  async getAccounts(featureName?: FeatureName, providerName?: ProviderName): Promise<Account[]> {
    const query: QueryOptions = {};
    if (featureName) {
      query.where = { featureName };
    }
    if (providerName) {
      query.where = { ...query.where, providerName };
    }
    return await this.accountsDb.find(query);
  }

  async getTokens(account: Account): Promise<Token[]> {
    return await this.tokensDb.find({ where: { accountId: account.id } });
  }

  async handleCallback(url: string): Promise<void> {
    const params = new URLSearchParams(url.split('?')[1]);
    const stateProps = ProviderMatrix.readState(params.get('state') || '');
    const service = this.get(stateProps.providerName, stateProps.featureName);
    if (!service) throw new Error(`No service found for ${stateProps.providerName} and ${stateProps.featureName}`);
    await service.handleLoginCallback(stateProps, params.get('code') || '');
  }
}

export const PM = ProviderMatrix.getInstance;
