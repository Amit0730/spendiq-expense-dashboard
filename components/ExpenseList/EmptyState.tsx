'use client';

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Plus, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const { setIsAddModalOpen, loadDemoData } = useExpenses();

  return (
    <div className="glass-card relative overflow-hidden rounded-3xl border border-gray-800 p-8 sm:p-12 text-center">
      {/* Decorative gradient glow background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-md">
        {/* Brand Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-400/20 border border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-500/10 mb-4">
          <TrendingUp className="h-8 w-8" />
        </div>

        {/* Heading & Subtitle exactly as required */}
        <h3 className="text-xl font-bold tracking-tight text-white light:text-gray-900">
          No expenses yet
        </h3>
        <p className="mt-2 text-sm text-gray-400 light:text-gray-600 leading-relaxed">
          Add your first expense to start understanding your spending.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            id="empty-state-add-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>

          <button
            onClick={loadDemoData}
            id="empty-state-demo-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/10 px-5 py-3 text-sm font-semibold text-teal-300 transition-all hover:bg-teal-500/20 hover:border-teal-500/60 light:bg-teal-50 light:text-teal-800"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load Demo Data</span>
          </button>
        </div>

        {/* Security assurance */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 light:text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500/80" />
          <span>All data remains strictly stored in your local browser storage</span>
        </div>
      </div>
    </div>
  );
};
