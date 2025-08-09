import { Entity } from '../entities/Entity';

export interface DatabaseSchema {
    [collection: string]: {
        [id: string]: Entity;
    };
}

export interface QueryOptions {
    where?: Record<string, any>;
    orderBy?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    limit?: number;
}

export type EntityEvent<T> = {
    type: 'create' | 'update' | 'delete';
    entity: T;
    id: string;
};
