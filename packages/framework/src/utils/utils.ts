import encBase64 from 'crypto-js/enc-base64';
import SHA256 from 'crypto-js/sha256';
import * as Random from 'expo-random';

export class Utils {

    private static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

    static getRandomBytes(length = 128): Uint8Array {
        return Random.getRandomBytes(length);
    }

    static bytesToString(bytes: Uint8Array): string {
        return Array.from(bytes)
            .map(byte => Utils.chars[byte % Utils.chars.length])
            .join('');
    }

    static hashUsingSHA256(data: string) {
        const hash = SHA256(data);
        return hash.toString(encBase64);
    }

}