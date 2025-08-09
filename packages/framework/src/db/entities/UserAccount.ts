import { Entity } from "./Entity";

export interface UserAccount extends Entity {
    name: string;
    email: string;
}