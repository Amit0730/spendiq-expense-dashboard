'use client';

import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { MonthlySpendingChart } from '../Charts/MonthlySpendingChart';
import { CategoryPieChart } from '../Charts/CategoryPieChart';
import { DailySpendingChart } from '../Charts/DailySpendingChart';
import { CATEGORY_DETAILS } from '../../lib/constants';
import {
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  Flame,
  Award,
} from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  const { categoryStats, settings, expenses } = useExpenses();
  const { currencySymbol } = settings;
  const [activeTab, setActiveTab] = useState<'overview' | 'category' | 'monthly' | 'daily'>('overview');

  if (expenses.length === 0) {
    return null;
  }

  const topThreeCategories = categoryStats.slice(0, 3);

  return (
    <section className="space-y-4">
      {/* Header and Tab Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white light:text-gray-900 flex items-center gap-2">
            Spending Analytics & Intelligence
          </h2>
          <p className="text-xs text-gray-400 light:text-gray-500">
            Visual breakdown of category percentages, monthly volume, and daily velocity
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-gray-900/90 p-1 border border-gray-800 text-xs light:bg-gray-100 light:border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white light:text-gray-600 light:hover:text-gray-900'
            }`}
          >
            All Charts
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'category'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white light:text-gray-600 light:hover:text-gray-900'
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Category</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white light:text-gray-600 light:hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Monthly</span>
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white light:text-gray-600 light:hover:text-gray-900'
            }`}
          >
            <LineIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Daily</span>
          </button>
        </div>
      </div>

      {/* Highest Spending Categories Pods */}
      {topThreeCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topThreeCategories.map((cat, idx) => {
            const meta = CATEGORY_DETAILS[cat.category];
            const rankLabel = idx === 0 ? 'Top Spending Category' : idx === 1 ? '2nd Largest' : '3rd Largest';
            return (
              <div
                key={cat.category}
                className="glass-card flex items-center justify-between rounded-xl p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
                  >
                    {idx === 0 ? <Award className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-gray-400 light:text-gray-500">
                      {rankLabel}
                    </span>
                    <span className="block text-sm font-bold text-white light:text-gray-900">
                      {cat.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-white light:text-gray-900">
                    {currencySymbol}{cat.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[11px] font-semibold text-emerald-400 light:text-emerald-600">
                    {cat.percentage}% of spend
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Charts Layout */}
      {(activeTab === 'overview' || activeTab === 'category') && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Donut Chart */}
          <div className="glass-card rounded-2xl p-5 lg:col-span-6 xl:col-span-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-white light:text-gray-900 flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-emerald-400" />
                  Category Breakdown
                </h3>
                <p className="text-xs text-gray-400 light:text-gray-500">
                  Distribution of expenses by category
                </p>
              </div>
            </div>
            <CategoryPieChart />
          </div>

          {/* Category Percentages Detailed Progress Bar List */}
          <div className="glass-card rounded-2xl p-5 lg:col-span-6 xl:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white light:text-gray-900">
                  Category Percentages & Totals
                </h3>
                <span className="text-xs text-gray-400 light:text-gray-500">
                  {categoryStats.length} active categories
                </span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {categoryStats.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-gray-200 light:text-gray-800">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-gray-500 light:text-gray-400">
                          ({item.count} {item.count === 1 ? 'tx' : 'txs'})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white light:text-gray-900">
                          {currencySymbol}{item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="w-10 text-right font-mono text-[11px] text-gray-400 light:text-gray-500">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800/80 light:bg-gray-200">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Bar Chart */}
      {(activeTab === 'overview' || activeTab === 'monthly') && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white light:text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Monthly Spending Comparison
              </h3>
              <p className="text-xs text-gray-400 light:text-gray-500">
                Total spending volume per calendar month
              </p>
            </div>
          </div>
          <MonthlySpendingChart />
        </div>
      )}

      {/* Daily Line Chart */}
      {(activeTab === 'overview' || activeTab === 'daily') && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white light:text-gray-900 flex items-center gap-2">
                <LineIcon className="h-4 w-4 text-teal-400" />
                Daily Spending Velocity
              </h3>
              <p className="text-xs text-gray-400 light:text-gray-500">
                Day-by-day expenditure pattern throughout the active month
              </p>
            </div>
          </div>
          <DailySpendingChart />
        </div>
      )}
    </section>
  );
};
