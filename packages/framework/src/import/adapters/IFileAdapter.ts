import { Transaction } from "./types/Transaction";
import { File, FileType } from "./types/File";

export interface IFileAdapter {
    supportedFileTypes: FileType[];
    isFileSupported(file: File): Promise<boolean>;
    readTransactionsFromFile(file: File): Promise<Transaction[]>;
}