import React from 'react';
import { Button } from '../Button/Button';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  icon?: string;
}

export interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  title = 'Recent Transactions',
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  onTransactionClick,
  className = '',
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryIcon = (category: string, type: 'income' | 'expense') => {
    const icons: Record<string, string> = {
      'Food': '🍽️',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills': '📄',
      'Healthcare': '🏥',
      'Education': '📚',
      'Salary': '💰',
      'Freelance': '💻',
      'Investment': '📈',
      'Gift': '🎁',
      'Other': type === 'income' ? '💰' : '💸',
    };
    return icons[category] || icons['Other'];
  };

  const displayTransactions = transactions.slice(0, maxItems);

  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {showViewAll && transactions.length > maxItems && (
          <Button variant="secondary" size="small" onClick={onViewAll}>
            View All ({transactions.length})
          </Button>
        )}
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h4 className="text-lg font-medium mb-2">No transactions yet</h4>
          <p className="text-sm">Start tracking your expenses to see them here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-all duration-200 cursor-pointer hover:shadow-md"
              onClick={() => onTransactionClick?.(transaction)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                  transaction.type === 'income' 
                    ? 'bg-gradient-to-br from-green-500 to-green-600' 
                    : 'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  {transaction.icon || getCategoryIcon(transaction.category, transaction.type)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{transaction.title}</p>
                  <p className="text-sm text-gray-500 flex items-center space-x-2">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.date}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </div>
                <div className="text-xs text-gray-400">
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
