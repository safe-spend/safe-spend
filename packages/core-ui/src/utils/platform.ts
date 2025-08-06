/**
 * Platform Detection and Utilities
 * Provides utilities to detect platform and handle platform-specific styling
 */

// Platform detection for web vs React Native
export const isReactNative = (): boolean => {
  return typeof window === 'undefined' && typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
};

export const isWeb = (): boolean => {
  return !isReactNative();
};

// CSS property utilities for web
export const webStyle = (style: Record<string, any>) => {
  return isWeb() ? style : {};
};

// React Native style utilities
export const nativeStyle = (style: Record<string, any>) => {
  return isReactNative() ? style : {};
};

// Platform-specific style merger
export const platformStyle = (webStyles: Record<string, any>, nativeStyles: Record<string, any>) => {
  return isWeb() ? webStyles : nativeStyles;
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get platform-specific component
export const getPlatformComponent = <T>(webComponent: T, nativeComponent: T): T => {
  return isWeb() ? webComponent : nativeComponent;
};
