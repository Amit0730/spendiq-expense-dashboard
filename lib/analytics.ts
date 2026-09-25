import { Expense, CategoryStat, MonthlyStat, DailyStat, CategoryType } from '../types/expense';
import { CATEGORIES, CATEGORY_DETAILS } from './constants';

export interface DashboardMetrics {
  totalSpending: number;
  thisMonthSpending: number;
  todaySpending: number;
  avgDailySpending: number;
  transactionCount: number;
  largestExpense: Expense | null;
  topCategory: {
    category: CategoryType | null;
    total: number;
    percentage: number;
  };
}

/**
 * Calculates all primary dashboard metrics cleanly.
 */
export const calculateDashboardMetrics = (expenses: Expense[]): DashboardMetrics => {
  if (!expenses || expenses.length === 0) {
    return {
      totalSpending: 0,
      thisMonthSpending: 0,
      todaySpending: 0,
      avgDailySpending: 0,
      transactionCount: 0,
      largestExpense: null,
      topCategory: {
        category: null,
        total: 0,
        percentage: 0,
      },
    };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDay = now.getDate();
  const todayDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;

  let totalSpending = 0;
  let thisMonthSpending = 0;
  let todaySpending = 0;
  let largestExpense: Expense | null = null;
  const categoryTotals: Record<CategoryType, number> = {
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Entertainment: 0,
    Education: 0,
    Bills: 0,
    Health: 0,
    Travel: 0,
    Other: 0,
  };

  for (const exp of expenses) {
    const amt = Number(exp.amount) || 0;
    totalSpending += amt;

    // Check if expense is from today
    if (exp.date === todayDateStr) {
      todaySpending += amt;
    }

    // Check if expense is from this calendar month
    const [y, m] = exp.date.split('-').map(Number);
    if (y === currentYear && m === currentMonth + 1) {
      thisMonthSpending += amt;
    }

    // Check largest expense
    if (!largestExpense || amt > largestExpense.amount) {
      largestExpense = exp;
    }

    // Accumulate category totals
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += amt;
    } else {
      categoryTotals.Other += amt;
    }
  }

  // Average daily spending for this month (total this month / days elapsed so far this month)
  const avgDailySpending = todayDay > 0 ? thisMonthSpending / todayDay : 0;

  // Find top spending category
  let topCategoryName: CategoryType | null = null;
  let topCategoryTotal = 0;

  for (const cat of CATEGORIES) {
    const total = categoryTotals[cat];
    if (total > topCategoryTotal) {
      topCategoryTotal = total;
      topCategoryName = cat;
    }
  }

  const topCategoryPercentage = totalSpending > 0 ? (topCategoryTotal / totalSpending) * 100 : 0;

  return {
    totalSpending,
    thisMonthSpending,
    todaySpending,
    avgDailySpending,
    transactionCount: expenses.length,
    largestExpense,
    topCategory: {
      category: topCategoryName,
      total: topCategoryTotal,
      percentage: topCategoryPercentage,
    },
  };
};

/**
 * Computes breakdown by category for pie/donut charts and ranked lists.
 */
export const calculateCategoryStats = (expenses: Expense[]): CategoryStat[] => {
  if (!expenses || expenses.length === 0) return [];

  const categoryMap = new Map<CategoryType, { total: number; count: number }>();
  let grandTotal = 0;

  for (const exp of expenses) {
    const amt = Number(exp.amount) || 0;
    grandTotal += amt;
    const cat = exp.category;
    const existing = categoryMap.get(cat) || { total: 0, count: 0 };
    categoryMap.set(cat, {
      total: existing.total + amt,
      count: existing.count + 1,
    });
  }

  const stats: CategoryStat[] = [];
  for (const cat of CATEGORIES) {
    const data = categoryMap.get(cat);
    if (data && data.total > 0) {
      stats.push({
        category: cat,
        total: Number(data.total.toFixed(2)),
        percentage: grandTotal > 0 ? Number(((data.total / grandTotal) * 100).toFixed(1)) : 0,
        count: data.count,
        color: CATEGORY_DETAILS[cat].color,
      });
    }
  }

  // Sort highest first
  return stats.sort((a, b) => b.total - a.total);
};

/**
 * Computes monthly totals for the monthly bar / area charts.
 * Returns the last 6-12 months in chronological order.
 */
export const calculateMonthlyStats = (expenses: Expense[]): MonthlyStat[] => {
  if (!expenses || expenses.length === 0) return [];

  const map = new Map<string, { total: number; count: number }>();

  for (const exp of expenses) {
    if (!exp.date) continue;
    const monthKey = exp.date.substring(0, 7); // "YYYY-MM"
    const amt = Number(exp.amount) || 0;
    const existing = map.get(monthKey) || { total: 0, count: 0 };
    map.set(monthKey, {
      total: existing.total + amt,
      count: existing.count + 1,
    });
  }

  // Sort keys chronologically
  const sortedKeys = Array.from(map.keys()).sort();

  return sortedKeys.map((key) => {
    const [y, m] = key.split('-').map(Number);
    const dateObj = new Date(y, m - 1, 1);
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const fullLabel = `${monthName} '${String(y).slice(-2)}`;
    const data = map.get(key)!;
    return {
      monthKey: key,
      monthName: fullLabel,
      total: Number(data.total.toFixed(2)),
      count: data.count,
    };
  });
};

/**
 * Computes daily spending for the current month or recent period.
 */
export const calculateDailyStats = (expenses: Expense[], filterMonth?: string): DailyStat[] => {
  if (!expenses || expenses.length === 0) return [];

  const targetMonth = filterMonth || new Date().toISOString().substring(0, 7);
  const dailyMap = new Map<string, number>();

  for (const exp of expenses) {
    if (!exp.date || !exp.date.startsWith(targetMonth)) continue;
    const amt = Number(exp.amount) || 0;
    dailyMap.set(exp.date, (dailyMap.get(exp.date) || 0) + amt);
  }

  const sortedDates = Array.from(dailyMap.keys()).sort();

  return sortedDates.map((d) => {
    const [, m, day] = d.split('-').map(Number);
    const dateObj = new Date(Number(d.split('-')[0]), m - 1, day);
    const dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: d,
      dayLabel,
      amount: Number((dailyMap.get(d) || 0).toFixed(2)),
    };
  });
};
