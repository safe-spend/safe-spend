import { Observable } from 'rxjs';
import { Entity } from '../entities/Entity';
import { DatabaseManager } from '../core/DatabaseManager';
import { ObservableManager } from '../core/ObservableManager';
import { QueryOptions } from '../core/types';

export class BaseRepository<T extends Entity> {
    private static instances: Map<string, BaseRepository<any>> = new Map();
    protected db: DatabaseManager;
    private observableManager: ObservableManager<T>;

    private constructor(
        protected readonly collectionName: string
    ) {
        this.db = DatabaseManager.getInstance();
        this.observableManager = new ObservableManager<T>();
    }

    static getInstance<T extends Entity>(collectionName: string): BaseRepository<T> {
        if (!this.instances.has(collectionName)) {
            this.instances.set(collectionName, new BaseRepository<T>(collectionName));
        }
        return this.instances.get(collectionName) as BaseRepository<T>;
    }

    static async initialize(...entities: string[]): Promise<void> {
        for (const entityName of entities) {
            const repo = this.getInstance(entityName);
            await repo.initializeData();
        }
    }

    private async initializeData() {
        const entities = await this.db.getAll<T>(this.collectionName);
        this.observableManager.setInitialData(entities);
    }

    async get(id: string): Promise<T | null> {
        const entity = await this.db.get<T>(this.collectionName, id);
        return entity;
    }

    async find(options?: QueryOptions): Promise<T[]> {
        const entities = await this.db.getAll<T>(this.collectionName);
        let results = entities;

        if (options?.where) {
            results = results.filter(entity =>
                Object.entries(options.where as Record<string, any>).every(([key, value]) =>
                    entity[key as keyof T] === value
                )
            );
        }

        if (options?.orderBy) {
            const { field, direction } = options.orderBy;
            results.sort((a, b) => {
                const aVal = a[field as keyof T];
                const bVal = b[field as keyof T];
                return direction === 'asc'
                    ? aVal > bVal ? 1 : -1
                    : aVal < bVal ? 1 : -1;
            });
        }

        if (options?.limit) {
            results = results.slice(0, options.limit);
        }

        return results;
    }

    async save(entity: T): Promise<void> {
        const now = new Date();
        const isNew = !entity.id;

        if (isNew) {
            entity.id = crypto.randomUUID();
            entity.createdAt = now;
        }

        entity.updatedAt = now;

        await this.db.set(this.collectionName, entity.id, entity);
        this.observableManager.notifyChange({
            type: isNew ? 'create' : 'update',
            entity,
            id: entity.id
        });
    }

    async delete(id: string): Promise<void> {
        const entity = await this.get(id);
        if (entity) {
            await this.db.delete(this.collectionName, id);
            this.observableManager.notifyChange({
                type: 'delete',
                entity,
                id
            });
        }
    }

    observe(id: string): Observable<T | null> {
        return this.observableManager.observe(id);
    }

    observeAll(options?: QueryOptions): Observable<T[]> {
        return this.observableManager.observeCollection(options);
    }
}
