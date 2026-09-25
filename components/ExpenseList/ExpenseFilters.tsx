'use client';

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../lib/constants';
import { exportExpensesToCSV } from '../../lib/export';
import {
  Search,
  X,
  Download,
  RotateCcw,
} from 'lucide-react';
import { DateFilterOption, SortOption } from '../../types/expense';

export const ExpenseFilters: React.FC = () => {
  const {
    filterState,
    setFilterState,
    resetFilters,
    expenses,
    filteredExpenses,
    settings,
  } = useExpenses();

  const isFiltered =
    filterState.searchQuery.trim() !== '' ||
    filterState.category !== 'All' ||
    filterState.dateFilter !== 'all' ||
    filterState.sortBy !== 'newest';

  const handleExportCSV = () => {
    exportExpensesToCSV(filteredExpenses.length > 0 ? filteredExpenses : expenses, settings.currencySymbol);
  };

  return (
    <div className="space-y-3">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by expense title, note, or category..."
            value={filterState.searchQuery}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full rounded-xl border border-gray-700 bg-gray-900/90 py-2.5 pl-9 pr-8 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 light:border-gray-300 light:bg-white light:text-gray-900"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white light:text-gray-500 light:hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filterState.category}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, category: e.target.value }))
              }
              aria-label="Filter by Category"
              className="h-9 rounded-xl border border-gray-700 bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 light:border-gray-300 light:bg-white light:text-gray-800"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <select
              value={filterState.dateFilter}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  dateFilter: e.target.value as DateFilterOption,
                }))
              }
              aria-label="Filter by Date Range"
              className="h-9 rounded-xl border border-gray-700 bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 light:border-gray-300 light:bg-white light:text-gray-800"
            >
              <option value="all">All Dates</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  sortBy: e.target.value as SortOption,
                }))
              }
              aria-label="Sort Expenses"
              className="h-9 rounded-xl border border-gray-700 bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 light:border-gray-300 light:bg-white light:text-gray-800"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_desc">Amount: High → Low</option>
              <option value="amount_asc">Amount: Low → High</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex h-9 items-center gap-1 rounded-xl border border-gray-700 bg-gray-800/80 px-2.5 text-xs font-medium text-gray-300 hover:border-gray-600 hover:text-white light:border-gray-300 light:bg-gray-100 light:text-gray-700 light:hover:bg-gray-200"
              title="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={expenses.length === 0}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 light:bg-emerald-50 light:text-emerald-700"
            title="Download CSV report"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Sub-Bar if selected */}
      {filterState.dateFilter === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-3 text-xs light:border-gray-200 light:bg-gray-50">
          <span className="text-gray-400 font-medium">Custom Range:</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">From</span>
            <input
              type="date"
              value={filterState.customStartDate || ''}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, customStartDate: e.target.value }))
              }
              className="rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1 text-xs text-white focus:border-emerald-500 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">To</span>
            <input
              type="date"
              value={filterState.customEndDate || ''}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, customEndDate: e.target.value }))
              }
              className="rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1 text-xs text-white focus:border-emerald-500 focus:outline-none light:border-gray-300 light:bg-white light:text-gray-900"
            />
          </div>
        </div>
      )}

      {/* Results Count & Filter Pill Summary */}
      <div className="flex items-center justify-between text-xs text-gray-400 light:text-gray-500 px-1">
        <span>
          Showing <strong className="text-white light:text-gray-900">{filteredExpenses.length}</strong> of{' '}
          {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'}
        </span>
      </div>
    </div>
  );
};
