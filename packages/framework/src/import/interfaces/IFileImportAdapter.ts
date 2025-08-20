import { File, FileType } from "../types/File";
import { Transaction } from "../types/Transaction";

export interface IFileImportAdapter {
    supportedFileTypes: FileType[];
    isFileSupported(file: File): Promise<boolean>;
    readTransactionsFromFile(file: File): Promise<Transaction[]>;
}