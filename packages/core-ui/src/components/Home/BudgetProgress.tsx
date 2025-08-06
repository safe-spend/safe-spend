import React from 'react';

export interface BudgetProgressProps {
  spent: number;
  budget: number;
  title?: string;
  showDetails?: boolean;
  className?: string;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  budget,
  title = 'Budget Progress',
  showDetails = true,
  className = '',
}) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgressColor = () => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 75) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-green-600';
  };

  const getStatusBadge = () => {
    if (percentage >= 100) return 'bg-red-100 text-red-800';
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
          {percentage.toFixed(1)}% used
        </span>
      </div>
      
      {showDetails && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Spent: {formatCurrency(spent)}</span>
            <span>Budget: {formatCurrency(budget)}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              Remaining: {formatCurrency(Math.max(remaining, 0))}
            </span>
            {percentage > 100 && (
              <span className="text-sm text-red-600 font-medium">
                Over by {formatCurrency(Math.abs(remaining))}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
