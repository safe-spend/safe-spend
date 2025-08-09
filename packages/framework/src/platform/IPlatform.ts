import { ISecretProvider } from "./ISecretProvider";
import { IStorageProvider } from "./IStorageProvider";

export interface IPlatform {
    getStorageProvider(): IStorageProvider
    getSecretProvider(): ISecretProvider
}

let platform: IPlatform | undefined = undefined;

export function registerPlatform(platformImplementation: IPlatform) {
    if (platform !== undefined) {
        throw new Error("Platform is already registered.");
    }
    platform = platformImplementation;
}

export function getPlatform(): IPlatform {
    if (platform === undefined) {
        throw new Error("Platform is not registered.");
    }
    return platform;
}