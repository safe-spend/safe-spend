/**
 * SafeSpend App Component
 * React Native-first main application component
 */

import React, { useState } from 'react';
import { Theme, getTheme, ThemeMode } from '../../theme';
import { HomeScreen, Transaction } from '../HomeScreen';

export interface SafeSpendAppProps {
  /**
   * Initial theme mode
   */
  initialTheme?: ThemeMode;
  /**
   * User's name for personalized greeting
   */
  userName?: string;
  /**
   * Current balance to display
   */
  currentBalance?: number;
  /**
   * Monthly spending data
   */
  monthlySpending?: number;
  /**
   * Monthly budget limit
   */
  monthlyBudget?: number;
  /**
   * Recent transactions data
   */
  recentTransactions?: Transaction[];
  /**
   * Quick action button handlers
   */
  onAddExpense?: () => void;
  onViewBudget?: () => void;
  onViewReports?: () => void;
  onViewSettings?: () => void;
  /**
   * Theme toggle handler
   */
  onThemeToggle?: (theme: ThemeMode) => void;
}

export const SafeSpendApp: React.FC<SafeSpendAppProps> = ({
  initialTheme = 'light',
  userName = 'User',
  currentBalance = 2847.32,
  monthlySpending = 1847.25,
  monthlyBudget = 2500.00,
  recentTransactions = [],
  onAddExpense,
  onViewBudget,
  onViewReports,
  onViewSettings,
  onThemeToggle,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  const theme = getTheme(themeMode);

  const toggleTheme = () => {
    const newTheme: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    onThemeToggle?.(newTheme);
  };

  return (
    <HomeScreen
      theme={theme}
      userName={userName}
      currentBalance={currentBalance}
      monthlySpending={monthlySpending}
      monthlyBudget={monthlyBudget}
      recentTransactions={recentTransactions}
      onAddExpense={onAddExpense}
      onViewBudget={onViewBudget}
      onViewReports={onViewReports}
      onViewSettings={onViewSettings}
      onThemeToggle={toggleTheme}
      isDarkMode={themeMode === 'dark'}
    />
  );
};
