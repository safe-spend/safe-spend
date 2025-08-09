import { BehaviorSubject, Observable, map } from 'rxjs';
import { Entity } from '../entities/Entity';
import { EntityEvent, QueryOptions } from './types';

export class ObservableManager<T extends Entity> {
    private entitySubjects = new Map<string, {
        subject: BehaviorSubject<T | null>;
        refCount: number;
    }>();

    private collectionSubject = new BehaviorSubject<Map<string, T>>(new Map());

    // Single entity observable
    observe(id: string): Observable<T | null> {
        let entry = this.entitySubjects.get(id);
        
        if (!entry) {
            entry = {
                subject: new BehaviorSubject<T | null>(null),
                refCount: 0
            };
            this.entitySubjects.set(id, entry);
        }

        entry.refCount++;

        return new Observable<T | null>(subscriber => {
            const subscription = entry!.subject.subscribe(subscriber);
            
            return () => {
                subscription.unsubscribe();
                entry!.refCount--;
                if (entry!.refCount === 0) {
                    entry!.subject.complete();
                    this.entitySubjects.delete(id);
                }
            };
        });
    }

    // Collection observable with query support
    observeCollection(options?: QueryOptions): Observable<T[]> {
        return this.collectionSubject.pipe(
            map(collection => {
                let results = Array.from(collection.values());

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
            })
        );
    }

    // Update methods
    notifyChange(event: EntityEvent<T>): void {
        const collection = new Map(this.collectionSubject.value);
        
        switch (event.type) {
            case 'create':
            case 'update':
                collection.set(event.id, event.entity);
                this.collectionSubject.next(collection);
                this.entitySubjects.get(event.id)?.subject.next(event.entity);
                break;
                
            case 'delete':
                collection.delete(event.id);
                this.collectionSubject.next(collection);
                this.entitySubjects.get(event.id)?.subject.next(null);
                break;
        }
    }

    // Bulk update for initial data load
    setInitialData(entities: T[]): void {
        const collection = new Map();
        entities.forEach(entity => {
            collection.set(entity.id, entity);
            this.entitySubjects.get(entity.id)?.subject.next(entity);
        });
        this.collectionSubject.next(collection);
    }
}
