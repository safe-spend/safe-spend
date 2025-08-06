/**
 * Platform-Aware Text Component
 * Unified text component that works across web and React Native
 */

import React from 'react';
import { Theme } from '../../theme';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'label';
  color?: keyof Theme['colors'];
  weight?: keyof Theme['typography']['fontWeights'];
  align?: 'left' | 'center' | 'right';
  theme: Theme;
  style?: any;
  numberOfLines?: number;
  onPress?: () => void;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'text',
  weight = 'normal',
  align = 'left',
  theme,
  style = {},
  numberOfLines,
  onPress,
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'heading1':
        return {
          fontSize: theme.typography.fontSizes.xxxl,
          lineHeight: theme.typography.lineHeights.tight,
          fontWeight: theme.typography.fontWeights.bold,
        };
      case 'heading2':
        return {
          fontSize: theme.typography.fontSizes.xxl,
          lineHeight: theme.typography.lineHeights.tight,
          fontWeight: theme.typography.fontWeights.bold,
        };
      case 'heading3':
        return {
          fontSize: theme.typography.fontSizes.xl,
          lineHeight: theme.typography.lineHeights.tight,
          fontWeight: theme.typography.fontWeights.semibold,
        };
      case 'body':
        return {
          fontSize: theme.typography.fontSizes.md,
          lineHeight: theme.typography.lineHeights.normal,
          fontWeight: theme.typography.fontWeights.normal,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSizes.sm,
          lineHeight: theme.typography.lineHeights.normal,
          fontWeight: theme.typography.fontWeights.normal,
        };
      case 'label':
        return {
          fontSize: theme.typography.fontSizes.xs,
          lineHeight: theme.typography.lineHeights.normal,
          fontWeight: theme.typography.fontWeights.medium,
        };
      default:
        return {};
    }
  };

  const textStyles = {
    ...getVariantStyles(),
    color: theme.colors[color],
    fontWeight: theme.typography.fontWeights[weight],
    textAlign: align,
    ...style,
  };

  // Web implementation
  const Tag = variant.startsWith('heading') ? variant.replace('heading', 'h') : 'span';
  
  return React.createElement(
    Tag,
    {
      style: textStyles,
      onClick: onPress,
      className,
    },
    children
  );
};
