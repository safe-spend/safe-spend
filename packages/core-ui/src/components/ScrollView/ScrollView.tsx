/**
 * Platform-Aware ScrollView Component
 * Unified scroll container that works across web and React Native
 */

import React from 'react';
import { Theme } from '../../theme';

export interface ScrollViewProps {
  children: React.ReactNode;
  theme: Theme;
  style?: any;
  className?: string;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  horizontal?: boolean;
}

export const ScrollView: React.FC<ScrollViewProps> = ({
  children,
  theme,
  style = {},
  className,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = true,
  horizontal = false,
}) => {
  const scrollViewStyles = {
    overflow: 'auto',
    scrollbarWidth: showsVerticalScrollIndicator || showsHorizontalScrollIndicator ? 'auto' : 'none',
    msOverflowStyle: showsVerticalScrollIndicator || showsHorizontalScrollIndicator ? 'auto' : 'none',
    '&::-webkit-scrollbar': {
      display: showsVerticalScrollIndicator || showsHorizontalScrollIndicator ? 'block' : 'none',
    },
    ...(horizontal && {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'auto',
      overflowY: 'hidden',
    }),
    ...style,
  };

  return (
    <div style={scrollViewStyles} className={className}>
      {children}
    </div>
  );
};
