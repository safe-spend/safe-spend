// Shared utilities and types for Safe Spend

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  category: string;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateBudgetProgress = (budget: Budget): number => {
  return Math.min((budget.spent / budget.limit) * 100, 100);
};
