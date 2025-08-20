/** 
 * 1. Support sync from Email object
 * 2. Support importing from files
 * 3. Given transaction data generate hash if all required fields are present
 */

export interface IImportAdapter {
    displayName: string;
    accountType: AccountType;
}

export enum AccountType {
    Bank = "Bank",
    CreditCard = "CreditCard",
}