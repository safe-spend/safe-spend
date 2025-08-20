export interface ISecretProvider {
    getSecret: (secretName: string) => Promise<string | null>;
    storeSecret: (secretName: string, secretValue: string) => Promise<void>;
    deleteSecret: (secretName: string) => Promise<void>;
}