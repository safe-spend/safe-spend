export interface IStorageProvider {
    storeFile: (fileName: string, data: string) => Promise<void>;
    readFile: (fileName: string) => Promise<string>;
    deleteFile: (fileName: string) => Promise<void>;
}