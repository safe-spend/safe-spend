import React from 'react';
import { HomeScreen, Transaction } from '@safe-spend/core-ui';

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.50,
    category: 'Food',
    date: 'Today',
    type: 'expense',
  },
  {
    id: '2',
    title: 'Salary Deposit',
    amount: 3500.00,
    category: 'Salary',
    date: 'Yesterday',
    type: 'income',
  },
  {
    id: '3',
    title: 'Gas Station',
    amount: 45.00,
    category: 'Transport',
    date: '2 days ago',
    type: 'expense',
  },
  {
    id: '4',
    title: 'Movie Tickets',
    amount: 28.00,
    category: 'Entertainment',
    date: '3 days ago',
    type: 'expense',
  },
  {
    id: '5',
    title: 'Freelance Payment',
    amount: 750.00,
    category: 'Freelance',
    date: '4 days ago',
    type: 'income',
  },
];

export const HomeScreenDemo: React.FC = () => {
  const handleAddExpense = () => {
    console.log('Add Expense clicked');
  };

  const handleViewBudget = () => {
    console.log('View Budget clicked');
  };

  const handleViewReports = () => {
    console.log('View Reports clicked');
  };

  const handleViewSettings = () => {
    console.log('View Settings clicked');
  };

  return (
    <HomeScreen
      userName="Alex Johnson"
      currentBalance={2847.50}
      monthlySpending={1235.75}
      monthlyBudget={1500.00}
      recentTransactions={mockTransactions}
      onAddExpense={handleAddExpense}
      onViewBudget={handleViewBudget}
      onViewReports={handleViewReports}
      onViewSettings={handleViewSettings}
    />
  );
};
