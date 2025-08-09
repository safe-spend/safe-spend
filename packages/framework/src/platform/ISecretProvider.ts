export interface ISecretProvider {
    storeSecret: (secretName: string, secretValue: string) => Promise<void>;
    getSecret: (secretName: string) => Promise<string>;
}