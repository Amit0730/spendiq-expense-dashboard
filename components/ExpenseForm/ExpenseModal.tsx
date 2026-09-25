'use client';

import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryType } from '../../types/expense';
import { CATEGORIES, CATEGORY_DETAILS } from '../../lib/constants';
import {
  X,
  Plus,
  Edit2,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  Receipt,
  HeartPulse,
  Plane,
  HelpCircle,
} from 'lucide-react';

const CATEGORY_ICONS: Record<CategoryType, React.ReactNode> = {
  Food: <UtensilsCrossed className="h-4 w-4" />,
  Transport: <Car className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Entertainment: <Film className="h-4 w-4" />,
  Education: <GraduationCap className="h-4 w-4" />,
  Bills: <Receipt className="h-4 w-4" />,
  Health: <HeartPulse className="h-4 w-4" />,
  Travel: <Plane className="h-4 w-4" />,
  Other: <HelpCircle className="h-4 w-4" />,
};

const QUICK_SUGGESTIONS = [
  'Groceries',
  'Coffee & Snack',
  'Uber Ride',
  'Dinner Out',
  'Gasoline / Fuel',
  'Mobile Bill',
  'Gym Fee',
  'Flight Ticket',
];

export const ExpenseModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    updateExpense,
    settings,
  } = useExpenses();

  const { currencySymbol } = settings;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ title?: string; amount?: string; date?: string }>({});

  const isEditing = Boolean(editingExpense);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNote(editingExpense.note || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(getTodayString());
      setNote('');
    }
    setErrors({});
  }, [editingExpense, isAddModalOpen]);

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingExpense(null);
  };

  const setPresetDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; amount?: string; date?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Expense title is required';
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!date) {
      newErrors.date = 'Please pick a valid date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && editingExpense) {
      updateExpense(editingExpense.id, {
        title: title.trim(),
        amount: numAmount,
        category,
        date,
        note: note.trim() || undefined,
      });
    } else {
      addExpense({
        title: title.trim(),
        amount: numAmount,
        category,
        date,
        note: note.trim() || undefined,
      });
    }

    closeModal();
  };

  if (!isAddModalOpen && !editingExpense) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="glass-card relative w-full max-w-lg rounded-2xl border border-gray-700 bg-[#0f1420] p-6 shadow-2xl light:border-gray-300 light:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 light:border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700">
              {isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white light:text-gray-900">
                {isEditing ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <p className="text-xs text-gray-400 light:text-gray-500">
                {isEditing ? 'Update transaction details' : 'Log a recent purchase or expense'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close Modal"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white light:text-gray-500 light:hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 light:text-gray-700 mb-1.5">
              Amount ({currencySymbol}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-emerald-400 text-lg">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                className={`w-full rounded-xl border bg-gray-900/90 py-3 pl-10 pr-4 text-xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 light:bg-gray-50 light:text-gray-900 ${
                  errors.amount
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/30 light:border-gray-300'
                }`}
                autoFocus
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-400">{errors.amount}</p>
            )}
          </div>

          {/* Title Input & Quick Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 light:text-gray-700 mb-1.5">
              Expense Name / Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Whole Foods groceries, Subway pass"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`w-full rounded-xl border bg-gray-900/90 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 light:bg-gray-50 light:text-gray-900 ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/30 light:border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400">{errors.title}</p>
            )}

            {/* Quick Suggestions Chips */}
            {!isEditing && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setTitle(item);
                      if (item.includes('Groceries') || item.includes('Dinner') || item.includes('Coffee')) setCategory('Food');
                      else if (item.includes('Uber') || item.includes('Gasoline')) setCategory('Transport');
                      else if (item.includes('Gym')) setCategory('Health');
                      else if (item.includes('Bill')) setCategory('Bills');
                      else if (item.includes('Flight')) setCategory('Travel');
                    }}
                    className="rounded-md border border-gray-800 bg-gray-900/50 px-2 py-0.5 text-[11px] text-gray-400 hover:border-gray-700 hover:text-white light:border-gray-200 light:bg-gray-100 light:text-gray-600 light:hover:bg-gray-200"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 light:text-gray-700 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const meta = CATEGORY_DETAILS[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm light:bg-emerald-50 light:text-emerald-900'
                        : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:text-white light:border-gray-200 light:bg-gray-50 light:text-gray-600'
                    }`}
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-lg shrink-0"
                      style={{
                        backgroundColor: isSelected ? meta.color : meta.bgColor,
                        color: isSelected ? '#ffffff' : meta.color,
                      }}
                    >
                      {CATEGORY_ICONS[cat]}
                    </span>
                    <span className="truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker with Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 light:text-gray-700">
                Date *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPresetDate(0)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Today
                </button>
                <span className="text-gray-600">•</span>
                <button
                  type="button"
                  onClick={() => setPresetDate(1)}
                  className="text-[11px] text-gray-400 hover:underline"
                >
                  Yesterday
                </button>
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              className="w-full rounded-xl border border-gray-700 bg-gray-900/90 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 light:border-gray-300 light:bg-gray-50 light:text-gray-900"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-rose-400">{errors.date}</p>
            )}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 light:text-gray-700 mb-1.5">
              Optional Note
            </label>
            <textarea
              rows={2}
              placeholder="Add memo, vendor, or details (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-900/90 px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 light:border-gray-300 light:bg-gray-50 light:text-gray-900 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800 light:border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 light:border-gray-300 light:text-gray-700 light:hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-expense-btn"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 active:scale-95"
            >
              {isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{isEditing ? 'Save Changes' : 'Add Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
