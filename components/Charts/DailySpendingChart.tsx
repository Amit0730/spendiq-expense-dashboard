'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  currencySymbol?: string;
}

const CustomDailyTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  currencySymbol = '$',
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/95 p-3 shadow-xl backdrop-blur-md light:border-gray-200 light:bg-white/95">
        <p className="text-xs font-semibold text-gray-300 light:text-gray-700">{data.dayLabel}</p>
        <p className="mt-1 text-base font-bold text-teal-400 light:text-teal-600">
          {currencySymbol}
          {data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[11px] text-gray-400 light:text-gray-500 font-mono">
          {data.date}
        </p>
      </div>
    );
  }
  return null;
};

export const DailySpendingChart: React.FC = () => {
  const { dailyStats, settings, isMounted } = useExpenses();
  const { currencySymbol } = settings;

  if (!isMounted) {
    return <div className="h-64 w-full animate-pulse rounded-xl bg-gray-800/40" />;
  }

  if (dailyStats.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 p-6 text-center text-gray-500 light:border-gray-300">
        <p className="text-sm">No daily transaction activity this month.</p>
        <p className="text-xs text-gray-600 light:text-gray-400 mt-1">Daily trend will map out as you log expenses.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="dailySpendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.5} />
          <XAxis
            dataKey="dayLabel"
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
          <Tooltip content={<CustomDailyTooltip currencySymbol={currencySymbol} />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#14b8a6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#dailySpendGrad)"
            activeDot={{ r: 5, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
