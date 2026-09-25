import { Expense, BudgetConfig, UserSettings } from '../types/expense';
import { DEFAULT_BUDGET, DEFAULT_SETTINGS } from './constants';

const STORAGE_KEYS = {
  EXPENSES: 'spendiq_expenses_v1',
  BUDGET: 'spendiq_budget_v1',
  SETTINGS: 'spendiq_settings_v1',
  IS_DEMO: 'spendiq_is_demo_v1',
};

// Safe access helper
const isBrowser = (): boolean => typeof window !== 'undefined';

export const getStoredExpenses = (): Expense[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read expenses from localStorage:', err);
    return [];
  }
};

export const saveStoredExpenses = (expenses: Expense[]): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to localStorage:', err);
  }
};

export const getStoredBudget = (): BudgetConfig => {
  if (!isBrowser()) return DEFAULT_BUDGET;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!raw) return DEFAULT_BUDGET;
    const parsed = JSON.parse(raw);
    return {
      monthlyLimit: typeof parsed.monthlyLimit === 'number' && parsed.monthlyLimit > 0 ? parsed.monthlyLimit : DEFAULT_BUDGET.monthlyLimit,
      alertThreshold: typeof parsed.alertThreshold === 'number' ? parsed.alertThreshold : DEFAULT_BUDGET.alertThreshold,
    };
  } catch (err) {
    console.error('Failed to read budget from localStorage:', err);
    return DEFAULT_BUDGET;
  }
};

export const saveStoredBudget = (budget: BudgetConfig): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (err) {
    console.error('Failed to save budget to localStorage:', err);
  }
};

export const getStoredSettings = (): UserSettings => {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      currency: parsed.currency || DEFAULT_SETTINGS.currency,
      currencySymbol: parsed.currencySymbol || DEFAULT_SETTINGS.currencySymbol,
      theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : DEFAULT_SETTINGS.theme,
    };
  } catch (err) {
    console.error('Failed to read settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
};

export const getIsDemoMode = (): boolean => {
  if (!isBrowser()) return false;
  return localStorage.getItem(STORAGE_KEYS.IS_DEMO) === 'true';
};

export const setIsDemoMode = (isDemo: boolean): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.IS_DEMO, isDemo ? 'true' : 'false');
};

export const clearAllStoredData = (): void => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.BUDGET);
    localStorage.removeItem(STORAGE_KEYS.IS_DEMO);
    // Keep settings so theme/currency preference is respected, or optionally reset
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
};
