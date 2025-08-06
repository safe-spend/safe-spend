import React from 'react';

export interface QuickActionCardProps {
  icon: string;
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gradient' | 'glass' | 'neon';
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  onClick,
  variant = 'primary',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
    secondary: 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300',
    gradient: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-gray-800 hover:bg-white/30',
    neon: 'bg-black text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black shadow-lg shadow-cyan-400/30',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        rounded-2xl p-6 shadow-lg hover:shadow-xl
        transition-all duration-300 transform hover:scale-105 active:scale-95
        flex flex-col items-center justify-center space-y-2
        min-h-[120px] w-full
        ${className}
      `}
    >
      <span className="text-3xl">{icon}</span>
      <span className="font-semibold text-sm text-center">{title}</span>
    </button>
  );
};
