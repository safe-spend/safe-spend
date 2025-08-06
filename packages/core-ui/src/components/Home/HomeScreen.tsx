import React from 'react';
import { Theme } from '../../theme';
import { Button } from '../Button/Button';
import { QuickActionCard } from './QuickActionCard';
import { BudgetProgress } from './BudgetProgress';
import { TransactionList, Transaction } from './TransactionList';
import { StatCard } from './StatCard';

export interface HomeScreenProps {
  /**
   * Theme object for consistent styling
   */
  theme: Theme;
  /**
   * Whether dark mode is enabled
   */
  isDarkMode?: boolean;
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
  onThemeToggle?: () => void;
}

/**
 * SafeSpend Home Screen - A comprehensive dashboard for expense tracking
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme,
  isDarkMode = false,
  userName = 'User',
  currentBalance = 0,
  monthlySpending = 0,
  monthlyBudget = 1000,
  recentTransactions = [],
  onAddExpense,
  onViewBudget,
  onViewReports,
  onViewSettings,
  onThemeToggle,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, <span className="text-purple-600">{userName}!</span>
              </h1>
              <p className="text-gray-600 mt-1">Here's your financial overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(currentBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            icon="💰"
            title="Add Expense"
            variant="primary"
            onClick={onAddExpense}
          />
          <QuickActionCard
            icon="📊"
            title="Budget"
            variant="gradient"
            onClick={onViewBudget}
          />
          <QuickActionCard
            icon="�"
            title="Reports"
            variant="glass"
            onClick={onViewReports}
          />
          <QuickActionCard
            icon="⚙️"
            title="Settings"
            variant="neon"
            onClick={onViewSettings}
          />
        </div>

        {/* Budget Overview */}
        <BudgetProgress
          spent={monthlySpending}
          budget={monthlyBudget}
          title="Monthly Budget"
        />

        {/* Recent Transactions */}
        <TransactionList
          transactions={recentTransactions}
          title="Recent Transactions"
          maxItems={5}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="This Week"
            value={formatCurrency(monthlySpending * 0.25)}
            icon="📅"
            variant="blue"
            subtitle="Weekly spending"
          />
          
          <StatCard
            title="Avg Daily"
            value={formatCurrency(monthlySpending / 30)}
            icon="📊"
            variant="purple"
            subtitle="Daily average"
          />
          
          <StatCard
            title="Categories"
            value={new Set(recentTransactions.map(t => t.category)).size.toString()}
            icon="🏷️"
            variant="pink"
            subtitle="Active categories"
          />
        </div>

      </div>
    </div>
  );
};
