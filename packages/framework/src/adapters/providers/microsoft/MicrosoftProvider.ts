import { Account } from '../../../db/entities/Account';
import { FeatureName } from '../../../db/entities/FeatureName';
import { ProviderName } from '../../../db/entities/ProviderName';
import { Token } from '../../../db/entities/Token';
import { AuthHandler } from '../../../provider-matrix/AuthHandler';
import { StateProperties } from '../../../provider-matrix/types/StateProperties';
import { Utils } from '../../../utils/utils';

interface StateData {
  scopes: string;
  featureName: FeatureName;
  codeVerifier: string;
}

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

interface UserResponse {
  id: string;
  displayName: string;
  mail: string;
}

export abstract class MicrosoftProvider extends AuthHandler {
  abstract scopes: string;
  abstract featureName: FeatureName;

  providerName: ProviderName = ProviderName.Microsoft;
  private baseUrl = 'https://login.microsoftonline.com/consumers/oauth2/v2.0';
  private clientId = '90329c53-4bdb-4d3d-b66c-e191d4df893f';
  private secretAccessToken = 'secrets.access_token';
  private secretRefreshToken = 'secrets.refresh_token';
  private stateMap = new Map<string, StateData>();

  generateLoginUrl = (): Promise<string> => {
    const stateSuffix = Utils.bytesToString(Utils.getRandomBytes(8));
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);
    this.stateMap.set(stateSuffix, { scopes: this.scopes, featureName: this.featureName, codeVerifier });

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      response_mode: "query",
      state: this.generateState(stateSuffix),
      scope: this.scopes,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    return Promise.resolve(`${this.baseUrl}/authorize?${params.toString()}`);
  }

  handleLoginCallback = async (props: StateProperties, code: string): Promise<Account> => {
    if (!code || !props.suffix) {
      throw new Error("Invalid callback URL");
    }

    const stateData = this.stateMap.get(props.suffix);
    if (stateData === undefined) {
      throw new Error("Invalid state");
    }

    const tokenResponse = await this.fetchTokenResponse(code, stateData);
    const userResponse = await this.fetchUserResponse(tokenResponse.access_token);

    const account: Account = {
      providerName: this.providerName,
      providerUserId: userResponse.id,
      name: userResponse.displayName,
      email: userResponse.mail,
    }
    await this.saveAccount(account);

    await this.saveSecret(account, this.secretAccessToken, tokenResponse.access_token);
    await this.saveSecret(account, this.secretRefreshToken, tokenResponse.refresh_token);

    const token: Token = {
      accountId: account.id!,
      featureName: this.featureName,
      accessToken: this.secretAccessToken,
      refreshToken: this.secretRefreshToken,
      expiry: this.calculateExpiry(tokenResponse.expires_in),
    }
    await this.saveToken(account, token);

    return account;
  }

  getAccessToken = async (account: Account): Promise<string> => {
    const token = await this.getToken(account);
    if (!token) throw new Error("No token found");

    const expiry = new Date(token.expiry);
    if (expiry.getTime() > Date.now()) {
      const accessToken = await this.getSecret(account, this.secretAccessToken);
      if (!accessToken) throw new Error("Access token not found");
      return accessToken;
    }

    const refreshToken = await this.getSecret(account, this.secretRefreshToken);
    if (!refreshToken) throw new Error("Refresh token not found");
    const tokenResponse = await this.refreshAccessToken(refreshToken);
    token.expiry = this.calculateExpiry(tokenResponse.expires_in);
    
    await this.saveSecret(account, this.secretAccessToken, tokenResponse.access_token);
    await this.saveSecret(account, this.secretRefreshToken, tokenResponse.refresh_token);
    await this.saveToken(account, token);

    return tokenResponse.access_token;
  }

  revokeAccess = async (account: Account): Promise<void> => {
    // Microsoft does not provide a direct revoke endpoint, so this is a no-op
    await this.deleteSecret(account, this.secretAccessToken);
    await this.deleteSecret(account, this.secretRefreshToken);
    await this.deleteToken(account);
    return;
  }

  private calculateExpiry(seconds: number): string {
    return new Date(Date.now() + seconds * 1000).toISOString();
  }

  private async fetchTokenResponse(code: string, data: StateData): Promise<TokenResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: data.scopes,
      code: code,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
      code_verifier: data.codeVerifier,
    });

    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    return await response.json();
  }

  private async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: this.scopes,
      refresh_token: refreshToken,
      redirect_uri: this.redirectUri,
      grant_type: "refresh_token"
    });

    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return await response.json();
  }

  private async fetchUserResponse(accessToken: string): Promise<UserResponse> {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user information");
    }

    return await response.json();
  }

  private generateCodeVerifier(length = 128): string {
    const array = Utils.getRandomBytes(length);
    return Utils.bytesToString(array)
  }

  private generateCodeChallenge(codeVerifier: string): string {
    const base64 = Utils.hashUsingSHA256(codeVerifier);
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}