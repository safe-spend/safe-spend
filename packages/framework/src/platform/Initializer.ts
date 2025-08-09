import { DatabaseManager } from "../db/core/DatabaseManager";
import { BaseRepository } from '../db/repositories/BaseRepository';
import { getPlatform } from "./IPlatform";

export async function initialize(): Promise<void> {
    getPlatform();
    await DatabaseManager.initialize();
    await BaseRepository.initialize('users');
}