import { Email } from "../../auth/types/Email";
import { Transaction } from "../types/Transaction";

export interface IEmailImportAdapter {
    isEmailSupported(email: Email): Promise<boolean>;
    readTransactionsFromEmail(email: Email): Promise<Transaction[]>;
}