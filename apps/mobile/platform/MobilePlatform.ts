import { IPlatform, ISecretProvider, IStorageProvider, IFileUtils } from "@safe-spend/framework";
import { StorageProvider } from "./StorageProvider";
import { FileUtils } from "./FileUtils";


export class MobilePlatform implements IPlatform {

    private storageProvider: IStorageProvider;
    private fileUtils: IFileUtils;

    constructor() {
        this.storageProvider = new StorageProvider();
        this.fileUtils = new FileUtils();
    }
    
    getStorageProvider(): IStorageProvider {
        return this.storageProvider;
    }

    getSecretProvider(): ISecretProvider {
        throw new Error("Method not implemented.");
    }

    getFileUtils(): IFileUtils {
        return this.fileUtils;
    }

}