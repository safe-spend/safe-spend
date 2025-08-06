/**
 * SafeSpend Design System - Theme Configuration
 * Unified theme system for both web and React Native platforms
 */

export interface Theme {
  colors: {
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    // Secondary colors
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    
    // Background colors
    background: string;
    backgroundSecondary: string;
    surface: string;
    surfaceSecondary: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Accent colors
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
    
    // Border colors
    border: string;
    borderLight: string;
    
    // Shadow colors
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    fontSizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
    fontWeights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#1d4ed8',
    
    secondary: '#8b5cf6',
    secondaryLight: '#a78bfa',
    secondaryDark: '#7c3aed',
    
    background: '#f8fafc',
    backgroundSecondary: '#f1f5f9',
    surface: '#ffffff',
    surfaceSecondary: '#f9fafb',
    
    text: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    
    accent1: '#ec4899',
    accent2: '#8b5cf6',
    accent3: '#06b6d4',
    accent4: '#10b981',
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#60a5fa',
    primaryLight: '#93c5fd',
    primaryDark: '#3b82f6',
    
    secondary: '#a78bfa',
    secondaryLight: '#c4b5fd',
    secondaryDark: '#8b5cf6',
    
    background: '#1f2937',
    backgroundSecondary: '#111827',
    surface: '#374151',
    surfaceSecondary: '#4b5563',
    
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee',
    
    accent1: '#f472b6',
    accent2: '#a78bfa',
    accent3: '#22d3ee',
    accent4: '#34d399',
    
    border: '#4b5563',
    borderLight: '#374151',
    
    shadow: '#000000',
  },
};

export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
