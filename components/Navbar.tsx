'use client';

import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CURRENCY_OPTIONS } from '../lib/constants';
import {
  Plus,
  Moon,
  Sun,
  Database,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    setIsAddModalOpen,
    setIsResetModalOpen,
    loadDemoData,
    isDemoMode,
    expenses,
    metrics,
  } = useExpenses();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CURRENCY_OPTIONS.find((c) => c.code === e.target.value);
    if (selected) {
      updateSettings({
        currency: selected.code,
        currencySymbol: selected.symbol,
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#090d16]/85 backdrop-blur-md dark:border-gray-800 dark:bg-[#090d16]/85 light:border-gray-200 light:bg-white/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white light:text-gray-900">
                Spend<span className="text-emerald-500">IQ</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-400 border border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-gray-400 light:text-gray-500 hidden sm:block">
              Personal Expense Intelligence
            </p>
          </div>
        </div>

        {/* Global Stats preview on desktop */}
        {expenses.length > 0 && (
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-gray-800 text-gray-300 light:bg-gray-100 light:border-gray-200 light:text-gray-700">
              <span className="text-gray-500 light:text-gray-400">Total Tracked:</span>
              <span className="font-semibold text-emerald-400 light:text-emerald-600">
                {settings.currencySymbol}
                {metrics.totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {isDemoMode && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-400 light:bg-amber-50 light:text-amber-700">
                <Sparkles className="h-3 w-3" />
                Demo Mode Active
              </span>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <select
            value={settings.currency}
            onChange={handleCurrencyChange}
            aria-label="Select Currency"
            className="h-9 rounded-lg border border-gray-700 bg-gray-900/90 px-2 py-1 text-xs font-medium text-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 light:border-gray-300 light:bg-white light:text-gray-800"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-900/90 text-gray-300 transition-colors hover:border-gray-600 hover:text-white light:border-gray-300 light:bg-white light:text-gray-700 light:hover:bg-gray-100"
          >
            {settings.theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>

          {/* Demo Data Button */}
          {expenses.length === 0 && (
            <button
              onClick={loadDemoData}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 text-xs font-semibold text-teal-400 transition-all hover:bg-teal-500/20 hover:border-teal-500/50 light:bg-teal-50 light:text-teal-700"
            >
              <Database className="h-3.5 w-3.5" />
              Demo Data
            </button>
          )}

          {/* Reset All Data Button */}
          {expenses.length > 0 && (
            <button
              onClick={() => setIsResetModalOpen(true)}
              title="Reset All Data"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 bg-gray-900/80 text-gray-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 light:border-gray-200 light:bg-white light:text-gray-600 light:hover:bg-rose-50 light:hover:text-rose-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Add Expense Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            id="add-expense-navbar-btn"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/30 transition-all hover:bg-emerald-500 active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
