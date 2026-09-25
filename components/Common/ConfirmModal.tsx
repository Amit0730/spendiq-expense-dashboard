'use client';

import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { isResetModalOpen, setIsResetModalOpen, resetAllData } = useExpenses();

  if (!isResetModalOpen) return null;

  const handleConfirm = () => {
    resetAllData();
    setIsResetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="glass-card w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0f1420] p-6 shadow-2xl light:border-rose-200 light:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 light:bg-rose-50 light:text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white light:text-gray-900">
              Reset All Expense Data?
            </h3>
            <p className="mt-1 text-xs text-gray-400 light:text-gray-600 leading-relaxed">
              This will permanently delete all logged expenses, reset your monthly budget, and restore the dashboard to its clean initial state. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(false)}
            className="rounded-xl border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 light:border-gray-300 light:text-gray-700 light:hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            id="confirm-reset-all-data-btn"
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/30 hover:bg-rose-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Yes, Reset Everything</span>
          </button>
        </div>
      </div>
    </div>
  );
};
