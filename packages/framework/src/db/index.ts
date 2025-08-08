import { Schema } from './types';

// In-memory database
const db: { data: Schema } = {
    data: {
        names: []
    }
};

export const getDb = () => db.data;

// Utility functions for the names table
export const addName = (name: string): void => {
    try {
        const newName = {
            id: Date.now().toString(),
            name,
            createdAt: new Date().toISOString()
        };
        if (!db.data.names) {
            db.data.names = [];
        }
        db.data.names.push(newName);
    } catch (error) {
        console.error('Error adding name:', error);
        // Reset the database if it's corrupted
        db.data = { names: [] };
    }
};

export const getAllNames = (): Schema['names'] => {
    try {
        if (!db.data.names) {
            db.data.names = [];
        }
        return [...db.data.names];
    } catch (error) {
        console.error('Error getting names:', error);
        db.data = { names: [] };
        return [];
    }
};

export const getNameById = (id: string): Schema['names'][0] | undefined => {
    return db.data.names.find(name => name.id === id);
};

export const deleteName = (id: string): void => {
    const index = db.data.names.findIndex(name => name.id === id);
    if (index !== -1) {
        db.data.names.splice(index, 1);
    }
};

export const updateName = (id: string, newName: string): void => {
    const name = db.data.names.find(n => n.id === id);
    if (name) {
        name.name = newName;
    }
};
