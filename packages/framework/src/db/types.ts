export interface Name {
    id: string;
    name: string;
    createdAt: string;
}

export interface Schema {
    names: Name[];
}
