// Core theme system and utilities
export * from './theme';
export * from './utils/platform';

// Component types and interfaces (implementation at app level)
export type { HomeScreenProps, Transaction } from './components/HomeScreen';
export type { SafeSpendAppProps } from './components/SafeSpendApp';

// Export styles
import './styles/index.css';
