export type CategoryType =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Education'
  | 'Bills'
  | 'Health'
  | 'Travel'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}

export interface BudgetConfig {
  monthlyLimit: number;
  alertThreshold: number; // percentage (e.g. 80)
}

export interface UserSettings {
  currency: string;
  currencySymbol: string;
  theme: 'dark' | 'light' | 'system';
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'amount_desc'
  | 'amount_asc';

export type DateFilterOption =
  | 'all'
  | 'this_month'
  | 'last_month'
  | 'last_30_days'
  | 'custom';

export interface FilterState {
  searchQuery: string;
  category: string; // 'All' or specific CategoryType
  dateFilter: DateFilterOption;
  customStartDate?: string;
  customEndDate?: string;
  sortBy: SortOption;
}

export interface CategoryStat {
  category: CategoryType;
  total: number;
  percentage: number;
  count: number;
  color: string;
}

export interface MonthlyStat {
  monthKey: string; // "YYYY-MM"
  monthName: string; // "Jan", "Feb", etc.
  total: number;
  count: number;
}

export interface DailyStat {
  date: string; // "YYYY-MM-DD"
  dayLabel: string; // "Sep 25"
  amount: number;
}
