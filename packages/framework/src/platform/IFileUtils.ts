export interface IFileUtils {
    readPdfFile(base64EncodedFile: string, password?: string): Promise<Page[]>;
}

export interface Page {
    lines: string[];
}