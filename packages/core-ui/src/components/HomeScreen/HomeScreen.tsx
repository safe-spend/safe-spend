/**
 * HomeScreen Component Interface
 * Platform-agnostic types and logic, React Native components imported at runtime
 */

import React from 'react';
import { Theme } from '../../theme';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface HomeScreenProps {
  theme: Theme;
  isDarkMode?: boolean;
  userName?: string;
  currentBalance?: number;
  monthlySpending?: number;
  monthlyBudget?: number;
  recentTransactions?: Transaction[];
  onAddExpense?: () => void;
  onViewBudget?: () => void;
  onViewReports?: () => void;
  onViewSettings?: () => void;
  onThemeToggle?: () => void;
}

// This will be implemented at the application level with React Native components
export const HomeScreen: React.FC<HomeScreenProps> = () => {
  throw new Error('HomeScreen must be implemented with React Native components at the application level');
};
