import * as Random from 'expo-random';
import SHA256 from 'crypto-js/sha256';
import encBase64 from 'crypto-js/enc-base64';

export class Utils {

    static getRandomBytes(length = 128) {
        return Random.getRandomBytes(length);
    }

    static hashUsingSHA256(data: string) {
        const hash = SHA256(data);
        return hash.toString(encBase64);
    }

}