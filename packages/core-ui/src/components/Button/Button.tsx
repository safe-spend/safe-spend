import React from 'react';

export interface ButtonProps {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Button variant - now with creative options!
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'gradient' | 'glass' | 'neon' | 'magic';
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Is the button disabled?
   */
  disabled?: boolean;
  /**
   * Button click handler
   */
  onClick?: () => void;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Creative UI component for user interaction with stunning visual effects
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 transform overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white shadow-lg hover:shadow-2xl focus:ring-blue-300 hover:scale-105 active:scale-95',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg focus:ring-gray-300 hover:scale-105',
    danger: 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white shadow-lg hover:shadow-2xl focus:ring-red-300 hover:scale-105 active:scale-95',
    success: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-2xl focus:ring-green-300 hover:scale-105 active:scale-95',
    gradient: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white shadow-2xl hover:shadow-pink-500/25 focus:ring-pink-300 hover:scale-110 active:scale-100',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-800 hover:bg-white/20 shadow-xl hover:shadow-2xl focus:ring-white/30 hover:scale-105',
    neon: 'bg-black text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/80 focus:ring-cyan-300 hover:shadow-2xl hover:scale-105',
    magic: 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/25 focus:ring-purple-300 hover:scale-110 active:scale-95 animate-pulse hover:animate-none',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-w-[80px]',
    medium: 'px-6 py-3 text-base min-w-[120px]',
    large: 'px-8 py-4 text-lg min-w-[160px]',
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:shadow-none' 
    : 'cursor-pointer';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className,
  ].join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/20 via-transparent to-white/20"></span>
    </button>
  );
};
