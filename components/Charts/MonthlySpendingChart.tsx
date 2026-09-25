'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currencySymbol?: string;
}

const CustomMonthlyTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  currencySymbol = '$',
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/95 p-3 shadow-xl backdrop-blur-md light:border-gray-200 light:bg-white/95">
        <p className="text-xs font-semibold text-gray-300 light:text-gray-700">{label}</p>
        <p className="mt-1 text-base font-bold text-emerald-400 light:text-emerald-600">
          {currencySymbol}
          {data.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[11px] text-gray-400 light:text-gray-500">
          {data.count} {data.count === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>
    );
  }
  return null;
};

export const MonthlySpendingChart: React.FC = () => {
  const { monthlyStats, settings, isMounted } = useExpenses();
  const { currencySymbol } = settings;

  if (!isMounted) {
    return <div className="h-64 w-full animate-pulse rounded-xl bg-gray-800/40" />;
  }

  if (monthlyStats.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 p-6 text-center text-gray-500 light:border-gray-300">
        <p className="text-sm">No monthly data available yet.</p>
        <p className="text-xs text-gray-600 light:text-gray-400 mt-1">Expenses will appear here as you log them.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.5} />
          <XAxis
            dataKey="monthName"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => `${currencySymbol}${value}`}
          />
          <Tooltip content={<CustomMonthlyTooltip currencySymbol={currencySymbol} />} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {monthlyStats.map((entry, index) => {
              // Highlight the most recent month
              const isLatest = index === monthlyStats.length - 1;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isLatest ? '#10b981' : '#3b82f6'}
                  opacity={isLatest ? 1 : 0.75}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
