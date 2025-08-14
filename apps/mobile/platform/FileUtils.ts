import { IFileUtils, Page } from "@safe-spend/framework";
import { NativeModules } from 'react-native';

export class FileUtils implements IFileUtils {
    readPdfFile(base64EncodedFile: string, password?: string): Promise<Page[]> {
        return new Promise((resolve, reject) => {
            const nativeModule = NativeModules.ReactNativeModule;
            nativeModule.readPdfFile(base64EncodedFile, password)
                .then((pages: string[][]) => {
                    resolve(pages.map(lines => ({ lines })));
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
}