'use client';

import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORY_DETAILS } from '../../lib/constants';
import {
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const ExpenseTable: React.FC = () => {
  const {
    filteredExpenses,
    deleteExpense,
    setEditingExpense,
    settings,
  } = useExpenses();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { currencySymbol } = settings;

  const formatDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDeleteConfirm = (id: string) => {
    deleteExpense(id);
    setDeletingId(null);
  };

  if (filteredExpenses.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border-gray-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800/80 text-gray-400 light:bg-gray-100 light:text-gray-500 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-white light:text-gray-900">
          No matching transactions found
        </h4>
        <p className="mt-1 text-xs text-gray-400 light:text-gray-500">
          Try adjusting your search query, category filter, or date range.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl border-gray-800">
      {/* Desktop Table View (Visible on md and larger) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-gray-900/60 text-[11px] font-semibold uppercase tracking-wider text-gray-400 light:border-gray-200 light:bg-gray-50 light:text-gray-500">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Expense Name
              </th>
              <th scope="col" className="px-5 py-3.5">
                Category
              </th>
              <th scope="col" className="px-5 py-3.5">
                Date
              </th>
              <th scope="col" className="px-5 py-3.5">
                Note
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Amount
              </th>
              <th scope="col" className="px-5 py-3.5 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 light:divide-gray-200">
            {filteredExpenses.map((expense) => {
              const catMeta = CATEGORY_DETAILS[expense.category] || CATEGORY_DETAILS.Other;
              return (
                <tr
                  key={expense.id}
                  className="transition-colors hover:bg-gray-800/30 light:hover:bg-gray-50/80"
                >
                  {/* Title */}
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-white light:text-gray-900">
                      {expense.title}
                    </span>
                  </td>

                  {/* Category Badge */}
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border"
                      style={{
                        backgroundColor: catMeta.bgColor,
                        color: catMeta.textColor,
                        borderColor: catMeta.borderColor,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: catMeta.color }}
                      />
                      {expense.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 text-gray-300 light:text-gray-600 font-mono text-[11px]">
                    {formatDate(expense.date)}
                  </td>

                  {/* Note */}
                  <td className="px-5 py-3.5 text-gray-400 light:text-gray-500 max-w-[200px] truncate" title={expense.note}>
                    {expense.note ? expense.note : '—'}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-white light:text-gray-900 text-sm">
                    {currencySymbol}
                    {expense.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        title="Edit Expense"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white light:text-gray-500 light:hover:bg-gray-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(expense.id)}
                        title="Delete Expense"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 light:text-gray-500 light:hover:bg-rose-50 light:hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (Visible on small screens) */}
      <div className="divide-y divide-gray-800/80 md:hidden light:divide-gray-200">
        {filteredExpenses.map((expense) => {
          const catMeta = CATEGORY_DETAILS[expense.category] || CATEGORY_DETAILS.Other;
          return (
            <div key={expense.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white light:text-gray-900 text-sm">
                    {expense.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
                      style={{
                        backgroundColor: catMeta.bgColor,
                        color: catMeta.textColor,
                        borderColor: catMeta.borderColor,
                      }}
                    >
                      {expense.category}
                    </span>
                    <span className="text-[11px] text-gray-400 light:text-gray-500 font-mono">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-white light:text-gray-900 font-mono">
                    {currencySymbol}
                    {expense.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {expense.note && (
                <p className="text-xs text-gray-400 light:text-gray-600 rounded-lg bg-gray-900/50 p-2 border border-gray-800/60 light:bg-gray-50 light:border-gray-200">
                  {expense.note}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800/60 px-2.5 py-1 text-xs text-gray-300 light:border-gray-300 light:bg-gray-100 light:text-gray-700"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingId(expense.id)}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-400 light:bg-rose-50 light:text-rose-600"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-[#0f1420] p-5 shadow-2xl light:border-gray-300 light:bg-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 light:bg-rose-50 light:text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white light:text-gray-900">
                  Delete Expense?
                </h3>
                <p className="text-xs text-gray-400 light:text-gray-500">
                  This transaction will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-gray-700 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 light:border-gray-300 light:text-gray-700 light:hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
