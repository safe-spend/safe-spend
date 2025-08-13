import { Low, Memory } from 'lowdb';
import { Entity } from '../entities/Entity';
import { DatabaseSchema } from './types';
import { DB_FILE_NAME } from '../../constants';
import { IStorageProvider } from '../../platform/IStorageProvider';
import { getPlatform } from '../../platform/IPlatform';

export class DatabaseManager {
    private static instance: DatabaseManager;
    private storageProvider: IStorageProvider;
    private db: Low<DatabaseSchema>;
    
    private constructor() {
        const adapter = new Memory<DatabaseSchema>();
        this.storageProvider = getPlatform().getStorageProvider();
        this.db = new Low(adapter, {});
    }

    static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    static initialize(): Promise<void> {
        return this.getInstance().initialize();
    }

    async initialize(): Promise<void> {
        try {
            // Try to load existing data from storage
            const storedData = await this.storageProvider.readFile(DB_FILE_NAME);
            this.db.data = JSON.parse(storedData) || {};
        } catch (error) {
            console.error('Failed to load from storage provider:', error);
           this.db.data = {};
        }
        await this.persistToStorage();
    }

    private ensureCollection(collection: string): void {
        if (!this.db.data![collection]) {
            this.db.data![collection] = {};
        }
    }

    async get<T extends Entity>(collection: string, id: string): Promise<T | null> {
        await this.db.read();
        return (this.db.data?.[collection]?.[id] as T) || null;
    }

    async getAll<T extends Entity>(collection: string): Promise<T[]> {
        await this.db.read();
        return Object.values(this.db.data?.[collection] || {}) as T[];
    }

    async set<T extends Entity>(collection: string, id: string, data: T): Promise<void> {
        this.ensureCollection(collection);
        this.db.data![collection][id] = {
            ...data,
            updatedAt: new Date()
        };
        await this.db.write();
        await this.persistToStorage();
    }

    async delete(collection: string, id: string): Promise<void> {
        if (this.db.data?.[collection]?.[id]) {
            delete this.db.data[collection][id];
            await this.db.write();
            await this.persistToStorage();
        }
    }

    private async persistToStorage(): Promise<void> {
        try {
            await this.storageProvider.storeFile(DB_FILE_NAME, JSON.stringify(this.db.data));
        } catch (error) {
            console.error('Failed to persist to storage:', error);
            // Optionally implement retry logic or error handling
        }
    }
}
