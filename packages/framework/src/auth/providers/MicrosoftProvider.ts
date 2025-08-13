import { Provider, Feature, UserAccount, Token } from "../../db/entities/UserAccount";
import { IAuthProvider } from "./IAuthProvider";
import moment from "moment";
import * as Random from 'expo-random';
import SHA256 from 'crypto-js/sha256';
import encBase64 from 'crypto-js/enc-base64';

interface StateData {
    scope: string;
    features: Feature[];
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

export class MicrosoftProvider implements IAuthProvider {
    provider: Provider = Provider.Microsoft;
    get supportedFeatures(): Feature[] {
        return Array.from(this.scopeMap.keys());
    }

    baseUrl = 'https://login.microsoftonline.com/consumers/oauth2/v2.0';
    clientId = '90329c53-4bdb-4d3d-b66c-e191d4df893f';
    redirectUri = 'safespend://auth/microsoft';
    scopeMap: Map<Feature, string> = new Map();
    stateMap: Map<string, StateData> = new Map();

    constructor() {
        this.scopeMap.set(Feature.Login, 'offline_access User.Read');
        this.scopeMap.set(Feature.MailSync, 'Mail.Read');
    }

    getDisplayDetails(feature: Feature): { displayName: string; description: string; icon: string; } {
        return {
            displayName: "Microsoft",
            description: "Login using your Microsoft account",
            icon: "microsoft-icon"
        };
    }

    async generateAuthUrl(feature: Feature): Promise<string> {
        return this.generateUrl(feature);
    }

    private async generateUrl(...features: Feature[]): Promise<string> {
        const scope = features.map(feature => this.scopeMap.get(feature)).join(' ');
        if (!scope) throw new Error("Unsupported feature");

        const state = Math.random().toString(36).slice(2)
        const codeVerifier = this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);
        this.stateMap.set(state, { scope, features, codeVerifier });

        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: "code",
            redirect_uri: this.redirectUri,
            response_mode: "query",
            state: state,
            scope: scope,
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        });
        return `${this.baseUrl}/authorize?${params.toString()}`;
    }

    async generateUpgradeUrl(account: UserAccount, feature: Feature): Promise<string> {
        const features = [feature, ...account.token?.features || []];
        return this.generateUrl(...features);
    }

    async handleCode(code: string, state: string): Promise<UserAccount> {
        const data = this.stateMap.get(state);
        if (!data) throw new Error("Invalid state");

        this.stateMap.delete(state);

        const tokenResponse = await this.fetchTokenResponse(code, data);
        const token: Token = {
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiry: moment().add(tokenResponse.expires_in, 'seconds').toDate(),
            features: data.features,
        }

        const userResponse = await this.fetchUserResponse(token.accessToken);
        const user: UserAccount = {
            id: `[${data.features.join('-')}]${userResponse.id}`,
            userId: userResponse.id,
            email: userResponse.mail,
            name: userResponse.displayName,
            provider: this.provider,
            token: token,
            meta: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        return user;
    }

    async getAccessToken(account: UserAccount): Promise<string> {
        if (!account.token || !account.token.accessToken) {
            throw new Error("No access token available for this account");
        }

        const token = account.token;
        if (!token.expiry && moment().isAfter(moment(token.expiry))) {
            return token.accessToken;
        }

        const tokenResponse = await this.refreshAccessToken(account);
        token.refreshToken = tokenResponse.refresh_token;
        token.accessToken = tokenResponse.access_token;
        token.expiry = moment().add(tokenResponse.expires_in, 'seconds').toDate();
        return token.accessToken;
    }

    async revokeAccess(account: UserAccount): Promise<void> {
        // Microsoft does not provide a direct revoke endpoint, so this is a no-op
        return;
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

    private async fetchTokenResponse(code: string, data: StateData): Promise<TokenResponse> {
        const params = new URLSearchParams({
            client_id: this.clientId,
            scope: data.scope,
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

    private async refreshAccessToken(account: UserAccount): Promise<TokenResponse> {
        const token = account.token;
        if (!token) {
            throw new Error("No token available for this account");
        }

        const params = new URLSearchParams({
            client_id: this.clientId,
            scope: token.features.map((feature) => this.scopeMap.get(feature) || '').join(' '),
            refresh_token: token.refreshToken,
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

    private generateCodeVerifier(length = 128): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        const array = Random.getRandomBytes(length);
        array.forEach(i => result += chars[i % chars.length]);
        return result;
    }

    private generateCodeChallenge(codeVerifier: string): string {
        const hash = SHA256(codeVerifier);
        const base64 = hash.toString(encBase64);
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

}