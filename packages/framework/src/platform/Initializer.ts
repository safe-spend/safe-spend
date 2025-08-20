import { registerProviders } from "../adapters/providers/registerProviders";
import { DatabaseManager } from "../db/core/DatabaseManager";
import { EntityName } from "../db/entities/Entity";
import { BaseRepository } from '../db/repositories/BaseRepository';
import { ProviderMatrix } from "../provider-matrix/ProviderMatrix";
import { getPlatform } from "./IPlatform";

export async function initialize(): Promise<void> {
    getPlatform();
    await DatabaseManager.initialize();
    await BaseRepository.initialize(EntityName.Accounts, EntityName.Tokens);
    await ProviderMatrix.initialize();
    await registerProviders();
}