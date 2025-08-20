import { IEmailImportAdapter } from "../../../import/interfaces/IEmailImportAdapter";
import { IFileImportAdapter } from "../../../import/interfaces/IFileImportAdapter";
import { AccountType, IImportAdapter } from "../../../import/interfaces/IImportAdapter";
import { FileType } from "../../../import/types/File";
import { Transaction } from "../../../import/types/Transaction";
import { getPlatform } from "../../../platform/IPlatform";
import { Email } from "../../../provider-matrix/types/Email";


export class HdfcBank implements IImportAdapter, IEmailImportAdapter, IFileImportAdapter {

// Insta alerts - AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAJABl5bwAAAA==
// AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAI-eKdqAAAAA==
// Statement - AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAI_nIaaAAAAA==

    displayName: string = 'HDFC';
    accountType: AccountType = AccountType.Bank;
    supportedFileTypes: FileType[] = [];

    isEmailSupported(email: Email): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async readTransactionsFromEmail(email: Email): Promise<Transaction[]> {
        const attachments = await email.attachments.getAttachments();
        const buffer = await attachments[0].loadContent();
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