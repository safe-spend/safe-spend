import { IFileUtils, IPlatform, ISecretProvider, IStorageProvider } from "@safe-spend/framework";
import { FileUtils } from "./FileUtils";
import { SecretProvider } from "./SecretProvider";
import { StorageProvider } from "./StorageProvider";


export class MobilePlatform implements IPlatform {

    private storageProvider: IStorageProvider;
    private secretProvider: ISecretProvider;
    private fileUtils: IFileUtils;

    constructor() {
        this.storageProvider = new StorageProvider();
        this.fileUtils = new FileUtils();
        this.secretProvider = new SecretProvider();
    }
    
    getStorageProvider(): IStorageProvider {
        return this.storageProvider;
    }

    getSecretProvider(): ISecretProvider {
        return this.secretProvider;
    }

    getFileUtils(): IFileUtils {
        return this.fileUtils;
    }

}