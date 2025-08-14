import { getPlatform } from "../../../platform/IPlatform";
import { AccountType, IAdapter } from "../IAdapter";
import { IEmailAdapter } from "../IEmailAdapter";
import { IFileAdapter } from "../IFileAdapter";
import { Email } from "../types/Email";
import { FileType, File } from "../types/File";
import { Transaction } from "../types/Transaction";


// Insta alerts - AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAJABl5bwAAAA==
// AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAI-eKdqAAAAA==
// Statement - AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAI_nIaaAAAAA==

export class HdfcBank implements IAdapter, IEmailAdapter, IFileAdapter {
    displayName: string = 'HDFC';
    accountType: AccountType = AccountType.Bank;
    supportedFileTypes: FileType[] = [];

    isEmailSupported(email: Email): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async readTransactionsFromEmail(email: Email): Promise<Transaction[]> {
        const buffer = await email.attachments[0].loadContent();
        const data = getPlatform().getFileUtils().readPdfFile(buffer, "74317558");
        console.log(data);
        data.then((d: any) => console.log('d: ' + d));
        return [];
    }
    isFileSupported(file: File): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    readTransactionsFromFile(file: File): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }

}