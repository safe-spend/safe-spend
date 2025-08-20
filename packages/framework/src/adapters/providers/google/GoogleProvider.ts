import { Account, ProviderName } from "../../../db/entities/Account";
import { FeatureName, Token } from "../../../db/entities/Token";
import { AuthHandler } from "../../../provider-matrix/AuthHandler";
import { StateProperties } from "../../../provider-matrix/types/StateProperties";
import { Utils } from "../../../utils/utils";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface StateData {
  scopes: string;
  featureName: FeatureName;
  codeVerifier: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export abstract class GoogleProvider extends AuthHandler {
  abstract scopes: string;
  abstract featureName: FeatureName;

  providerName: ProviderName = ProviderName.Google;
  redirectUri = 'com.safespend:/auth';
  private clientId = '8125620125-9tpdv0e0s6hdrf8e6og3hq6dov17m8nv.apps.googleusercontent.com';
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
      state: this.generateState(stateSuffix),
      scope: this.scopes,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    return Promise.resolve(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
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
      name: userResponse.name,
      email: userResponse.email,
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
    await this.saveToken(account, token);

    return tokenResponse.access_token;
  }

  revokeAccess = async (account: Account): Promise<void> => {
    const refreshToken = await this.getSecret(account, this.secretRefreshToken);
    if (!refreshToken) throw new Error("Refresh token not found");
    await this.revokeToken(refreshToken);
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
      code: code,
      code_verifier: data.codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: this.redirectUri,
    });

    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch token: " + responseBody);
    }

    return responseBody;
  }

  private async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    });

    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch token: " + responseBody);
    }

    return responseBody;
  }

  private async revokeToken(refreshToken: string): Promise<void> {
    const params = new URLSearchParams({
      token: refreshToken,
    });

    const response = await fetch(`https://oauth2.googleapis.com/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error("Failed to revoke token");
    }
  }

  private async fetchUserResponse(accessToken: string): Promise<UserResponse> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
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