import { ISecretProvider } from "@safe-spend/framework";
import * as Keychain from 'react-native-keychain';

export class SecretProvider implements ISecretProvider {

  private serviceKey = 'safe-spend'

  async getSecret(secretName: string): Promise<string | null> {
    const isAvailable = await Keychain.hasInternetCredentials({ server: this.secretKey(secretName) });
    if (!isAvailable) return null;
    const result = await Keychain.getInternetCredentials(this.secretKey(secretName));
    return result ? result.password : null;
  }

  async storeSecret(secretName: string, secretValue: string): Promise<void> {
    await Keychain.setInternetCredentials(this.secretKey(secretName), this.secretKey(secretName), secretValue);
  }

  async deleteSecret(secretName: string): Promise<void> {
    await Keychain.resetInternetCredentials({ server: this.secretKey(secretName) });
  }

  private secretKey(secretName: string): string {
    return `${this.serviceKey}.${secretName}`;
  }

}