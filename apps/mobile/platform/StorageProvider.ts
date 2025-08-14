import { IStorageProvider } from "@safe-spend/framework";
import RNFS from 'react-native-fs';

export class StorageProvider implements IStorageProvider {
    private basePath = RNFS.DocumentDirectoryPath;

    async storeFile(fileName: string, data: string): Promise<void> {
        const filePath = `${this.basePath}/${fileName}`;
        try {
            await RNFS.writeFile(filePath, data, 'utf8');
        } catch (error) {
            console.error(`Failed to store file ${fileName}:`, error);
            throw error;
        }
    }

    async readFile(fileName: string): Promise<string> {
        const filePath = `${this.basePath}/${fileName}`;
        try {
            const exists = await RNFS.exists(filePath);
            if (!exists) {
                throw new Error(`File ${fileName} does not exist`);
            }
            return await RNFS.readFile(filePath, 'utf8');
        } catch (error) {
            console.error(`Failed to read file ${fileName}:`, error);
            throw error;
        }
    }

    // Utility methods
    async fileExists(fileName: string): Promise<boolean> {
        const filePath = `${this.basePath}/${fileName}`;
        return RNFS.exists(filePath);
    }

    async deleteFile(fileName: string): Promise<void> {
        const filePath = `${this.basePath}/${fileName}`;
        if (await this.fileExists(fileName)) {
            await RNFS.unlink(filePath);
        }
    }

    async listFiles(directory: string = ''): Promise<string[]> {
        const dirPath = `${this.basePath}/${directory}`;
        const files = await RNFS.readDir(dirPath);
        return files.map(file => file.name);
    }
}