// Type definitions for Safe Spend
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
}
