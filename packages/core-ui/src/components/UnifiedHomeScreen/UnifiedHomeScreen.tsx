/**
 * Unified HomeScreen Component
 * Platform-agnostic home screen using core-ui components
 */

import React from 'react';
import { Theme } from '../../theme';
import { Container } from '../Container';
import { Text } from '../Text';
import { ScrollView } from '../ScrollView';
import { formatCurrency } from '../../utils/platform';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface UnifiedHomeScreenProps {
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

export const UnifiedHomeScreen: React.FC<UnifiedHomeScreenProps> = ({
  theme,
  isDarkMode = false,
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
  const remainingBudget = monthlyBudget - monthlySpending;
  const budgetPercentage = (monthlySpending / monthlyBudget) * 100;

  const getBudgetBarColor = () => {
    if (budgetPercentage >= 90) return theme.colors.error;
    if (budgetPercentage >= 75) return theme.colors.warning;
    return theme.colors.success;
  };

  const QuickActionButton = ({ 
    icon, 
    title, 
    backgroundColor, 
    textColor = 'white',
    onPress 
  }: {
    icon: string;
    title: string;
    backgroundColor: string;
    textColor?: string;
    onPress?: () => void;
  }) => (
    <Container
      theme={theme}
      backgroundColor="surface"
      borderRadius="xl"
      shadow="md"
      padding="lg"
      onPress={onPress}
      style={{
        backgroundColor,
        flex: 1,
        minWidth: '45%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <Text theme={theme} style={{ fontSize: 24, marginBottom: 4 }}>
        {icon}
      </Text>
      <Text theme={theme} variant="caption" weight="semibold" style={{ color: textColor }}>
        {title}
      </Text>
    </Container>
  );

  const StatCardComponent = ({
    icon,
    label,
    value,
    backgroundColor,
  }: {
    icon: string;
    label: string;
    value: string;
    backgroundColor: string;
  }) => (
    <Container
      theme={theme}
      backgroundColor="surface"
      borderRadius="xl"
      shadow="md"
      padding="md"
      flex={1}
      style={{
        backgroundColor,
        alignItems: 'center',
      }}
    >
      <Text theme={theme} style={{ fontSize: 24, marginBottom: 8 }}>
        {icon}
      </Text>
      <Text theme={theme} variant="label" style={{ color: 'white', opacity: 0.8, marginBottom: 4 }}>
        {label}
      </Text>
      <Text theme={theme} variant="body" weight="bold" style={{ color: 'white' }}>
        {value}
      </Text>
    </Container>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <Container
      theme={theme}
      backgroundColor={isDarkMode ? 'surfaceSecondary' : 'backgroundSecondary'}
      borderRadius="lg"
      padding="md"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ marginTop: 12 }}
    >
      <Container theme={theme} flexDirection="row" alignItems="center" flex={1}>
        <Container
          theme={theme}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: transaction.type === 'income' ? theme.colors.success : theme.colors.error,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text theme={theme} weight="bold" style={{ color: 'white', fontSize: 16 }}>
            {transaction.type === 'income' ? '+' : '-'}
          </Text>
        </Container>
        <Container theme={theme}>
          <Text theme={theme} variant="body" weight="semibold" color="text">
            {transaction.title}
          </Text>
          <Text theme={theme} variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
            {transaction.category} • {transaction.date}
          </Text>
        </Container>
      </Container>
      <Text
        theme={theme}
        variant="body"
        weight="bold"
        style={{
          color: transaction.type === 'income' ? theme.colors.success : theme.colors.error,
        }}
      >
        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
      </Text>
    </Container>
  );

  return (
    <Container
      theme={theme}
      backgroundColor="background"
      flex={1}
      style={{ minHeight: '100vh' }}
    >
      <ScrollView theme={theme} showsVerticalScrollIndicator={false}>
        <Container theme={theme} padding="md" style={{ gap: 16 }}>
          {/* Header Section */}
          <Container
            theme={theme}
            backgroundColor="surface"
            borderRadius="xl"
            shadow="md"
            padding="xl"
          >
            <Container theme={theme} flexDirection="row" justifyContent="space-between" alignItems="center">
              <Container theme={theme}>
                <Text theme={theme} variant="heading2" color="text">
                  Welcome back,{' '}
                  <Text theme={theme} variant="heading2" color="secondary">
                    {userName}!
                  </Text>
                </Text>
                <Text theme={theme} variant="body" color="textSecondary" style={{ marginTop: 4 }}>
                  Here's your financial overview
                </Text>
              </Container>
              <Container theme={theme} style={{ alignItems: 'flex-end' }}>
                <Text theme={theme} variant="caption" color="textSecondary">
                  Current Balance
                </Text>
                <Text
                  theme={theme}
                  variant="heading2"
                  weight="bold"
                  style={{
                    color: currentBalance >= 0 ? theme.colors.success : theme.colors.error,
                  }}
                >
                  {formatCurrency(currentBalance)}
                </Text>
              </Container>
            </Container>
          </Container>

          {/* Quick Actions */}
          <Container
            theme={theme}
            flexDirection="row"
            style={{ flexWrap: 'wrap', gap: 12 }}
          >
            <QuickActionButton
              icon="💰"
              title="Add Expense"
              backgroundColor={theme.colors.primary}
              onPress={onAddExpense}
            />
            <QuickActionButton
              icon="📊"
              title="Budget"
              backgroundColor={theme.colors.accent1}
              onPress={onViewBudget}
            />
            <QuickActionButton
              icon="📈"
              title="Reports"
              backgroundColor={theme.colors.borderLight}
              textColor={theme.colors.text}
              onPress={onViewReports}
            />
            <QuickActionButton
              icon="⚙️"
              title="Settings"
              backgroundColor="#000000"
              textColor={theme.colors.info}
              onPress={onViewSettings}
            />
          </Container>

          {/* Budget Overview */}
          <Container
            theme={theme}
            backgroundColor="surface"
            borderRadius="xl"
            shadow="md"
            padding="xl"
          >
            <Container theme={theme} flexDirection="row" justifyContent="space-between" alignItems="center" style={{ marginBottom: 16 }}>
              <Text theme={theme} variant="heading3" color="text">
                Monthly Budget
              </Text>
              <Container
                theme={theme}
                borderRadius="xl"
                padding="sm"
                style={{
                  backgroundColor: budgetPercentage >= 90 ? '#fef2f2' : budgetPercentage >= 75 ? '#fffbeb' : '#f0fdf4',
                }}
              >
                <Text
                  theme={theme}
                  variant="caption"
                  weight="semibold"
                  style={{
                    color: budgetPercentage >= 90 ? '#dc2626' : budgetPercentage >= 75 ? '#d97706' : '#16a34a',
                  }}
                >
                  {budgetPercentage.toFixed(1)}% used
                </Text>
              </Container>
            </Container>

            <Container theme={theme} style={{ gap: 12 }}>
              <Container theme={theme} flexDirection="row" justifyContent="space-between">
                <Text theme={theme} variant="caption" color="textSecondary">
                  Spent: {formatCurrency(monthlySpending)}
                </Text>
                <Text theme={theme} variant="caption" color="textSecondary">
                  Budget: {formatCurrency(monthlyBudget)}
                </Text>
              </Container>

              <Container theme={theme} style={{ marginVertical: 8 }}>
                <Container
                  theme={theme}
                  style={{
                    height: 12,
                    backgroundColor: theme.colors.border,
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  <Container
                    theme={theme}
                    style={{
                      height: '100%',
                      width: `${Math.min(budgetPercentage, 100)}%`,
                      backgroundColor: getBudgetBarColor(),
                      borderRadius: 6,
                    }}
                  >
                    {/* Empty container for progress bar fill */}
                  </Container>
                </Container>
              </Container>

              <Container theme={theme} flexDirection="row" justifyContent="space-between">
                <Text theme={theme} variant="caption" color="textSecondary">
                  Remaining: {formatCurrency(Math.max(remainingBudget, 0))}
                </Text>
                {budgetPercentage > 100 && (
                  <Text theme={theme} variant="caption" weight="semibold" color="error">
                    Over by {formatCurrency(Math.abs(remainingBudget))}
                  </Text>
                )}
              </Container>
            </Container>
          </Container>

          {/* Recent Transactions */}
          <Container
            theme={theme}
            backgroundColor="surface"
            borderRadius="xl"
            shadow="md"
            padding="xl"
          >
            <Text theme={theme} variant="heading3" color="text" style={{ marginBottom: 16 }}>
              Recent Transactions
            </Text>

            {recentTransactions.slice(0, 5).map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </Container>

          {/* Statistics */}
          <Container theme={theme} flexDirection="row" style={{ gap: 12 }}>
            <StatCardComponent
              icon="📅"
              label="This Week"
              value={formatCurrency(monthlySpending * 0.25)}
              backgroundColor={theme.colors.primary}
            />
            <StatCardComponent
              icon="📊"
              label="Avg Daily"
              value={formatCurrency(monthlySpending / 30)}
              backgroundColor={theme.colors.accent2}
            />
            <StatCardComponent
              icon="🏷️"
              label="Categories"
              value={`${new Set(recentTransactions.map(t => t.category)).size}`}
              backgroundColor={theme.colors.accent1}
            />
          </Container>

          {/* Theme Toggle Button */}
          {onThemeToggle && (
            <Container theme={theme} style={{ alignItems: 'center', marginTop: 16 }}>
              <Container
                theme={theme}
                backgroundColor="surface"
                borderRadius="full"
                shadow="md"
                padding="md"
                onPress={onThemeToggle}
                style={{
                  cursor: 'pointer',
                  paddingHorizontal: 24,
                }}
              >
                <Text theme={theme} variant="body" weight="semibold" color="text">
                  {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </Text>
              </Container>
            </Container>
          )}
        </Container>
      </ScrollView>
    </Container>
  );
};
