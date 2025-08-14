import { Email } from "./types/Email";
import { Transaction } from "./types/Transaction";

export interface IEmailAdapter {
    isEmailSupported(email: Email): Promise<boolean>;
    readTransactionsFromEmail(email: Email): Promise<Transaction[]>;
}