import { Entity } from "./Entity";

export interface UserAccount extends Entity {
    userId: string;
    name: string;
    email: string;
    provider: Provider;
    token: Token | undefined;
    meta: any;
}

export interface Token {
    features: Feature[];
    accessToken: string;
    refreshToken: string;
    expiry: Date;
}

export enum Feature {
    Login = "login",
    MailSync = "mail_sync",
    Storage = "storage",
}

export enum Provider {
    Google = 'google',
    Microsoft = 'microsoft',
    OneDrive = 'onedrive',
    Apple = 'apple',
    Dropbox = 'dropbox',

}