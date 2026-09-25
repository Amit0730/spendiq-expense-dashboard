'use client';

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORY_DETAILS } from '../../lib/constants';
import {
  Wallet,
  Calendar,
  Clock,
  TrendingDown,
  ArrowUpRight,
  Flame,
} from 'lucide-react';

export const StatCards: React.FC = () => {
  const { metrics, settings } = useExpenses();
  const { currencySymbol } = settings;

  const formatMoney = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const topCategoryDetail = metrics.topCategory.category
    ? CATEGORY_DETAILS[metrics.topCategory.category]
    : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {/* 1. Total Spending */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:col-span-2 lg:col-span-2 xl:col-span-2">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 light:text-gray-600">Total Spending</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white light:text-gray-900">
            {formatMoney(metrics.totalSpending)}
          </div>
          <p className="mt-1 text-[11px] text-gray-400 light:text-gray-500">
            Across {metrics.transactionCount} total {metrics.transactionCount === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>
      </div>

      {/* 2. This Month's Spending */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 light:text-gray-600">This Month</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 light:bg-blue-50 light:text-blue-700">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold tracking-tight text-white light:text-gray-900">
            {formatMoney(metrics.thisMonthSpending)}
          </div>
          <p className="mt-1 text-[11px] text-blue-400/90 light:text-blue-600 font-medium">
            Active calendar month
          </p>
        </div>
      </div>

      {/* 3. Today's Spending */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 light:text-gray-600">Today</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 light:bg-amber-50 light:text-amber-700">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold tracking-tight text-white light:text-gray-900">
            {formatMoney(metrics.todaySpending)}
          </div>
          <p className="mt-1 text-[11px] text-gray-400 light:text-gray-500">
            Logged for today
          </p>
        </div>
      </div>

      {/* 4. Average Daily Spending */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 light:text-gray-600">Avg Daily</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 light:bg-indigo-50 light:text-indigo-700">
            <TrendingDown className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold tracking-tight text-white light:text-gray-900">
            {formatMoney(metrics.avgDailySpending)}
          </div>
          <p className="mt-1 text-[11px] text-gray-400 light:text-gray-500">
            Per day this month
          </p>
        </div>
      </div>

      {/* 5. Largest Expense */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 light:text-gray-600">Largest Expense</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 light:bg-rose-50 light:text-rose-700">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold tracking-tight text-white light:text-gray-900 truncate">
            {metrics.largestExpense ? formatMoney(metrics.largestExpense.amount) : `${currencySymbol}0.00`}
          </div>
          <p className="mt-1 text-[11px] text-gray-400 light:text-gray-500 truncate" title={metrics.largestExpense?.title || 'None'}>
            {metrics.largestExpense ? metrics.largestExpense.title : 'No expenses yet'}
          </p>
        </div>
      </div>

      {/* 6. Top Category */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 light:text-gray-600">Top Category</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 light:bg-purple-50 light:text-purple-700">
            <Flame className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold tracking-tight text-white light:text-gray-900 truncate">
            {topCategoryDetail ? topCategoryDetail.name : '—'}
          </div>
          <p className="mt-1 text-[11px] text-purple-400/90 light:text-purple-600 font-medium">
            {metrics.topCategory.category ? `${formatMoney(metrics.topCategory.total)} (${metrics.topCategory.percentage.toFixed(0)}%)` : 'No data'}
          </p>
        </div>
      </div>
    </div>
  );
};
