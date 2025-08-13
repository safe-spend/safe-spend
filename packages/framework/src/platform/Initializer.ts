import { AccountManager } from "../auth/core/AccountManager";
import { MicrosoftProvider } from "../auth/providers/MicrosoftProvider";
import { DatabaseManager } from "../db/core/DatabaseManager";
import { EntityName } from "../db/entities/Entity";
import { BaseRepository } from '../db/repositories/BaseRepository';
import { getPlatform } from "./IPlatform";

export async function initialize(): Promise<void> {
    getPlatform();
    await DatabaseManager.initialize();
    await BaseRepository.initialize(EntityName.UserAccounts);
    AccountManager.getInstance().registerProvider(new MicrosoftProvider());
}