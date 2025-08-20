export interface Entity {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum EntityName {
    UserAccounts = 'UserAccounts',
    Accounts = 'Accounts',
    Tokens = 'Tokens',
}