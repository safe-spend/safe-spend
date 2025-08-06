/**
 * Platform-Aware Container Component
 * Unified container component that works across web and React Native
 */

import React from 'react';
import { Theme } from '../../theme';

export interface ContainerProps {
  children: React.ReactNode;
  theme: Theme;
  padding?: keyof Theme['spacing'];
  margin?: keyof Theme['spacing'];
  backgroundColor?: keyof Theme['colors'];
  borderRadius?: keyof Theme['borderRadius'];
  shadow?: keyof Theme['shadows'];
  flex?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  style?: any;
  className?: string;
  onPress?: () => void;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  theme,
  padding,
  margin,
  backgroundColor,
  borderRadius,
  shadow,
  flex,
  flexDirection = 'column',
  justifyContent,
  alignItems,
  style = {},
  className,
  onPress,
}) => {
  const containerStyles = {
    ...(padding && { padding: theme.spacing[padding] }),
    ...(margin && { margin: theme.spacing[margin] }),
    ...(backgroundColor && { backgroundColor: theme.colors[backgroundColor] }),
    ...(borderRadius && { borderRadius: theme.borderRadius[borderRadius] }),
    ...(shadow && theme.shadows[shadow]),
    ...(flex && { flex }),
    display: 'flex',
    flexDirection,
    ...(justifyContent && { justifyContent }),
    ...(alignItems && { alignItems }),
    ...style,
  };

  if (onPress) {
    return (
      <div
        style={{ ...containerStyles, cursor: 'pointer' }}
        onClick={onPress}
        className={className}
      >
        {children}
      </div>
    );
  }

  return (
    <div style={containerStyles} className={className}>
      {children}
    </div>
  );
};
