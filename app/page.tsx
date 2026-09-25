'use client';

import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Navbar } from '../components/Navbar';
import { StatCards } from '../components/Dashboard/StatCards';
import { BudgetCard } from '../components/Budget/BudgetCard';
import { AnalyticsSection } from '../components/Analytics/AnalyticsSection';
import { ExpenseFilters } from '../components/ExpenseList/ExpenseFilters';
import { ExpenseTable } from '../components/ExpenseList/ExpenseTable';
import { EmptyState } from '../components/ExpenseList/EmptyState';
import { ExpenseModal } from '../components/ExpenseForm/ExpenseModal';
import { ConfirmModal } from '../components/Common/ConfirmModal';
import { PrivacyNotice } from '../components/Common/PrivacyNotice';
import { MonthlySpendingChart } from '../components/Charts/MonthlySpendingChart';
import {
  Plus,
  Sparkles,
  BarChart3,
  Receipt,
  Download,
} from 'lucide-react';
import { exportExpensesToCSV } from '../lib/export';

export default function HomePage() {
  const {
    expenses,
    filteredExpenses,
    isMounted,
    setIsAddModalOpen,
    loadDemoData,
    isDemoMode,
    settings,
  } = useExpenses();

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <span className="text-xs font-medium text-gray-400">Loading SpendIQ...</span>
        </div>
      </div>
    );
  }

  const hasExpenses = expenses.length > 0;

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 light:bg-slate-50 light:text-gray-900 transition-colors">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Banner / Quick Actions Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800/80 pb-4 light:border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white light:text-gray-900 flex items-center gap-2">
              Expense Overview & Financial Intelligence
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 light:text-gray-600">
              Track manual expenses, inspect monthly trajectory, and monitor your budget in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!hasExpenses ? (
              <button
                onClick={loadDemoData}
                id="load-demo-hero-btn"
                className="flex items-center gap-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 px-3.5 py-2 text-xs font-semibold text-teal-300 transition-colors hover:bg-teal-500/20 light:bg-teal-50 light:text-teal-800"
              >
                <Sparkles className="h-4 w-4" />
                <span>Load Demo Data</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => exportExpensesToCSV(filteredExpenses.length > 0 ? filteredExpenses : expenses, settings.currencySymbol)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-900/80 px-3 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-gray-600 hover:text-white light:border-gray-300 light:bg-white light:text-gray-700 light:hover:bg-gray-100"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>

                {!isDemoMode && (
                  <button
                    onClick={loadDemoData}
                    className="flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300 transition-colors hover:bg-teal-500/20 light:bg-teal-50 light:text-teal-800"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Sample Data</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              id="hero-add-expense-btn"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* If no expenses: show Polished Empty State */}
        {!hasExpenses ? (
          <EmptyState />
        ) : (
          <>
            {/* 1. Dashboard Metrics (7 Key Stats) */}
            <section aria-label="Key Dashboard Metrics">
              <StatCards />
            </section>

            {/* 2. Budget and Quick Monthly Chart Row */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12" aria-label="Budget and Trajectory">
              {/* Monthly Budget Card */}
              <div className="lg:col-span-6 xl:col-span-5">
                <BudgetCard />
              </div>

              {/* Monthly Spending Quick Chart */}
              <div className="glass-card rounded-2xl p-5 lg:col-span-6 xl:col-span-7 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white light:text-gray-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-emerald-400" />
                      Monthly Spending Trajectory
                    </h3>
                    <p className="text-xs text-gray-400 light:text-gray-500">
                      Historical and current month totals
                    </p>
                  </div>
                </div>
                <MonthlySpendingChart />
              </div>
            </section>

            {/* 3. Deep Analytics Section (Category Breakdown, Daily Velocity, Rankings) */}
            <AnalyticsSection />

            {/* 4. Expense List Section (Search, Filters, Sorting, Table & Cards) */}
            <section className="space-y-4" aria-label="Transaction Records">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white light:text-gray-900 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-emerald-400" />
                    Transaction History
                  </h2>
                  <p className="text-xs text-gray-400 light:text-gray-500">
                    Search, filter by category or date, and edit individual transactions
                  </p>
                </div>
              </div>

              {/* Filters toolbar */}
              <ExpenseFilters />

              {/* Table / Mobile Cards */}
              <ExpenseTable />
            </section>
          </>
        )}

        {/* Local device privacy footer */}
        <PrivacyNotice />
      </main>

      {/* Modals */}
      <ExpenseModal />
      <ConfirmModal />
    </div>
  );
}
