'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Expense,
  BudgetConfig,
  UserSettings,
  FilterState,
  CategoryStat,
  MonthlyStat,
  DailyStat,
} from '../types/expense';
import {
  DEFAULT_BUDGET,
  DEFAULT_SETTINGS,
  generateDemoExpenses,
} from '../lib/constants';
import {
  getStoredExpenses,
  saveStoredExpenses,
  getStoredBudget,
  saveStoredBudget,
  getStoredSettings,
  saveStoredSettings,
  getIsDemoMode,
  setIsDemoMode,
  clearAllStoredData,
} from '../lib/storage';
import {
  calculateDashboardMetrics,
  calculateCategoryStats,
  calculateMonthlyStats,
  calculateDailyStats,
  DashboardMetrics,
} from '../lib/analytics';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  budget: BudgetConfig;
  settings: UserSettings;
  isMounted: boolean;
  isDemoMode: boolean;
  filterState: FilterState;
  metrics: DashboardMetrics;
  categoryStats: CategoryStat[];
  monthlyStats: MonthlyStat[];
  dailyStats: DailyStat[];
  
  // Actions
  addExpense: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updatedData: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (newLimit: number) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  loadDemoData: () => void;
  resetAllData: () => void;

  // UI state
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;
  isResetModalOpen: boolean;
  setIsResetModalOpen: (open: boolean) => void;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  category: 'All',
  dateFilter: 'all',
  sortBy: 'newest',
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<BudgetConfig>(DEFAULT_BUDGET);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isDemoMode, setIsDemoState] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Filter & Search State
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Initial load from localStorage
  useEffect(() => {
    const loadedExpenses = getStoredExpenses();
    const loadedBudget = getStoredBudget();
    const loadedSettings = getStoredSettings();
    const loadedDemo = getIsDemoMode();

    setExpenses(loadedExpenses);
    setBudget(loadedBudget);
    setSettings(loadedSettings);
    setIsDemoState(loadedDemo);
    setIsMounted(true);

    // Apply dark/light theme class to documentElement
    if (loadedSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save changes to localStorage
  const handleSaveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    saveStoredExpenses(newExpenses);
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    const updated = [newExpense, ...expenses];
    handleSaveExpenses(updated);
  };

  const updateExpense = (id: string, updatedData: Partial<Expense>) => {
    const updated = expenses.map((exp) => (exp.id === id ? { ...exp, ...updatedData } : exp));
    handleSaveExpenses(updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    handleSaveExpenses(updated);
  };

  const updateBudget = (newLimit: number) => {
    const newBudget: BudgetConfig = {
      ...budget,
      monthlyLimit: Math.max(0, newLimit),
    };
    setBudget(newBudget);
    saveStoredBudget(newBudget);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);

    if (updated.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  const loadDemoData = () => {
    const demo = generateDemoExpenses();
    handleSaveExpenses(demo);
    setIsDemoState(true);
    setIsDemoMode(true);
    const demoBudget = { monthlyLimit: 2800, alertThreshold: 80 };
    setBudget(demoBudget);
    saveStoredBudget(demoBudget);
  };

  const resetAllData = () => {
    clearAllStoredData();
    setExpenses([]);
    setIsDemoState(false);
    setIsDemoMode(false);
    setBudget(DEFAULT_BUDGET);
    saveStoredBudget(DEFAULT_BUDGET);
    resetFilters();
  };

  // Filtered & Sorted Expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search query filter (title or note or category)
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(q) ||
          (exp.note && exp.note.toLowerCase().includes(q)) ||
          exp.category.toLowerCase().includes(q) ||
          exp.amount.toString().includes(q)
      );
    }

    // Category filter
    if (filterState.category && filterState.category !== 'All') {
      result = result.filter((exp) => exp.category === filterState.category);
    }

    // Date range filter
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (filterState.dateFilter === 'this_month') {
      result = result.filter((exp) => {
        const [y, m] = exp.date.split('-').map(Number);
        return y === currentYear && m === currentMonth + 1;
      });
    } else if (filterState.dateFilter === 'last_month') {
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const lmY = lastMonthDate.getFullYear();
      const lmM = lastMonthDate.getMonth() + 1;
      result = result.filter((exp) => {
        const [y, m] = exp.date.split('-').map(Number);
        return y === lmY && m === lmM;
      });
    } else if (filterState.dateFilter === 'last_30_days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
      result = result.filter((exp) => exp.date >= thirtyDaysAgoStr);
    } else if (filterState.dateFilter === 'custom') {
      if (filterState.customStartDate) {
        result = result.filter((exp) => exp.date >= filterState.customStartDate!);
      }
      if (filterState.customEndDate) {
        result = result.filter((exp) => exp.date <= filterState.customEndDate!);
      }
    }

    // Sorting
    result.sort((a, b) => {
      if (filterState.sortBy === 'newest') {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return dateDiff !== 0 ? dateDiff : b.createdAt - a.createdAt;
      }
      if (filterState.sortBy === 'oldest') {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return dateDiff !== 0 ? dateDiff : a.createdAt - b.createdAt;
      }
      if (filterState.sortBy === 'amount_desc') {
        return b.amount - a.amount;
      }
      if (filterState.sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [expenses, filterState]);

  // Derived Analytics
  const metrics = useMemo(() => calculateDashboardMetrics(expenses), [expenses]);
  const categoryStats = useMemo(() => calculateCategoryStats(expenses), [expenses]);
  const monthlyStats = useMemo(() => calculateMonthlyStats(expenses), [expenses]);
  const dailyStats = useMemo(() => calculateDailyStats(expenses), [expenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        budget,
        settings,
        isMounted,
        isDemoMode,
        filterState,
        metrics,
        categoryStats,
        monthlyStats,
        dailyStats,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudget,
        updateSettings,
        setFilterState,
        resetFilters,
        loadDemoData,
        resetAllData,
        isAddModalOpen,
        setIsAddModalOpen,
        editingExpense,
        setEditingExpense,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isResetModalOpen,
        setIsResetModalOpen,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
