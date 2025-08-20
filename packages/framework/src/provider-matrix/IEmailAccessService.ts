import { Account } from "../db/entities/Account";
import { Email } from "./types/Email";

export interface IEmailAccessService {
  fetchEmail: (account: Account, id: string) => Promise<Email>;
}