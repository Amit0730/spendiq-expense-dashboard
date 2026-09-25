'use client';

import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import {
  SlidersHorizontal,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

export const BudgetCard: React.FC = () => {
  const { budget, updateBudget, metrics, settings } = useExpenses();
  const [isEditing, setIsEditing] = useState(false);
  const [limitInput, setLimitInput] = useState(budget.monthlyLimit.toString());

  const { currencySymbol } = settings;
  const spent = metrics.thisMonthSpending;
  const limit = budget.monthlyLimit;
  const remaining = limit - spent;
  const percentageUsed = limit > 0 ? (spent / limit) * 100 : 0;
  const clampedPercentage = Math.min(percentageUsed, 100);

  const isExceeded = limit > 0 && spent > limit;
  const isApproaching = limit > 0 && !isExceeded && percentageUsed >= budget.alertThreshold;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(limitInput);
    if (!isNaN(val) && val >= 0) {
      updateBudget(val);
      setIsEditing(false);
    }
  };

  const openEditor = () => {
    setLimitInput(budget.monthlyLimit.toString());
    setIsEditing(true);
  };

  const formatMoney = (amount: number) => {
    return `${currencySymbol}${Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className={`glass-card relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all ${
      isExceeded
        ? 'border-rose-500/50 bg-rose-950/20'
        : isApproaching
        ? 'border-amber-500/40 bg-amber-950/15'
        : 'border-gray-800'
    }`}>
      {/* Top Banner if Budget Exceeded */}
      {isExceeded && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-rose-500/15 border border-rose-500/30 px-3.5 py-2.5 text-rose-300 light:bg-rose-50 light:border-rose-200 light:text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-400 light:text-rose-600 shrink-0 animate-pulse" />
            <span className="font-extrabold text-sm tracking-wide uppercase">
              Budget exceeded
            </span>
          </div>
          <span className="text-xs font-semibold">
            +{formatMoney(spent - limit)} over limit
          </span>
        </div>
      )}

      {/* Warning Banner if Approaching */}
      {isApproaching && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-amber-500/15 border border-amber-500/30 px-3.5 py-2.5 text-amber-300 light:bg-amber-50 light:border-amber-200 light:text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 light:text-amber-600 shrink-0" />
            <span className="font-semibold text-xs tracking-wide">
              Approaching monthly limit ({percentageUsed.toFixed(0)}% reached)
            </span>
          </div>
          <span className="text-xs font-medium">
            {formatMoney(remaining)} remaining
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white light:text-gray-900">
              Monthly Budget
            </h2>
            {isExceeded ? (
              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400 uppercase">
                Exceeded
              </span>
            ) : isApproaching ? (
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400 uppercase">
                Warning ({percentageUsed.toFixed(0)}%)
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
                On Track
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 light:text-gray-500 mt-0.5">
            Spending pace for the active calendar month
          </p>
        </div>

        <button
          onClick={openEditor}
          className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/80 px-2.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-gray-600 hover:text-white light:border-gray-300 light:bg-gray-100 light:text-gray-700 light:hover:bg-gray-200"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Edit Budget</span>
        </button>
      </div>

      {/* Edit Budget Inline Form */}
      {isEditing && (
        <form onSubmit={handleSaveBudget} className="mt-4 rounded-xl border border-gray-700 bg-gray-900/90 p-3 light:border-gray-300 light:bg-gray-50">
          <label className="block text-xs font-medium text-gray-300 light:text-gray-700 mb-1.5">
            Set Monthly Budget Target ({currencySymbol}):
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="10"
                min="0"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-1.5 pl-8 pr-3 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 light:border-gray-300 light:bg-white light:text-gray-900"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800 light:border-gray-300 light:text-gray-700 light:hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-400 light:text-gray-600">
            {percentageUsed.toFixed(1)}% used
          </span>
          <span className="font-semibold text-gray-200 light:text-gray-800">
            {formatMoney(spent)} / {formatMoney(limit)}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800 light:bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isExceeded
                ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                : isApproaching
                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                : 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
            }`}
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>
      </div>

      {/* Financial Overview 3-Stat Grid */}
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-800/80 pt-4 light:border-gray-200">
        <div>
          <span className="block text-[11px] text-gray-400 light:text-gray-500">Monthly Budget</span>
          <span className="mt-0.5 block text-sm sm:text-base font-bold text-white light:text-gray-900">
            {formatMoney(limit)}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-gray-400 light:text-gray-500">Amount Spent</span>
          <span className={`mt-0.5 block text-sm sm:text-base font-bold ${
            isExceeded ? 'text-rose-400 light:text-rose-600' : 'text-gray-200 light:text-gray-800'
          }`}>
            {formatMoney(spent)}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-gray-400 light:text-gray-500">
            {remaining >= 0 ? 'Remaining' : 'Over Limit'}
          </span>
          <span className={`mt-0.5 block text-sm sm:text-base font-bold ${
            remaining < 0
              ? 'text-rose-400 light:text-rose-600 font-extrabold'
              : 'text-emerald-400 light:text-emerald-600'
          }`}>
            {remaining < 0 ? `-${formatMoney(remaining)}` : formatMoney(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
};
