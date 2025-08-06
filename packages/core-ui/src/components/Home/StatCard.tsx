import React from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'red';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  variant = 'blue',
  className = '',
}) => {
  const variantClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  const textOpacityClass = {
    blue: 'text-blue-100',
    purple: 'text-purple-100',
    pink: 'text-pink-100',
    green: 'text-green-100',
    orange: 'text-orange-100',
    red: 'text-red-100',
  };

  return (
    <div className={`bg-gradient-to-br ${variantClasses[variant]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm ${textOpacityClass[variant]} mb-1`}>{title}</p>
          <p className="text-2xl font-bold mb-1">{value}</p>
          {subtitle && (
            <p className={`text-xs ${textOpacityClass[variant]}`}>{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend.isPositive 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-red-500/20 text-red-100'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl opacity-80 ml-4">
          {icon}
        </div>
      </div>
    </div>
  );
};
